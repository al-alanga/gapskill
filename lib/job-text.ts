import { isIP } from "node:net";
export const MAX_JOB_TEXT_CHARS = 30_000;
export function validateJobUrl(raw: string): URL {
  let url: URL;
  try { url = new URL(raw); } catch { throw new Error("Indique um URL válido ou cole a descrição da vaga."); }
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("O URL deve utilizar HTTP/HTTPS e não pode conter credenciais.");
  if (url.port && !["80", "443"].includes(url.port)) throw new Error("Por segurança, só são aceites URLs nas portas Web padrão.");
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host === "metadata.google.internal" || host === "169.254.169.254" || host === "0.0.0.0" || host === "::1" || host.startsWith("fc") || host.startsWith("fd") || host.startsWith("fe80:")) throw new Error("Este endereço não pode ser utilizado.");
  if (isIP(host) === 4 && (host.startsWith("10.") || host.startsWith("127.") || host.startsWith("192.168.") || host.startsWith("169.254.") || /^172\.(1[6-9]|2\d|3[01])\./.test(host))) throw new Error("Este endereço não pode ser utilizado.");
  return url;
}
export function normalizeJobText(text: string): string {
  const cleaned = text.replace(/\u0000/g, "").trim();
  if (!cleaned) throw new Error("Cole a descrição da vaga para continuar.");
  if (cleaned.length > MAX_JOB_TEXT_CHARS) throw new Error("A descrição da vaga excede o limite de 30.000 caracteres.");
  return cleaned;
}
/** URL fetching stays disabled until DNS/IP and redirect validation is implemented in an isolated fetcher. */
