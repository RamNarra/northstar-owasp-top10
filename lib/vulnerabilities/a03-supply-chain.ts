export interface ManifestPackage {
  name: string;
  version: string;
  source: string;
  claimedIntegrity: string;
}

export const DEPLOYMENT_MANIFEST: ManifestPackage[] = [
  {
    name: "northstar-core-ui",
    version: "3.1.0",
    source: "https://cdn.northstar.local/packages/core-ui-3.1.0.tgz",
    claimedIntegrity: "sha512-4a7b8e...",
  },
  {
    name: "northstar-crypto-utils",
    version: "1.0.4",
    source: "https://cdn.northstar.local/packages/crypto-utils-1.0.4.tgz",
    claimedIntegrity: "sha512-9f1c2d...",
  },
  {
    name: "analytics-telemetry-v2",
    version: "2.8.1-mirror",
    source: "http://mirror.untrusted-pkg.net/telemetry/analytics-telemetry-v2.tgz",
    claimedIntegrity: "sha512-f00ba4...",
  },
  {
    name: "northstar-auth-client",
    version: "2.0.1",
    source: "https://cdn.northstar.local/packages/auth-client-2.0.1.tgz",
    claimedIntegrity: "sha512-7e8d1a...",
  },
];

/**
 * A03: Software Supply Chain Failures - Forensic Audit
 * The challenge tests if the student pinpoints the unverified third-party mirror package.
 */
export function verifySupplyChainAudit(identifiedPackage: string) {
  const isCorrect = identifiedPackage.trim().toLowerCase() === "analytics-telemetry-v2";
  return {
    success: isCorrect,
    packageAudited: identifiedPackage,
    untrustedSource: "http://mirror.untrusted-pkg.net/telemetry/analytics-telemetry-v2.tgz",
    reason: isCorrect
      ? "Dependency was fetched from an unverified HTTP mirror outside the trusted CDN boundary without certificate or provenance validation."
      : "The selected package is an official internally signed package hosted on https://cdn.northstar.local.",
  };
}
