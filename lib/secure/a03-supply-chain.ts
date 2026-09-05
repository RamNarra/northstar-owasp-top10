/**
 * A03 Secure Remediation:
 * Restrict dependencies to verified internal package registries with strict
 * package-lock.json integrity hashes and publisher signature verification.
 */
export const SECURE_SUPPLY_CHAIN_POLICY = {
  registry: "https://secure-internal-registry.northstar.local",
  requireSignatures: true,
  allowExternalMirrors: false,
  enforceSha512Lockfile: true,
};
