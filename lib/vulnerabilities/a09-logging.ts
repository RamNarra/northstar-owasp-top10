import { INITIAL_AUDIT_LOGS, AuditEvent } from "../fake-db";

/**
 * A09: Security Logging & Alerting Failures
 * Educational Vulnerability:
 * Failed authentication attempts produce no audit events or security alerts.
 * Only successful logins are logged, leaving SOC teams blind to attacks.
 */
export function vulnerableAuditLogReview(): {
  logs: AuditEvent[];
  missingFailedAlerts: boolean;
  summary: string;
} {
  return {
    logs: INITIAL_AUDIT_LOGS,
    missingFailedAlerts: true,
    summary:
      "Audit log contains 4 events (3 successes, 1 system task). 0 failed authentication attempts are logged despite active brute-force traffic.",
  };
}
