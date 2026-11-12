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
    const cv = formData.get("cv");

    if (!jobUrl) {
      return NextResponse.json({ error: "Indique o URL da oportunidade." }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(jobUrl);
    } catch {
      return NextResponse.json({ error: "O URL indicado não é válido." }, { status: 400 });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return NextResponse.json({ error: "A oportunidade deve utilizar um URL HTTP ou HTTPS." }, { status: 400 });
    }

    if (!(cv instanceof File)) {
      return NextResponse.json({ error: "Carregue o seu CV em PDF ou DOCX." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(cv.type)) {
      return NextResponse.json({ error: "Formato não suportado. Utilize PDF ou DOCX." }, { status: 400 });
    }

    if (cv.size > MAX_CV_SIZE) {
      return NextResponse.json({ error: "O CV excede o limite de 8 MB." }, { status: 413 });
    }

    return NextResponse.json({
      status: "received",
      message: "Submissão validada. O motor de extração de vagas, leitura de CV e análise ainda precisa de ser configurado.",
      nextStep: "configure_document_extraction_and_analysis",
      jobDomain: parsedUrl.hostname,
      file: { name: cv.name, size: cv.size, type: cv.type },
      analysisId: null,
    }, { status: 202 });
  } catch {
    return NextResponse.json({ error: "Não foi possível processar a submissão. Tente novamente." }, { status: 500 });
  }
}
