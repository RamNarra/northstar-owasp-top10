export interface EvidenceItem {
  chapterId: string;
  source: string;
  timestamp: string;
  alert: string;
  context: string;
}

export const INCIDENT_EVIDENCE: Record<string, EvidenceItem> = {
  A01: {
    chapterId: "A01",
    source: "Customer Support Ticket #8819",
    timestamp: "02:14 UTC",
    alert: "Customer Alex Rivera filed a ticket stating: 'I logged into my account, but when looking at recent invoices I accidentally opened Order #1002 and saw Bob Vance's confidential appliance order.'",
    context: "The portal uses sequential order numbers. The authorization layer might not be verifying if the active user actually owns the requested resource.",
  },
  A02: {
    chapterId: "A02",
    source: "SOC Reconnaissance Log",
    timestamp: "03:45 UTC",
    alert: "External threat intelligence noticed response headers referencing internal debug flags.",
    context: "A developer appears to have pushed a debug configuration endpoint directly into the production deployment.",
  },
  A03: {
    chapterId: "A03",
    source: "CI/CD Pipeline Telemetry",
    timestamp: "04:30 UTC",
    alert: "Build agent recorded an external request to an unverified third-party mirror during deployment bundle creation.",
    context: "Audit the deployment manifests and lockfile to discover which dependency bypassed the trusted internal CDN authority.",
  },
  A04: {
    chapterId: "A04",
    source: "Threat Intelligence Darknet Crawler",
    timestamp: "05:10 UTC",
    alert: "A customer backup archive containing what looks like hashed or encoded credentials was spotted on an external forum.",
    context: "Inspect the backup export format. Is the sensitive credential actually encrypted, or merely encoded?",
  },
  A05: {
    chapterId: "A05",
    source: "Database Access Anomaly Alert",
    timestamp: "06:05 UTC",
    alert: "The customer lookup service suddenly returned restricted internal treasury accounts to a public search box query.",
    context: "The search query appears to concatenate unsanitized user inputs into a backend database filter.",
  },
  A06: {
    chapterId: "A06",
    source: "Finance Fraud Detection Unit",
    timestamp: "06:55 UTC",
    alert: "Multiple e-commerce transactions completed with cumulative discounts exceeding the maximum \$10 allowance.",
    context: "The promotional coupon redemption logic does not verify if the coupon has already been applied to the active checkout session.",
  },
  A07: {
    chapterId: "A07",
    source: "Identity Provider Security Event",
    timestamp: "07:40 UTC",
    alert: "An unprivileged user session ('alex@northstar.local') accessed the protected Executive Administrator Dashboard.",
    context: "Investigate how Northstar Portal inspects and verifies JWT tokens. Does the server actually verify the cryptographic signature before trusting claims?",
  },
  A08: {
    chapterId: "A08",
    source: "Configuration Integrity Monitor",
    timestamp: "08:15 UTC",
    alert: "Modified runtime configuration was accepted into production despite failing centralized checksum verification.",
    context: "The integrity verification endpoint trusts a client-supplied checksum header rather than computing and verifying against a trusted authority.",
  },
  A09: {
    chapterId: "A09",
    source: "Incident Response Post-Mortem Note",
    timestamp: "08:50 UTC",
    alert: "Security team discovered 500+ brute-force login attempts against 'admin@northstar.local' that generated zero security events in the audit log.",
    context: "The authentication failure handler silently fails without recording failed attempts or alerting SIEM systems.",
  },
  A10: {
    chapterId: "A10",
    source: "Treasury Reconciliation Error",
    timestamp: "09:30 UTC",
    alert: "An order for a negative quantity passed through the checkout system and was stamped as 'PAID' instead of being aborted.",
    context: "An arithmetic exception in the calculation routine crashed into a broad catch handler that failed open.",
  },
};
