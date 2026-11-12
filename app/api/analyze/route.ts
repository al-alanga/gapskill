import { NextResponse } from "next/server";
import { analyzeTexts } from "@/lib/analysis";
import { extractDocumentText, MAX_DOCUMENT_BYTES } from "@/lib/document-text";
import { normalizeJobText, validateJobUrl } from "@/lib/job-text";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobUrlRaw = String(formData.get("jobUrl") ?? "").trim();
    const manualJobText = String(formData.get("jobText") ?? "").trim();
    const consent = String(formData.get("consent") ?? "") === "true";
    const cv = formData.get("cv");

    if (!consent) return NextResponse.json({ error: "É necessário autorizar o tratamento dos dados para esta análise." }, { status: 400 });
    if (!manualJobText && !jobUrlRaw) return NextResponse.json({ error: "Indique o URL ou cole a descrição da oportunidade." }, { status: 400 });
    if (!(cv instanceof File) || cv.size === 0) return NextResponse.json({ error: "Carregue o seu CV em PDF ou DOCX." }, { status: 400 });
    if (cv.size > MAX_DOCUMENT_BYTES) return NextResponse.json({ error: "O CV excede o limite de 8 MB." }, { status: 413 });

    const extension = cv.name.toLowerCase().split(".").pop();
    if (!ALLOWED_TYPES.has(cv.type) || !["pdf", "docx"].includes(extension ?? "")) {
      return NextResponse.json({ error: "Formato não suportado. Utilize PDF ou DOCX." }, { status: 400 });
    }

    let jobText = "";
    let jobDomain: string | null = null;
    if (manualJobText) {
      jobText = normalizeJobText(manualJobText);
    } else {
      const jobUrl = validateJobUrl(jobUrlRaw);
      jobDomain = jobUrl.hostname;
      return NextResponse.json({
        error: "A leitura automática deste URL ainda não está ativada. Cole a descrição completa da vaga no campo de texto e volte a submeter o CV.",
        code: "JOB_TEXT_REQUIRED",
        jobDomain,
      }, { status: 422 });
    }

    const { text: cvText } = await extractDocumentText(cv);
    const report = analyzeTexts(jobText, cvText);
    return NextResponse.json({
      status: "completed",
      analysisId: crypto.randomUUID(),
      source: "manual_job_text",
      file: { name: cv.name, size: cv.size, type: cv.type },
      report,
      persistence: "not_configured",
    }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível concluir a análise.";
    const status = /URL válido|HTTP\/HTTPS|endereço não pode|portas Web/.test(message) ? 400 : /Formato não suportado/.test(message) ? 400 : /excede o limite/.test(message) ? 413 : 422;
    return NextResponse.json({ error: message }, { status });
  }
}
