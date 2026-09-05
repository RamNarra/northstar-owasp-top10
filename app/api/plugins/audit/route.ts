import { NextRequest, NextResponse } from "next/server";
import { DEPLOYMENT_MANIFEST, verifySupplyChainAudit } from "@/lib/vulnerabilities/a03-supply-chain";

export async function GET() {
  return NextResponse.json({
    manifest: DEPLOYMENT_MANIFEST,
    buildPipeline: "GitHub Actions #10492 -> Northstar Prod",
    targetEnv: "production-west",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const packageName = body.packageName || "";
    const result = verifySupplyChainAudit(packageName);

    return NextResponse.json({
      ...result,
      breachTriggered: result.success,
      flag: result.success ? "NORTHSTAR{supply_chain_unverified_provenance_a03}" : undefined,
    });
  } catch (_err) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }
}
