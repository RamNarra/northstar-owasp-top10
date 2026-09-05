import { NextRequest, NextResponse } from "next/server";
import { vulnerableExportAccountBackup } from "@/lib/vulnerabilities/a04-crypto";

export async function GET(request: NextRequest) {
  const user = request.nextUrl.searchParams.get("user") || "alex@northstar.local";
  const backup = vulnerableExportAccountBackup(user);
  return NextResponse.json({
    ...backup,
    notice: "Confidential Account Backup Archive. Do not expose.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const decodedPassword = (body.decodedPassword || "").trim();

    const isCorrect = decodedPassword === "password123!";
    return NextResponse.json({
      success: isCorrect,
      breachTriggered: isCorrect,
      flag: isCorrect ? "NORTHSTAR{encoding_is_not_encryption_a04}" : undefined,
      message: isCorrect
        ? "Credential recovered: 'password123!'. Encoding does not provide confidentiality."
        : "Incorrect plaintext. Decode the base64 credential_blob 'cGFzc3dvcmQxMjMh'.",
    });
  } catch (_err) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
