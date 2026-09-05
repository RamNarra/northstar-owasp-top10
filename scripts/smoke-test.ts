/**
 * Northstar Security Incident - Automated Smoke & Exploit Verification Suite
 * Tests all 10 OWASP Top 10:2025 exploits + JWT tampering deterministically.
 */

import { vulnerableGetOrder } from "../lib/vulnerabilities/a01-access-control";
import { vulnerableGetDebugConfig } from "../lib/vulnerabilities/a02-misconfiguration";
import { verifySupplyChainAudit } from "../lib/vulnerabilities/a03-supply-chain";
import { vulnerableExportAccountBackup } from "../lib/vulnerabilities/a04-crypto";
import { vulnerableCustomerSearch } from "../lib/vulnerabilities/a05-injection";
import { vulnerableApplyCoupon } from "../lib/vulnerabilities/a06-business-logic";
import { issueTrainingToken, vulnerableAuthorizeAdminToken } from "../lib/vulnerabilities/a07-jwt";
import { vulnerableImportConfiguration } from "../lib/vulnerabilities/a08-integrity";
import { vulnerableAuditLogReview } from "../lib/vulnerabilities/a09-logging";
import { vulnerableProcessCheckout } from "../lib/vulnerabilities/a10-exception";
import crypto from "crypto";

async function runAllTests() {
  console.log("=================================================");
  console.log("NORTHSTAR SECURITY INCIDENT · TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(title: string, condition: boolean, extraInfo = "") {
    total++;
    if (condition) {
      console.log(`[PASS] ${title}`);
      passed++;
    } else {
      console.error(`[FAIL] ${title} - ${extraInfo}`);
    }
  }

  // A01: Broken Access Control (IDOR)
  const a01 = vulnerableGetOrder("1002");
  assert(
    "A01 IDOR: Alex accessing Bob's order #1002",
    a01.order !== null && a01.order.userId === "usr-102" && a01.isVulnerableExposure
  );

  // A02: Security Misconfiguration
  const a02 = vulnerableGetDebugConfig();
  assert(
    "A02 Misconfiguration: Debug config exposed in production",
    a02.environment === "production" && a02.debug === true && a02.verbose_errors === true
  );

  // A03: Software Supply Chain Failures
  const a03 = verifySupplyChainAudit("analytics-telemetry-v2");
  assert(
    "A03 Supply Chain: Identifies unverified mirror dependency",
    a03.success === true && a03.untrustedSource.includes("untrusted-pkg.net")
  );

  // A04: Cryptographic Failures
  const a04 = vulnerableExportAccountBackup("alex@northstar.local");
  const decodedA04 = Buffer.from(a04.credential_blob, "base64").toString("utf8");
  assert(
    "A04 Crypto: Base64 password decoded without key",
    decodedA04 === "password123!"
  );

  // A05: Injection (SQL Injection)
  const a05 = vulnerableCustomerSearch("' OR '1'='1");
  const containsConfidential = a05.records.some((r) => r.id === 999);
  assert(
    "A05 SQLi: ' OR '1'='1 extracts confidential internal billing account #999",
    a05.injected === true && containsConfidential
  );

  // A06: Insecure Design (Business Logic Multi-Coupon)
  const a06 = vulnerableApplyCoupon(20, "WELCOME10");
  assert(
    "A06 Business Logic: Multi-coupon application reaches >= $30 unauthorized discount",
    a06.success === true && a06.newDiscount === 30 && a06.newTotal === 70
  );

  // A07: Authentication Failures (JWT Centerpiece)
  // Step 1: Issue token for user
  const originalJwt = await issueTrainingToken("alex@northstar.local", "user");
  const parts = originalJwt.split(".");
  // Step 2: Tamper payload to role "admin" without updating HMAC signature
  const payloadObj = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
  payloadObj.role = "admin";
  const tamperedPayloadB64 = Buffer.from(JSON.stringify(payloadObj)).toString("base64url");
  const forgedJwt = `${parts[0]}.${tamperedPayloadB64}.${parts[2]}`; // Original signature retained

  // Step 3: Vulnerable authorization check
  const a07 = vulnerableAuthorizeAdminToken(forgedJwt);
  assert(
    "A07 JWT: Tampered admin claim accepted without valid signature",
    a07.authorized === true && a07.claims?.role === "admin"
  );

  // A08: Software or Data Integrity Failures
  const config = { maintenanceMode: true, bypass: true };
  const configHash = crypto.createHash("sha256").update(JSON.stringify(config)).digest("hex");
  const a08 = vulnerableImportConfiguration(config, configHash);
  assert(
    "A08 Integrity: Server trusts client-supplied checksum",
    a08.verified === true && a08.status === "TRUSTED_INTEGRITY_VERIFIED"
  );

  // A09: Security Logging & Alerting Failures
  const a09 = vulnerableAuditLogReview();
  assert(
    "A09 Logging: Zero failed login attempts recorded in audit trail",
    a09.missingFailedAlerts === true && a09.logs.length > 0
  );

  // A10: Mishandling of Exceptional Conditions
  const a10 = vulnerableProcessCheckout(-1);
  assert(
    "A10 Exception Handling: Negative quantity causes fail-open transaction marked PAID",
    a10.status === "PAID" && a10.failOpenOccurred === true
  );

  console.log("\n-------------------------------------------------");
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log("-------------------------------------------------\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
