import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "gapskill",
    timestamp: new Date().toISOString(),
    capabilities: {
      jobUrlExtraction: "not_configured",
      cvParsing: "not_configured",
      aiAnalysis: "not_configured",
      whatsapp: "not_configured",
      database: "not_configured",
    },
  });
}
