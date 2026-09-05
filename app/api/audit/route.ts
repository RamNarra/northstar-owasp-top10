import { NextResponse } from "next/server";
import { vulnerableAuditLogReview } from "@/lib/vulnerabilities/a09-logging";

export async function GET() {
  const auditData = vulnerableAuditLogReview();
  return NextResponse.json({
    ...auditData,
    breachTriggered: true,
    flag: "NORTHSTAR{silent_failures_no_audit_logging_a09}",
  });
}
