import { NextRequest, NextResponse } from "next/server";
import { issueTrainingToken } from "@/lib/vulnerabilities/a07-jwt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    // Training login logic
    if (email === "alex@northstar.local" && password === "training123") {
      const token = await issueTrainingToken("alex@northstar.local", "user");
      return NextResponse.json({
        success: true,
        user: { email: "alex@northstar.local", name: "Alex Rivera", role: "user" },
        token,
        message: "Authentication successful.",
      });
    }

    if (email === "admin@northstar.local" && password === "SuperSecretAdmin2026!") {
      const token = await issueTrainingToken("admin@northstar.local", "admin");
      return NextResponse.json({
        success: true,
        user: { email: "admin@northstar.local", name: "CSO Admin", role: "admin" },
        token,
        message: "Administrator login successful.",
      });
    }

    // Deliberate failure - silent without logging (for A09)
    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials. Attempt dropped silently.",
      },
      { status: 401 }
    );
  } catch (_err) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
