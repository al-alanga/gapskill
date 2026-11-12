import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "gapskill",
    timestamp: new Date().toISOString(),
    capabilities: {
      manualJobText: "enabled",
      pdfDocxTextExtraction: "enabled",
      deterministicSkillMatching: "enabled",
      jobUrlFetching: "disabled_pending_ssrf_safe_fetcher",
      aiAnalysis: "not_configured",
      database: "not_configured",
      whatsapp: "not_configured",
    },
  });
}
