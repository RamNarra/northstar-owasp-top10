import { NextRequest, NextResponse } from "next/server";
import { vulnerableGetOrder } from "@/lib/vulnerabilities/a01-access-control";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;

  // Extract authenticated user if provided in Authorization header
  let requestingUserId = "usr-101"; // Default to session user Alex Rivera
  const authHeader = request.headers.get("authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    try {
      const raw = authHeader.substring(7);
      const parts = raw.split(".");
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
        if (payload.sub) {
          requestingUserId = payload.sub === "alex@northstar.local" ? "usr-101" : payload.sub;
        }
      }
    } catch {}
  }

  const { order, isVulnerableExposure } = vulnerableGetOrder(params.id, requestingUserId);

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
