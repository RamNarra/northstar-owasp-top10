import crypto from "crypto";

/**
 * A08: Software or Data Integrity Failures
 * Educational Vulnerability:
 * The server computes the SHA256 of the incoming configuration, but compares
 * it against the client-supplied checksum header/field from the SAME untrusted request.
 */
export function vulnerableImportConfiguration(configObj: Record<string, unknown>, clientChecksum: string) {
  const serialized = JSON.stringify(configObj);
  const calculatedHash = crypto.createHash("sha256").update(serialized).digest("hex");

  // VULNERABLE: comparing against client-supplied claim rather than an independent trusted catalog
  const isMatch = calculatedHash.toLowerCase() === clientChecksum.trim().toLowerCase();

  return {
    verified: isMatch,
    calculatedHash,
    providedChecksum: clientChecksum,
    appliedConfig: isMatch ? configObj : null,
    status: isMatch ? "TRUSTED_INTEGRITY_VERIFIED" : "CHECKSUM_MISMATCH",
  };
}
