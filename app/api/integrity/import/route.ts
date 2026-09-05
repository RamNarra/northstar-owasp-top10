import { NextRequest, NextResponse } from "next/server";
import { vulnerableImportConfiguration } from "@/lib/vulnerabilities/a08-integrity";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = body.config || {};
    const checksum = body.checksum || "";

    const result = vulnerableImportConfiguration(config, checksum);

    const hasMaintenance = config && config.maintenanceMode === true;
    const breachTriggered = result.verified && hasMaintenance;

    return NextResponse.json({
      ...result,
      breachTriggered,
      flag: breachTriggered ? "NORTHSTAR{untrusted_integrity_claim_a08}" : undefined,
    });
  } catch (_err) {
    return NextResponse.json({ error: "Invalid configuration body" }, { status: 400 });
  }
}
