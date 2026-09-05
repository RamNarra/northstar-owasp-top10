import { NextRequest, NextResponse } from "next/server";
import { CHALLENGES } from "@/lib/challenges";

/**
 * Server-Side Instructor Authentication & Data Provider
 * The passcode is evaluated entirely server-side using INSTRUCTOR_PASSCODE.
 * It is NEVER exposed to the client bundle or via NEXT_PUBLIC_* variables.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const providedPasscode = (body.passcode || "").trim();

    // Server-only environment variable with secure server-side fallback
    const serverPasscode = process.env.INSTRUCTOR_PASSCODE || "northstar-instructor-2025";

    if (!providedPasscode || providedPasscode !== serverPasscode) {
      return NextResponse.json(
        {
          authorized: false,
          error: "Invalid instructor credentials.",
        },
        { status: 401 }
      );
    }

    // Passcode valid: return complete solutions manual to the authenticated instructor session
    const solutions = CHALLENGES.map((ch) => ({
      id: ch.id,
      chapterNumber: ch.chapterNumber,
      owaspId: ch.owaspId,
      owaspTitle: ch.owaspTitle,
      storyTitle: ch.storyTitle,
      tier: ch.tier,
      difficulty: ch.difficulty,
      points: ch.points,
      flag: ch.flag,
      objective: ch.objective,
      hints: ch.hints,
      debrief: ch.debrief,
    }));

    return NextResponse.json({
      authorized: true,
      message: "Instructor credentials verified.",
      solutions,
    });
  } catch (_err) {
    return NextResponse.json(
      { authorized: false, error: "Authentication request malformed." },
      { status: 400 }
    );
  }
}
