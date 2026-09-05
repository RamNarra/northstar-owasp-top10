import crypto from "crypto";

const BASE_URL = process.env.TARGET_URL || "https://northstar-owasp-top10.vercel.app";

async function main() {
  console.log(`=================================================`);
  console.log(`NORTHSTAR SYSTEMS · LIVE PROD ACCEPTANCE TESTS`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`=================================================\n`);

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

  // 1. Pages HTTP 200
  const pages = ["/", "/products", "/products/quantum-vpn-gateway", "/cart", "/partners", "/about", "/account"];
  for (const page of pages) {
    const res = await fetch(`${BASE_URL}${page}`);
    assert(`Page ${page} status 200`, res.status === 200, `Got status ${res.status}`);
  }

  // 2. A01: IDOR
  const a01Res = await fetch(`${BASE_URL}/api/orders/1002`);
  const a01Json = await a01Res.json();
  assert(
    "A01 IDOR: Access order 1002",
    a01Res.status === 200 && a01Json.order?.id === "1002" && a01Json.order?.userId === "usr-102",
    JSON.stringify(a01Json)
  );

  // 3. A02: Security Misconfiguration
  const a02Res = await fetch(`${BASE_URL}/api/debug/config`);
  const a02Json = await a02Res.json();
  assert(
    "A02 Misconfiguration: /api/debug/config exposed in production",
    a02Res.status === 200 && a02Json.debug === true && a02Json.environment === "production",
    JSON.stringify(a02Json)
  );

  // 4. A03: Software Supply Chain
  const a03Res = await fetch(`${BASE_URL}/api/plugins/audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageName: "analytics-telemetry-v2" }),
  });
  const a03Json = await a03Res.json();
  assert(
    "A03 Supply Chain: Audit detects untrusted mirror",
    a03Res.status === 200 && a03Json.success === true && a03Json.untrustedSource?.includes("untrusted-pkg.net"),
    JSON.stringify(a03Json)
  );

  // 5. A04: Cryptographic Failures
  const a04Res = await fetch(`${BASE_URL}/api/account/export?email=alex@northstar.local`);
  const a04Json = await a04Res.json();
  const decodedCreds = a04Json.credential_blob ? Buffer.from(a04Json.credential_blob, "base64").toString("utf8") : "";
  assert(
    "A04 Crypto: Credential blob decodable base64",
    a04Res.status === 200 && decodedCreds === "password123!",
    JSON.stringify(a04Json)
  );

  // 6. A05: SQLi
  const a05Res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent("' OR '1'='1")}`);
  const a05Json = await a05Res.json();
  assert(
    "A05 Injection: SQLi reveals confidential record #999",
    a05Res.status === 200 && a05Json.records?.some((r: any) => r.id === 999),
    `Records count: ${a05Json.records?.length}`
  );

  // 7. A06: Business Logic
  const a06Res = await fetch(`${BASE_URL}/api/cart/coupon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code: "WELCOME10", currentDiscount: 20 }),
  });
  const a06Json = await a06Res.json();
  assert(
    "A06 Business Logic: Multi-coupon stacking allowed (>= ₹30 / 3 stacks)",
    a06Res.status === 200 && a06Json.newDiscount === 30 && a06Json.breachTriggered === true,
    JSON.stringify(a06Json)
  );

  // 8. A07: Authentication Failures (JWT)
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ sub: "usr-101", name: "Alex Rivera", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url");
  const forgedToken = `${header}.${payload}.bogussignature`;
  const a07Res = await fetch(`${BASE_URL}/api/admin/portal`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${forgedToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const a07Json = await a07Res.json();
  assert(
    "A07 JWT: Tampered admin token accepted (unverified signature)",
    a07Res.status === 200 && a07Json.success === true && a07Json.role === "admin",
    JSON.stringify(a07Json)
  );

  // 9. A08: Software & Data Integrity Failures
  const configPayload = { maintenanceMode: true, overridePort: 9001 };
  const clientChecksum = crypto.createHash("sha256").update(JSON.stringify(configPayload)).digest("hex");
  const a08Res = await fetch(`${BASE_URL}/api/integrity/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config: configPayload, checksum: clientChecksum }),
  });
  const a08Json = await a08Res.json();
  assert(
    "A08 Integrity: Server blindly trusts clientChecksum",
    a08Res.status === 200 && a08Json.verified === true && a08Json.breachTriggered === true,
    JSON.stringify(a08Json)
  );

  // 10. A09: Logging Failures
  const a09Res = await fetch(`${BASE_URL}/api/audit`);
  const a09Json = await a09Res.json();
  assert(
    "A09 Logging: Audit trail shows missingFailedAlerts",
    a09Res.status === 200 && a09Json.missingFailedAlerts === true,
    JSON.stringify(a09Json)
  );

  // 11. A10: Exception Mishandling
  const a10Res = await fetch(`${BASE_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ quantity: -1, price: 9999 }),
  });
  const a10Json = await a10Res.json();
  assert(
    "A10 Exception Handling: Negative quantity triggers fail-open PAID order",
    a10Res.status === 200 && a10Json.status === "PAID" && a10Json.failOpenOccurred === true,
    JSON.stringify(a10Json)
  );

  // 12. Instructor Auth API
  const instBad = await fetch(`${BASE_URL}/api/instructor/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode: "wrongpass" }),
  });
  const instGood = await fetch(`${BASE_URL}/api/instructor/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode: "northstar-instructor-2025" }),
  });
  assert(
    "Instructor API: Rejects invalid passcode & accepts northstar-instructor-2025",
    instBad.status === 401 && instGood.status === 200,
    `Bad status: ${instBad.status}, Good status: ${instGood.status}`
  );

  console.log(`\n-------------------------------------------------`);
  console.log(`RESULTS: ${passed}/${total} LIVE PROD CHECKS PASSED`);
  console.log(`-------------------------------------------------`);

  if (passed !== total) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test suite fatal error:", err);
  process.exit(1);
});
