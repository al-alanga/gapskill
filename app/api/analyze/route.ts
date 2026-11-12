import { NextResponse } from "next/server";

const MAX_CV_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobUrl = String(formData.get("jobUrl") ?? "").trim();
    const consent = String(formData.get("consent") ?? "") === "true";
    const cv = formData.get("cv");

    if (!consent) {
      return NextResponse.json({ error: "É necessário autorizar o tratamento dos dados para esta análise." }, { status: 400 });
    }

    if (!jobUrl) {
      return NextResponse.json({ error: "Indique o URL da oportunidade." }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(jobUrl);
    } catch {
      return NextResponse.json({ error: "O URL indicado não é válido." }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol) || parsedUrl.username || parsedUrl.password) {
      return NextResponse.json({ error: "Indique um URL HTTP/HTTPS válido, sem credenciais incorporadas." }, { status: 400 });
    }

    if (!(cv instanceof File) || cv.size === 0) {
      return NextResponse.json({ error: "Carregue o seu CV em PDF ou DOCX." }, { status: 400 });
    }

    const extension = cv.name.toLowerCase().split(".").pop();
    const extensionAllowed = extension === "pdf" || extension === "docx";
    if (!ALLOWED_TYPES.has(cv.type) || !extensionAllowed) {
      return NextResponse.json({ error: "Formato não suportado. Utilize PDF ou DOCX." }, { status: 400 });
    }

    if (cv.size > MAX_CV_SIZE) {
      return NextResponse.json({ error: "O CV excede o limite de 8 MB." }, { status: 413 });
    }

    // This endpoint validates the request only. It intentionally does not fetch
    // the URL or persist the CV until secure extraction, storage and retention
    // controls are implemented.
    return NextResponse.json({
      status: "received",
      message: "Submissão validada. A extração de vagas, leitura do CV e análise ainda não estão ativadas.",
      nextStep: "configure_document_extraction_and_analysis",
      jobDomain: parsedUrl.hostname,
      file: { name: cv.name, size: cv.size, type: cv.type },
      analysisId: null,
    }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar a submissão. Tente novamente." }, { status: 500 });
  }
}
