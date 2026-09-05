import crypto from "crypto";

/**
 * A08 Secure Remediation:
 * Verify data integrity against an asymmetric digital signature from a trusted
 * certificate or a pre-shared trusted hash catalog, NEVER the client's own payload.
 */
export function secureVerifyIntegrity(
  payloadData: string,
  signatureBase64: string,
  trustedPublicKeyPem: string
): boolean {
  try {
    const verifier = crypto.createVerify("SHA256");
    verifier.update(payloadData);
    return verifier.verify(trustedPublicKeyPem, signatureBase64, "base64");
  } catch {
    return false;
  }
}
