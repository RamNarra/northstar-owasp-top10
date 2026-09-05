# Northstar · Modern Equipment for Secure Teams

A realistic, believable commercial web application built to teach the **OWASP Top 10:2025** and **JSON Web Token (JWT) Security** through hands-on exploration and penetration testing.

Unlike conventional CTF dashboards that display vulnerability names and flags upfront, **Northstar** presents itself as an ordinary hardware & infrastructure storefront (Northstar Systems). The vulnerabilities emerge naturally from normal web application functionality and are discovered using standard browser inspection, parameter tampering, and penetration-testing techniques.

When a vulnerability is reproduced, an unobtrusive **Security Finding** panel unlocks to provide root-cause analysis, OWASP Top 10:2025 classification, and side-by-side vulnerable vs. secure code comparisons.

---

## 🧭 Application Map & Vulnerability Placement

| Feature / Location | Normal Functionality | Hidden Vulnerability | OWASP Top 10:2025 |
|---|---|---|---|
| **Orders (`/orders`)** | View purchase receipts & packing slips | IDOR: Querying Order `#1002` reveals Bob Vance's confidential order | **A01: Broken Access Control** |
| **System Info (`/about` & `/robots.txt`)** | System specifications & crawler policy | Misconfiguration: `/api/debug/config` leaked in production | **A02: Security Misconfiguration** |
| **Admin Console (`/admin`)** | View deployment packages & release telemetry | Supply Chain: Unverified mirror source `analytics-telemetry-v2` | **A03: Software Supply Chain Failures** |
| **Account Privacy (`/account`)** | "Download my data" backup export | Cryptographic Failure: Base64-encoded `credential_blob` | **A04: Cryptographic Failures** |
| **Directory (`/directory`)** | Search partner & client directory | Injection: Dynamic SQL concatenation tautology (`' OR '1'='1`) | **A05: Injection** |
| **Shopping Cart (`/cart`)** | Promotional discount code `WELCOME10` | Insecure Design: Multi-use coupon applied repeatedly | **A06: Insecure Design** |
| **Session Details (`/account`)** | Inspect active JWT session token | Authentication Failure: Tampering role to `admin` bypasses signature | **A07: Authentication Failures (JWT)** |
| **Admin Settings (`/admin`)** | Import runtime configuration JSON | Integrity Failure: Server trusts client-supplied checksum | **A08: Software & Data Integrity** |
| **Sign In (`/login`)** | Sign in with user credentials | Logging Failure: Failed authentication attempts omitted from audit log | **A09: Security Logging & Alerting** |
| **Checkout (`/cart`)** | Quantity selection & purchase authorization | Exceptional Conditions: Negative quantity (`-1`) fails open as `PAID` | **A10: Exceptional Conditions** |

---

## 🛡️ Safe Public Deployment Boundaries

This application is intentionally vulnerable for educational purposes, but is strictly hardened to prevent any danger when hosted on public platforms such as Vercel:

- ❌ **NO** arbitrary OS command execution (`child_process.exec`).
- ❌ **NO** unrestricted SSRF or outbound HTTP fetches.
- ❌ **NO** arbitrary file reads or directory traversals.
- ❌ **NO** dynamic execution of uploaded code or package installations.
- ❌ **NO** destructive SQL queries (DROP, DELETE, UPDATE).
- ❌ **NO** real user data, real credentials, or live payment gateways.
- ✅ All targets, orders, credit card references, and accounts are synthetic fixtures.
- ℹ️ **Pedagogical Simulations**: Chapters A03 and A05 are explicitly designed as deterministic simulations. A03 simulates CI/CD supply-chain provenance verification without executing untrusted packages, and A05 simulates dynamic SQL query string concatenation without executing destructive SQL queries.

---

## 🚀 Local Development & Verification

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Run Locally
```bash
# Install dependencies
npm install

# Run automated smoke tests
npm test

# Run Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.

---

## 🧑‍🏫 Instructor Portal

Facilitators can navigate to `/instructor` to view:
- Master solutions catalog
- Exact reproduction steps and payloads
- Complete side-by-side code comparisons

Authentication is validated **strictly server-side** via `POST /api/instructor/auth` using the server environment variable:
```bash
INSTRUCTOR_PASSCODE=your_secret_passcode
```
Default development fallback: `northstar-instructor-2025`. The expected passcode is never exposed to the client bundle.
