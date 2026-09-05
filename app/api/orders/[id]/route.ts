import { NextRequest, NextResponse } from "next/server";
import { vulnerableGetOrder } from "@/lib/vulnerabilities/a01-access-control";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { order, isVulnerableExposure } = vulnerableGetOrder(params.id);

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    order,
    breachTriggered: isVulnerableExposure,
    flag: isVulnerableExposure ? "NORTHSTAR{idor_authorization_bypass_a01}" : undefined,
  });
}
