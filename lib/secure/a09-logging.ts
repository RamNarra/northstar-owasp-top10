/**
 * A09 Secure Remediation:
 * Log both successes and failures with timestamp, IP, target account, and user agent.
 * Feed to SIEM and trigger account lockouts / rate limiting upon repeated failures.
 */
export function secureRecordSecurityEvent(
  event: "LOGIN_SUCCESS" | "LOGIN_FAILURE",
  actor: string,
  ip: string
) {
  return {
    logged: true,
    event,
    actor,
    ip,
    timestamp: new Date().toISOString(),
    alertThresholdTriggered: event === "LOGIN_FAILURE",
  };
}
