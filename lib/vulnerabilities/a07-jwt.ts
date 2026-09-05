import { SignJWT, decodeJwt } from "jose";

export const JWT_SECRET = new TextEncoder().encode("northstar-training-secret-key-32b!!");

export interface NorthstarJwtPayload {
  sub: string;
  name: string;
  email: string;
  role: "user" | "admin" | "auditor";
  iat?: number;
  exp?: number;
}

/**
 * Issue a standard signed JWT for training
 */
export async function issueTrainingToken(userEmail: string, role: "user" | "admin" = "user"): Promise<string> {
  return await new SignJWT({
    sub: userEmail,
    email: userEmail,
    name: userEmail === "alex@northstar.local" ? "Alex Rivera" : "Administrator",
    role: role,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(JWT_SECRET);
}

/**
 * A07: Authentication Failures (JWT Centerpiece)
 * Educational Vulnerability:
 * The authorization middleware parses claims using `decodeJwt` without verifying
 * the cryptographic signature. It blindly trusts the "role" claim!
 */
export function vulnerableAuthorizeAdminToken(tokenString: string): {
  authorized: boolean;
  claims: Record<string, unknown> | null;
  reason: string;
} {
  try {
    // VULNERABLE: decodeJwt merely reads the base64url payload without signature verification!
    const claims = decodeJwt(tokenString) as unknown as NorthstarJwtPayload;

    if (!claims || !claims.role) {
      return { authorized: false, claims: null, reason: "Malformed token payload." };
    }

    if (claims.role === "admin") {
      return {
        authorized: true,
        claims: claims as unknown as Record<string, unknown>,
        reason: "ADMIN_ACCESS_GRANTED: Decoded payload claim specifies role 'admin'.",
      };
    }

    return {
      authorized: false,
      claims: claims as unknown as Record<string, unknown>,
      reason: "FORBIDDEN: User role is 'user'. Role 'admin' required for Executive Dashboard.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid token format";
    return { authorized: false, claims: null, reason: `Token decode error: ${message}` };
  }
}
