import { NextResponse } from "next/server";
import { vulnerableGetDebugConfig } from "@/lib/vulnerabilities/a02-misconfiguration";

export async function GET() {
  const debugData = vulnerableGetDebugConfig();
  return NextResponse.json({
    ...debugData,
    breachTriggered: true,
    flag: "NORTHSTAR{debug_endpoint_exposed_a02}",
  });
}
