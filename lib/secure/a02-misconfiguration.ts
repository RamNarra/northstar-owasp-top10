/**
 * A02 Secure Remediation:
 * Disable diagnostic and debug endpoints in production environments.
 * Gate necessary telemetry behind mutual TLS or internal authentication.
 */
export function secureGetDebugConfig() {
  if (process.env.NODE_ENV === "production") {
    return { status: 404, error: "Not Found" };
  }
  return { status: 200, debug: true };
}
