# Northstar Security Incident · OWASP Top 10:2025 & JWT Lab

A beginner-friendly, story-driven web penetration testing training platform built for workshop facilitators and security students.

The application puts students into the shoes of an Incident Response engineer investigating a security breach at **Northstar Systems** (targeting **Northstar Portal**). Rather than presenting a static list of vulnerability definitions, the application unfolds as a sequential 10-chapter investigation timeline, culminating in a hands-on **JWT Investigation Room**.

---

## 🎯 Educational Goals

1. **OWASP Top 10:2025 Mastery**: Understand the current 2025 category hierarchy, including new priorities like **Software Supply Chain Failures (A03)** and **Mishandling of Exceptional Conditions (A10)**.
2. **Deep-Dive JWT Security (A07 Centerpiece)**: Experience firsthand why `decodeJwt()` is not `jwtVerify()`. Visually observe HMAC signature invalidation when claims are tampered with, and how vulnerable servers fail open by blindly trusting claims.
3. **Beginner Accessibility**: Every challenge is solvable directly in the browser with 3 progressive hints, clear evidence logs, and side-by-side vulnerable vs remediated code.

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

---

## 🗺️ OWASP Top 10:2025 Chapter Mapping

| Chapter | OWASP Top 10:2025 Category | Story Chapter Title | Exploit / Investigation |
|---|---|---|---|
| **00** | Incident Briefing | Breach Triage | Story briefing & incident declaration |
| **01** | **A01: Broken Access Control** | The Customer Database | Insecure Direct Object Reference (IDOR) on `/api/orders/:id` |
| **02** | **A02: Security Misconfiguration** | The Forgotten Debug Switch | Accidental production exposure of `/api/debug/config` |
| **03** | **A03: Software Supply Chain Failures** | The Dependency Nobody Checked | Forensic audit of CI/CD manifest identifying unverified package mirror |
| **04** | **A04: Cryptographic Failures** | The Old Secret | Account backup credential protected only with Base64 encoding |
| **05** | **A05: Injection** | The Customer Search | SQL injection tautology (`' OR '1'='1`) exposing confidential treasury account |
| **06** | **A06: Insecure Design** | The Coupon Disaster | Business logic state flaw allowing repeated redemption of `WELCOME10` |
| **07** | **A07: Authentication Failures** | The Compromised Token | **JWT Lab Centerpiece**: Tampering payload `role: admin`, signature bypass |
| **08** | **A08: Software/Data Integrity Failures**| The "Trusted" Update | Configuration importer trusting client-supplied self-signed checksum |
| **09** | **A09: Logging & Alerting Failures** | The Missing Alarm | Brute-force failed logins completely unlogged in security audit trail |
| **10** | **A10: Mishandling of Exceptional Conditions**| The Checkout Crash | Negative quantity triggers calculation error that fails open as `PAID` |

---

## 🏛️ Architecture & Source Organization

The codebase is structured to be readable and teachable directly from source:

```
├── app/
│   ├── api/                      # Deterministic serverless API endpoints
│   ├── incident/page.tsx         # Main 10-chapter investigation timeline
│   ├── instructor/page.tsx       # Gated instructor solutions portal (/instructor)
│   └── page.tsx                  # Incident landing page & briefing
├── components/
│   ├── ChallengeCard.tsx         # 3-Layer UI (Story -> Investigation -> Lesson)
│   ├── TokenInspector.tsx        # Interactive JWT decoder & HMAC validator
│   └── ForensicAuditViewer.tsx   # Supply chain dependency auditor
├── lib/
│   ├── challenges.ts             # Metadata, objectives, hints, and flags
│   ├── evidence.ts               # Narrative incident telemetry snippets
│   ├── fake-db.ts                # Synthetic data fixtures
│   ├── vulnerabilities/          # Isolated, readable vulnerable handlers
│   └── secure/                   # Matching secure remediation reference code
└── scripts/
    └── smoke-test.mjs            # Automated verification test suite
```

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

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧑‍🏫 Instructor Portal

Facilitators can navigate to `/instructor` to view:
- Master flag list
- Full reproduction curl commands and payloads
- Pedagogical tips for stuck students
- Complete side-by-side code comparisons

Default development passcode: `northstar-instructor-2025` (configurable via `NEXT_PUBLIC_INSTRUCTOR_PASSCODE`).

---

## 📚 References & Standards
- [OWASP Top 10:2025](https://owasp.org/Top10/)
- [OWASP JSON Web Token Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)
- [OWASP Juice Shop CTF Guidance](https://pwning.owasp-juice.shop/)
- [Vercel Serverless Functions Documentation](https://vercel.com/docs/functions)
