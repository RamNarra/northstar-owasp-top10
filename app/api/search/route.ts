import { NextRequest, NextResponse } from "next/server";
import { vulnerableCustomerSearch } from "@/lib/vulnerabilities/a05-injection";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const result = vulnerableCustomerSearch(q);

  const containsInternalRecord = result.records.some((r) => r.id === 999);

  return NextResponse.json({
    ...result,
    breachTriggered: containsInternalRecord,
    flag: containsInternalRecord ? "NORTHSTAR{sqli_dynamic_query_a05}" : undefined,
  });
}
