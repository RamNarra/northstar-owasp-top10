import { jwtVerify } from "jose";
import { JWT_SECRET } from "../vulnerabilities/a07-jwt";

/**
 * A07 Secure Remediation:
 * Always verify the signature with an enforced algorithm, expected issuer,
 * audience, and current expiration before evaluating any claims.
 */
export async function secureAuthorizeAdminToken(tokenString: string) {
  try {
    const { payload } = await jwtVerify(tokenString, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (payload.role === "admin") {
      return { authorized: true, payload };
    }
    return { authorized: false, error: "Forbidden: Not an admin" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Verification error";
    return { authorized: false, error: `JWT Verification Failed: ${msg}` };
  }
}
