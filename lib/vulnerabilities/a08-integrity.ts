import crypto from "crypto";

/**
 * A08: Software or Data Integrity Failures
 * Educational vulnerability: the server trusts a checksum supplied by the
 * same client that supplied the configuration, so an attacker can change
 * both the configuration and its integrity claim.
 */
export function vulnerableImportConfiguration(configObj: Record<string, unknown>, clientChecksum: string) {
  const serialized = JSON.stringify(configObj);
  const calculatedHash = crypto.createHash("sha256").update(serialized).digest("hex");
  const isMatch = calculatedHash.toLowerCase() === clientChecksum.trim().toLowerCase();

  return {
    verified: isMatch,
    calculatedHash,
    providedChecksum: clientChecksum,
    appliedConfig: isMatch ? configObj : null,
    status: isMatch ? "TRUSTED_INTEGRITY_VERIFIED" : "CHECKSUM_MISMATCH",
  };
}
