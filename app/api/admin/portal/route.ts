import { NextRequest, NextResponse } from "next/server";
import { vulnerableAuthorizeAdminToken } from "@/lib/vulnerabilities/a07-jwt";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const body = await request.json().catch(() => ({}));
    const token = authHeader.replace(/^Bearer\s+/i, "") || body.token || "";

    if (!token) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }

    const authResult = vulnerableAuthorizeAdminToken(token);

    if (authResult.authorized) {
      return NextResponse.json({
        success: true,
        message: "ACCESS_GRANTED: Welcome to Northstar Executive Administration Portal.",
        role: "admin",
        treasuryBalance: "$4,250,000 USD",
        breachTriggered: true,
        flag: "NORTHSTAR{jwt_signature_verification_missing_a07}",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: authResult.reason,
        claims: authResult.claims,
      },
      { status: 403 }
    );
  } catch (_err) {
    return NextResponse.json({ error: "Authorization handler exception" }, { status: 500 });
  }
}
