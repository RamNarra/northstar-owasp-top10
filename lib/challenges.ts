export interface Challenge {
  id: string;
  owaspId: string;
  owaspTitle: string;
  chapterNumber: string;
  storyTitle: string;
  difficulty: "Beginner" | "Easy" | "Moderate";
  tier: "Deep Dive" | "Guided Investigation" | "Forensic Simulation";
  points: number;
  flag: string;
  briefing: string;
  objective: string;
  hints: string[];
  debrief: {
    whatHappened: string;
    whyItWorked: string;
    owasp2025Note: string;
    vulnerableSnippet: string;
    secureSnippet: string;
  };
}

export const CHALLENGES: Challenge[] = [
  {
    id: "A01",
    owaspId: "A01:2025",
    owaspTitle: "Broken Access Control",
    chapterNumber: "01",
    storyTitle: "The Customer Database",
    difficulty: "Beginner",
    tier: "Deep Dive",
    points: 100,
    flag: "NORTHSTAR{idor_authorization_bypass_a01}",
    briefing:
      "Customer Alex Rivera reported seeing order details belonging to another customer after clicking around recent invoices in the portal.",
    objective:
      "Authentication ≠ Authorization: While authenticated as Alex Rivera (whose active order is #1001), query order #1002 and retrieve Bob Vance's confidential order without authorization checks.",
    hints: [
      "Look at how the order lookup request references order identifiers.",
      "Alex's order is #1001. What happens if you inspect the lookup endpoint and request #1002?",
      "Query `/api/orders/1002` while holding Alex's session. The server returns Bob's order without checking object ownership.",
    ],
    debrief: {
      whatHappened:
        "The application verified who the user was (Authentication) but failed to verify whether that user was authorized to view the requested record (Authorization).",
      whyItWorked:
        "The backend retrieved the order directly using the client-supplied ID parameter without asserting `order.userId === session.user.id`.",
      owasp2025Note:
        "In OWASP Top 10:2025, Broken Access Control remains #1. It covers Insecure Direct Object References (IDOR), BOLA, and missing functional permissions.",
      vulnerableSnippet: `// Vulnerable: trusts client ID without ownership check
export async function GET(req, { params }) {
  const order = SYNTHETIC_ORDERS[params.id];
  return Response.json(order);
}`,
      secureSnippet: `// Secure: verifies object ownership before returning data
export async function GET(req, { params }) {
  const session = await getAuthenticatedSession(req);
  const order = await getOrderById(params.id);
  if (!order || order.userId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return Response.json(order);
}`,
    },
  },
  {
    id: "A02",
    owaspId: "A02:2025",
    owaspTitle: "Security Misconfiguration",
    chapterNumber: "02",
    storyTitle: "The Forgotten Debug Switch",
    difficulty: "Beginner",
    tier: "Guided Investigation",
    points: 100,
    flag: "NORTHSTAR{debug_endpoint_exposed_a02}",
    briefing:
      "Reconnaissance telemetry indicates internal runtime debugging diagnostics are active in the live production deployment.",
    objective:
      "Locate and query the accidentally exposed debug endpoint `/api/debug/config` to reveal Northstar Portal's internal environment flags.",
    hints: [
      "Developers often expose diagnostic endpoints like `/api/debug/...` during development and forget to disable them.",
      "Check the `/api/debug/config` path to see what configuration settings are leaked.",
      "Send a GET request to `/api/debug/config` to capture the production debug metadata.",
    ],
    debrief: {
      whatHappened:
        "An internal debugging and diagnostics route was packaged and deployed directly to production.",
      whyItWorked:
        "No environment check (e.g. `NODE_ENV === 'production'`) or route-level access control disabled the diagnostic handler.",
      owasp2025Note:
        "Security Misconfiguration rose to #2 in OWASP Top 10:2025. It emphasizes exposed debug interfaces, unhardened cloud settings, and verbose diagnostics.",
      vulnerableSnippet: `// Vulnerable: debug interface accessible in production
export async function GET() {
  return Response.json({
    debug: true,
    environment: "production",
    verbose_errors: true,
    build: "v2.4.1-rc3"
  });
}`,
      secureSnippet: `// Secure: gate diagnostic routes behind environment checks and internal auth
export async function GET(req) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not Found" }, { status: 404 });
  }
  return Response.json({ status: "ok" });
}`,
    },
  },
  {
    id: "A03",
    owaspId: "A03:2025",
    owaspTitle: "Software Supply Chain Failures",
    chapterNumber: "03",
    storyTitle: "The Dependency Nobody Checked",
    difficulty: "Moderate",
    tier: "Forensic Simulation",
    points: 150,
    flag: "NORTHSTAR{supply_chain_unverified_provenance_a03}",
    briefing:
      "Forensic Simulation: CI/CD build logs show that during deployment bundle generation, an external dependency was pulled from an untrusted mirror rather than the official internal registry.",
    objective:
      "Perform a forensic audit of the synthetic deployment manifest under Platform Operations (`/operations`) and identify the untrusted dependency that bypassed the internal CDN integrity gate. (Safe simulation: no real code executed).",
    hints: [
      "Navigate to Platform Operations (`/operations`) in the top navigation bar.",
      "Review the packages listed in Deployment Dependencies. Check their `source` URLs and registry authorities.",
      "Notice which package is being pulled from `http://mirror.untrusted-pkg.net` instead of `https://cdn.northstar.local`. Select `analytics-telemetry-v2` and audit provenance.",
    ],
    debrief: {
      whatHappened:
        "A build pipeline imported a third-party dependency from an unverified repository mirror without validating package signature or publisher provenance.",
      whyItWorked:
        "The package manager configuration allowed untrusted registry fallbacks and lacked cryptographic verification of publisher certificates.",
      owasp2025Note:
        "Software Supply Chain Failures is a major addition to OWASP Top 10:2025. It targets compromised dependencies, unverified package sources, and vulnerable CI/CD build chains.",
      vulnerableSnippet: `// Vulnerable: imports dependencies from unverified external mirrors
dependencies: {
  "analytics-telemetry-v2": "http://mirror.untrusted-pkg.net/analytics.tgz"
}`,
      secureSnippet: `// Secure: enforce scoped internal registry, lockfiles, and signature verification
// .npmrc:
// @northstar:registry=https://internal-registry.northstar.local/
// always-auth=true
// integrity=sha512-strict`,
    },
  },
  {
    id: "A04",
    owaspId: "A04:2025",
    owaspTitle: "Cryptographic Failures",
    chapterNumber: "04",
    storyTitle: "The Old Secret",
    difficulty: "Beginner",
    tier: "Guided Investigation",
    points: 100,
    flag: "NORTHSTAR{encoding_is_not_encryption_a04}",
    briefing:
      "A customer backup archive revealed that sensitive credentials were saved using an algorithm that provides zero confidentiality.",
    objective:
      "Inspect Alex Rivera's synthetic backup export from `/api/account/export?user=alex`, identify that `credential_blob` uses Base64 encoding rather than encryption, and decode the plaintext password.",
    hints: [
      "Inspect the exported JSON file. Look at the string in `credential_blob`.",
      "Strings ending with `=` or `==` composed of letters and numbers are often Base64 encoded.",
      "Decode `cGFzc3dvcmQxMjMh` using standard Base64 decoding (e.g. `atob` in DevTools or command line) to find `password123!`.",
    ],
    debrief: {
      whatHappened:
        "The application stored and exported sensitive credentials using Base64 encoding under the mistaken belief that encoding equals encryption.",
      whyItWorked:
        "Base64 is a data representation format, not a cryptographic primitive. Anyone with access to the encoded string can immediately reverse it without a secret key.",
      owasp2025Note:
        "OWASP A04:2025 Cryptographic Failures addresses weak algorithms, missing encryption in transit or at rest, and the dangerous anti-pattern of confusing encoding with encryption.",
      vulnerableSnippet: `// Vulnerable: encoding credential without encryption
export function exportBackup(user) {
  return {
    user: user.email,
    credential_blob: Buffer.from(user.password).toString("base64")
  };
}`,
      secureSnippet: `// Secure: hash passwords with salted Argon2id/bcrypt; never export reversible credentials
import bcrypt from "bcrypt";
export async function storePassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 12);
}`,
    },
  },
  {
    id: "A05",
    owaspId: "A05:2025",
    owaspTitle: "Injection",
    chapterNumber: "05",
    storyTitle: "The Customer Search",
    difficulty: "Easy",
    tier: "Deep Dive",
    points: 150,
    flag: "NORTHSTAR{sqli_dynamic_query_a05}",
    briefing:
      "Support analysts noticed that entering quote characters in the customer directory search causes internal accounting records to appear in the results.",
    objective:
      "Deterministic SQL Injection Simulation: Exploit dynamic query string concatenation modeling in `/api/search` by injecting a classic boolean tautology (`' OR '1'='1`) to dump confidential records.",
    hints: [
      "The search term models dynamic concatenation into an SQL string: `SELECT * FROM customers WHERE name LIKE '%[INPUT]%'`.",
      "How can you close the string literal and inject a condition that is always true?",
      "Search for `' OR '1'='1` or `' OR 1=1 --` to dump all records including the confidential internal billing account.",
    ],
    debrief: {
      whatHappened:
        "User input was concatenated directly into a simulated interpreter query string without parameterization or escaping.",
      whyItWorked:
        "The injected quote `'` broke out of the data context into the query syntax, and `'1'='1'` evaluated to true for every record in the table.",
      owasp2025Note:
        "Injection remains a critical risk in OWASP Top 10:2025. Preventing injection strictly requires parameterized queries / prepared statements rather than string concatenation. This challenge deterministically simulates this vulnerability safely.",
      vulnerableSnippet: `// Vulnerable: raw string concatenation into database query
const query = "SELECT * FROM customers WHERE name LIKE '%" + input + "%'";
const results = db.raw(query);`,
      secureSnippet: `// Secure: parameterized query separates code from data
const query = "SELECT * FROM customers WHERE name LIKE ?";
const results = await db.execute(query, [\`%\${input}%\`]);`,
    },
  },
  {
    id: "A06",
    owaspId: "A06:2025",
    owaspTitle: "Insecure Design",
    chapterNumber: "06",
    storyTitle: "The Coupon Disaster",
    difficulty: "Easy",
    tier: "Deep Dive",
    points: 150,
    flag: "NORTHSTAR{business_logic_missing_state_check_a06}",
    briefing:
      "Northstar finance reported several customer orders completing with massive discounts far below allowed promotional margins.",
    objective:
      "Exploit a missing state enforcement rule in the billing cart: apply the single-use `WELCOME10` promotional coupon repeatedly until the total discount stacks beyond policy margins.",
    hints: [
      "The system offers promotional code `WELCOME10` (promotional equipment credit). What happens if you apply it more than once?",
      "Does the server check whether `coupon_applied` is already true before subtracting the discount?",
      "Click Apply Coupon multiple times until the total discount stacks repeatedly beyond authorized thresholds.",
    ],
    debrief: {
      whatHappened:
        "The promotional checkout flow lacked business-rule validation to enforce single-use redemption per checkout.",
      whyItWorked:
        "The backend handler accepted the coupon code and subtracted promotional savings without verifying whether a coupon was already attached to the order.",
      owasp2025Note:
        "A06:2025 Insecure Design focuses on missing security controls and flawed business logic that cannot be fixed by mere implementation hardening without designing proper domain invariants.",
      vulnerableSnippet: `// Vulnerable: lacks state check on coupon usage
export async function applyCoupon(cart, code) {
  if (code === "WELCOME10") {
    cart.discount += 1000; // ₹1,000 promotional credit
    cart.total -= 1000;
  }
  return cart;
}`,
      secureSnippet: `// Secure: enforces state transition and single-use invariants
export async function applyCoupon(cart, code) {
  if (cart.appliedCoupons.includes(code)) {
    throw new Error("Coupon already redeemed on this order");
  }
  if (cart.appliedCoupons.length >= 1) {
    throw new Error("Maximum 1 promotion allowed per order");
  }
  cart.appliedCoupons.push(code);
  cart.discount = 1000;
  cart.total = Math.max(0, cart.subtotal - cart.discount);
  return cart;
}`,
    },
  },
  {
    id: "A07",
    owaspId: "A07:2025",
    owaspTitle: "Authentication Failures (JWT Centerpiece)",
    chapterNumber: "07",
    storyTitle: "The Compromised Token",
    difficulty: "Moderate",
    tier: "Deep Dive",
    points: 200,
    flag: "NORTHSTAR{jwt_signature_verification_missing_a07}",
    briefing:
      "SOC detected an unprivileged user session ('alex@northstar.local') accessing the high-security Executive Administrator Dashboard.",
    objective:
      "Inspect Alex's issued JWT token under Account (`/account`), alter the payload claim from `role: 'user'` to `role: 'admin'`, observe that the signature becomes invalid, and submit the tampered token to gain access to the Executive Administration Dashboard (`/admin`).",
    hints: [
      "Log in as `alex@northstar.local` / `password123!` and open Account -> Security & Session.",
      "Inspect the JWT structure in the Session Inspector: HEADER . PAYLOAD . SIGNATURE.",
      "Manually edit the JSON claims in the textarea (change `\"role\": \"user\"` to `\"role\": \"admin\"`). Notice the signature flips to `Signature: Invalid ✗`.",
      "Click 'Test Tampered Token' or submit to `/api/admin/portal`. The server trusts the unverified claim and grants access to `/admin`!",
    ],
    debrief: {
      whatHappened:
        "The application inspected claims inside a JSON Web Token without verifying its cryptographic signature.",
      whyItWorked:
        "The backend used `decodeJwt()` to parse the claims instead of `jwtVerify()`. Anyone can base64url-encode an altered JSON payload; without signature validation, token claims cannot be trusted.",
      owasp2025Note:
        "OWASP Top 10:2025 A07 covers authentication weaknesses and token handling failures. The OWASP JWT Cheat Sheet emphasizes that verifying the signature with an enforced algorithm is mandatory before evaluating any claims.",
      vulnerableSnippet: `// Vulnerable: decodes claims without verifying signature
import { decodeJwt } from "jose";
export async function authorizeAdmin(token) {
  const claims = decodeJwt(token); // FATAL: signature ignored!
  if (claims.role === "admin") {
    return grantAdminAccess();
  }
  throw new Error("Unauthorized");
}`,
      secureSnippet: `// Secure: verifies cryptographic signature and validated claims
import { jwtVerify } from "jose";
export async function authorizeAdmin(token, secretKey) {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ["HS256"],
    issuer: "northstar-portal",
    audience: "northstar-api"
  });
  if (payload.role === "admin") {
    return grantAdminAccess();
  }
  throw new Error("Unauthorized");
}`,
    },
  },
  {
    id: "A08",
    owaspId: "A08:2025",
    owaspTitle: "Software or Data Integrity Failures",
    chapterNumber: "08",
    storyTitle: "The \"Trusted\" Update",
    difficulty: "Moderate",
    tier: "Guided Investigation",
    points: 150,
    flag: "NORTHSTAR{untrusted_integrity_claim_a08}",
    briefing:
      "The system configuration importer allows operators to load runtime flags, claiming to perform strict checksum validation on incoming payloads.",
    objective:
      "Under Platform Operations (`/operations`), alter the configuration payload to enable `maintenanceMode: true`, compute or provide a matching checksum in the same client request, and observe the server accepting it as trusted.",
    hints: [
      "Navigate to Platform Operations (`/operations`) -> Runtime Configuration Import.",
      "Notice how the importer accepts `{ config: {...}, checksum: '...' }` from the client request.",
      "The server computes the hash of `config` and compares it to the client-supplied `checksum` from the same untrusted JSON body! Submit with `maintenanceMode: true` to bypass.",
    ],
    debrief: {
      whatHappened:
        "The application attempted to verify data integrity using a checksum supplied by the untrusted sender within the same payload.",
      whyItWorked:
        "Integrity cannot be verified by comparing an object against a hash provided by the untrusted caller. A valid integrity check requires an independent trust root (e.g. digital signature with a private key or pre-shared trusted hash catalog).",
      owasp2025Note:
        "A08:2025 Software or Data Integrity Failures focuses on trusting untrusted sources for integrity verification, insecure deserialization, and unverified auto-updates.",
      vulnerableSnippet: `// Vulnerable: trusts client-supplied hash as the integrity source
export async function importConfig(payload) {
  const actualHash = sha256(JSON.stringify(payload.config));
  // Flaw: comparing against untrusted client parameter!
  if (actualHash === payload.checksum) {
    applyConfig(payload.config);
  }
}`,
      secureSnippet: `// Secure: verify against an asymmetric signature signed by a trusted authority
import crypto from "crypto";
export async function importConfig(payload, trustedPublicKey) {
  const isVerified = crypto.verify(
    "sha256",
    Buffer.from(JSON.stringify(payload.config)),
    trustedPublicKey,
    Buffer.from(payload.signature, "base64")
  );
  if (!isVerified) throw new Error("Integrity verification failed");
  applyConfig(payload.config);
}`,
    },
  },
  {
    id: "A09",
    owaspId: "A09:2025",
    owaspTitle: "Security Logging & Alerting Failures",
    chapterNumber: "09",
    storyTitle: "The Missing Alarm",
    difficulty: "Easy",
    tier: "Guided Investigation",
    points: 100,
    flag: "NORTHSTAR{silent_failures_no_audit_logging_a09}",
    briefing:
      "Detection Capability Assessment: An attacker attempted credential stuffing against administrator accounts, but the incident response team detected nothing in real time.",
    objective:
      "Perform consecutive failed login attempts against `admin@northstar.local`, then inspect the audit log at `/api/audit` to confirm that failed authentication attempts are completely unrecorded.",
    hints: [
      "Attempt to sign in with incorrect credentials multiple times.",
      "Check the audit log at `/api/audit` or through the investigation panel.",
      "Notice how successful logins appear, but failed attempts are completely absent from the log. Confirming the absence completes the challenge.",
    ],
    debrief: {
      whatHappened:
        "Authentication failures were silently dropped without recording security audit logs or firing rate-limit alerts.",
      whyItWorked:
        "The login handler only invoked the audit logger on the success path, leaving security defenders completely blind to ongoing brute-force attacks.",
      owasp2025Note:
        "A09:2025 Security Logging & Alerting Failures emphasizes that a vulnerability is not only an exploitable bug, but also the total absence of detection when attacks occur.",
      vulnerableSnippet: `// Vulnerable: only logs success; errors fail silently
export async function handleLogin(email, password) {
  const user = authenticate(email, password);
  if (user) {
    auditLog.record({ event: "LOGIN_SUCCESS", user: email });
    return createSession(user);
  }
  // Flaw: No log, no alert, no rate limit
  return { error: "Invalid credentials" };
}`,
      secureSnippet: `// Secure: audit failures with context, track velocity, trigger alerts
export async function handleLogin(email, password, req) {
  const user = authenticate(email, password);
  if (!user) {
    await auditLog.record({
      event: "LOGIN_FAILURE",
      targetUser: email,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      timestamp: new Date().toISOString()
    });
    await rateLimiter.recordFailure(req.ip, email);
    return { error: "Invalid credentials" };
  }
  await auditLog.record({ event: "LOGIN_SUCCESS", user: email });
  return createSession(user);
}`,
    },
  },
  {
    id: "A10",
    owaspId: "A10:2025",
    owaspTitle: "Mishandling of Exceptional Conditions",
    chapterNumber: "10",
    storyTitle: "The Checkout Crash",
    difficulty: "Easy",
    tier: "Guided Investigation",
    points: 100,
    flag: "NORTHSTAR{fail_open_exception_mishandled_a10}",
    briefing:
      "A customer order containing an invalid negative item quantity triggered a runtime exception, but instead of rejecting the transaction, the order was approved as PAID.",
    objective:
      "Submit a checkout request with `quantity: -1` to `/api/checkout` and trigger the unhandled arithmetic exception that causes the server to fail open.",
    hints: [
      "Look at the item quantity input in the checkout form.",
      "What happens when an unexpected value like `-1` is passed into the price calculation?",
      "Submit `quantity: -1`. The arithmetic exception is caught by a generic handler that mistakenly defaults to `{ status: 'PAID' }`.",
    ],
    debrief: {
      whatHappened:
        "An unexpected input caused a calculation exception, and the broad exception handler caught the error and completed the transaction anyway (fail-open).",
      whyItWorked:
        "Instead of failing closed and aborting the transaction on error, the catch block assumed the processing was complete and assigned status `PAID`.",
      owasp2025Note:
        "A10:2025 Mishandling of Exceptional Conditions is new in OWASP Top 10:2025. It targets systems that fail open, leak sensitive state on error, or lack transaction rollbacks during exceptions.",
      vulnerableSnippet: `// Vulnerable: broad catch block fails open
export async function processCheckout(item, quantity) {
  let orderStatus = "PENDING";
  try {
    if (quantity < 0) throw new Error("Arithmetic underflow");
    chargeCustomer(item.price * quantity);
    orderStatus = "PAID";
  } catch (err) {
    // FATAL: fails open on exception instead of aborting!
    orderStatus = "PAID";
  }
  return { status: orderStatus };
}`,
      secureSnippet: `// Secure: strictly fail closed, rollback state, return explicit error
export async function processCheckout(item, quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return { status: "REJECTED", error: "Quantity must be a positive integer" };
  }
  try {
    await chargeCustomer(item.price * quantity);
    return { status: "PAID" };
  } catch (err) {
    await rollbackTransaction();
    return { status: "FAILED", error: "Payment processing failed" };
  }
}`,
    },
  },
];
