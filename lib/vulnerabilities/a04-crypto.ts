import { SYNTHETIC_USERS } from "../fake-db";

/**
 * A04: Cryptographic Failures
 * Educational Vulnerability:
 * Base64 encoding is mistakenly used for credential storage/export under the false belief
 * that encoding equals encryption.
 */
export function vulnerableExportAccountBackup(email: string) {
  const user = SYNTHETIC_USERS[email] || SYNTHETIC_USERS["alex@northstar.local"];
  return {
    export_id: `bk-${user.id}-2026`,
    timestamp: new Date().toISOString(),
    email: user.email,
    name: user.name,
    credential_blob: user.accountBackupB64, // "cGFzc3dvcmQxMjMh" for Alex
    encoding_type: "base64",
  };
}
