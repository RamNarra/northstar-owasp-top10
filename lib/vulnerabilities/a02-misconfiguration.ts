/**
 * A02: Security Misconfiguration
 * Educational Vulnerability:
 * Internal debug flags, environment diagnostic details, and build settings
 * are accessible in production via an unauthenticated public route.
 */
export function vulnerableGetDebugConfig() {
  return {
    environment: "production",
    debug: true,
    verbose_errors: true,
    build: "v2.4.1-rc3",
    diagnostic_channel: "internal-telemetry-pubsub",
    server_time: new Date().toISOString(),
    trace_id: "tr-90218-prod",
  };
}
