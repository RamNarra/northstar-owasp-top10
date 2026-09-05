import { NextRequest, NextResponse } from "next/server";
import { vulnerableProcessCheckout } from "@/lib/vulnerabilities/a10-exception";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const quantity = Number(body.quantity);

    const result = vulnerableProcessCheckout(quantity);

    return NextResponse.json({
      ...result,
      breachTriggered: result.failOpenOccurred,
      flag: result.failOpenOccurred ? "NORTHSTAR{fail_open_exception_mishandled_a10}" : undefined,
    });
  } catch (_err) {
    return NextResponse.json({ error: "Unhandled checkout route exception" }, { status: 500 });
  }
}
