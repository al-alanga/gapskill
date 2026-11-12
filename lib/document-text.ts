import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export const MAX_DOCUMENT_BYTES = 8 * 1024 * 1024;
export const MAX_EXTRACTED_CHARS = 120_000;

export async function extractDocumentText(file: File): Promise<{ text: string; type: "pdf" | "docx" }> {
  if (file.size === 0 || file.size > MAX_DOCUMENT_BYTES) throw new Error("O documento está vazio ou excede o limite de 8 MB.");
  const extension = file.name.toLowerCase().split(".").pop();
  const type = extension === "pdf" && file.type === "application/pdf" ? "pdf" : extension === "docx" && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "docx" : null;
  if (!type) throw new Error("Formato não suportado. Utilize PDF ou DOCX.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const raw = type === "pdf" ? (await pdfParse(buffer, { max: 30 })).text : (await mammoth.extractRawText({ buffer })).value;
  const text = raw.replace(/\u0000/g, "").replace(/\r/g, "\n").replace(/[ \t]+/g, " ").trim();
  if (!text) throw new Error("Não foi possível extrair texto. O documento pode ser digitalizado ou estar vazio.");
  if (text.length > MAX_EXTRACTED_CHARS) throw new Error("O documento contém texto acima do limite de processamento.");
  return { text, type };
}
