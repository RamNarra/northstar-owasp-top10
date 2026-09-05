/**
 * A04 Secure Remediation:
 * Never export or store passwords reversibly. Use salted Argon2id / bcrypt.
 * Encrypt backups using authenticated symmetric encryption (AES-256-GCM).
 */
export const SECURE_CRYPTO_STANDARD = {
  passwordStorage: "Argon2id with 64MB memory, 3 iterations, 4 parallelism",
  backupProtection: "AES-256-GCM with customer-controlled KMS key",
  principle: "Encoding (Base64) provides zero confidentiality. Encryption requires keys and algorithms.",
};
