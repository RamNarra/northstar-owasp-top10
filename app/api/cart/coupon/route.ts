import { NextRequest, NextResponse } from "next/server";
import { vulnerableApplyCoupon } from "@/lib/vulnerabilities/a06-business-logic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const currentDiscount = Number(body.currentDiscount) || 0;
    const code = body.code || "";

    const result = vulnerableApplyCoupon(currentDiscount, code);
    const breachTriggered = result.newDiscount >= 30;

    return NextResponse.json({
      ...result,
      breachTriggered,
      flag: breachTriggered ? "NORTHSTAR{business_logic_missing_state_check_a06}" : undefined,
    });
  } catch (_err) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }
}
