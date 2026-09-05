import http from "http";
import https from "https";
import { URL } from "url";
import crypto from "crypto";

const TARGET = process.env.LOAD_TEST_TARGET || "https://owasp-10-pentesting.vercel.app";

interface RequestSample {
  category: string;
  statusCode: number;
  durationMs: number;
}

interface ActionDef {
  category: string;
  weight: number; // Percentage
  method: string;
  path: string;
  body?: any;
  headers?: Record<string, string>;
}

const FORGED_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbGV4QG5vcnRoc3Rhci5sb2NhbCIsImVtYWlsIjoiYWxleEBub3J0aHN0YXIubG9jYWwiLCJuYW1lIjoiQWxleCBSaXZlcmEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODg2MjU2NjksImV4cCI6MTc4ODYzMjg2OX0.9cGCMPmBLTuUqfdRZvERUcQY5sGAtOSMYsRC0vpNYD8";

const A08_CONFIG = { maintenanceMode: true, bypassRateLimit: true };
const A08_HASH = crypto.createHash("sha256").update(JSON.stringify(A08_CONFIG)).digest("hex");

const MIXED_ACTIONS: ActionDef[] = [
  // 20% Browsing
  { category: "Browsing", weight: 5, method: "GET", path: "/" },
  { category: "Browsing", weight: 5, method: "GET", path: "/products" },
  { category: "Browsing", weight: 5, method: "GET", path: "/products/quantum-vpn-gateway" },
  { category: "Browsing", weight: 5, method: "GET", path: "/about" },

  // 15% Login
  {
    category: "Auth/Login",
    weight: 15,
    method: "POST",
    path: "/api/auth/login",
    body: { email: "alex@northstar.local", password: "password123!" },
  },

  // 10% Orders / A01 IDOR
  {
    category: "A01:IDOR",
    weight: 10,
    method: "GET",
    path: "/api/orders/1002",
    headers: { Authorization: `Bearer ${FORGED_JWT}` },
  },

  // 10% Partner Search / A05 SQLi
  {
    category: "A05:SQLi",
    weight: 10,
    method: "GET",
    path: "/api/search?q=" + encodeURIComponent("' OR '1'='1"),
  },

  // 10% Account Export / A04 Crypto
  {
    category: "A04:Crypto",
    weight: 10,
    method: "GET",
    path: "/api/account/export?user=alex",
  },

  // 10% Cart / A06 Coupon & A10 Underflow
  {
    category: "A06:Coupon",
    weight: 5,
    method: "POST",
    path: "/api/cart/coupon",
    body: { code: "WELCOME10", currentDiscount: 20 },
  },
  {
    category: "A10:Exception",
    weight: 5,
    method: "POST",
    path: "/api/checkout",
    body: { quantity: -1, price: 9999 },
  },

  // 10% JWT / A07 Admin Portal
  {
    category: "A07:JWT",
    weight: 10,
    method: "POST",
    path: "/api/admin/portal",
    headers: { Authorization: `Bearer ${FORGED_JWT}` },
    body: { token: FORGED_JWT },
  },

  // 5% A02 Debug Config
  {
    category: "A02:DebugConfig",
    weight: 5,
    method: "GET",
    path: "/api/debug/config",
  },

  // 5% A03 Supply Chain Audit
  {
    category: "A03:SupplyChain",
    weight: 5,
    method: "POST",
    path: "/api/plugins/audit",
    body: { packageName: "analytics-telemetry-v2" },
  },

  // 5% A08 Integrity Checksum
  {
    category: "A08:Integrity",
    weight: 5,
    method: "POST",
    path: "/api/integrity/import",
    body: { config: A08_CONFIG, checksum: A08_HASH },
  },
];

// Build weighted distribution pool
const WEIGHTED_POOL: ActionDef[] = [];
for (const act of MIXED_ACTIONS) {
  for (let i = 0; i < act.weight; i++) {
    WEIGHTED_POOL.push(act);
  }
}

function getRandomAction(): ActionDef {
  const idx = Math.floor(Math.random() * WEIGHTED_POOL.length);
  return WEIGHTED_POOL[idx];
}

async function sendRequest(targetUrl: string, action: ActionDef): Promise<RequestSample> {
  const url = new URL(action.path, targetUrl);
  const client = url.protocol === "https:" ? https : http;

  const payload = action.body ? JSON.stringify(action.body) : null;
  const headers: Record<string, string> = {
    "User-Agent": "Northstar-WorkshopMixedLoadTester/1.0",
    ...(action.headers || {}),
  };
  if (payload) {
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = Buffer.byteLength(payload).toString();
  }

  const start = Date.now();
  return new Promise((resolve) => {
    const req = client.request(
      url,
      {
        method: action.method,
        headers,
        timeout: 10000,
      },
      (res) => {
        let dummy = "";
        res.on("data", (chunk) => (dummy += chunk));
        res.on("end", () => {
          resolve({
            category: action.category,
            statusCode: res.statusCode || 500,
            durationMs: Date.now() - start,
          });
        });
      }
    );

    req.on("error", () => {
      resolve({
        category: action.category,
        statusCode: 599,
        durationMs: Date.now() - start,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        category: action.category,
        statusCode: 504,
        durationMs: Date.now() - start,
      });
    });

    if (payload) req.write(payload);
    req.end();
  });
}

async function runBenchmark(concurrency: number, requestsPerUser: number) {
  const total = concurrency * requestsPerUser;
  console.log(`\n==================================================================`);
  console.log(`BENCHMARK: ${concurrency} CONCURRENT USERS (${total} TOTAL MIXED REQUESTS)`);
  console.log(`Distribution: 20% Browsing | 15% Auth | 10% A01 | 10% A05 | 10% A04 | 10% Cart/A06/A10 | 10% A07 | 5% A02 | 5% A03 | 5% A08`);
  console.log(`==================================================================`);

  const startTime = Date.now();
  const samples: RequestSample[] = [];
  const workers: Promise<void>[] = [];

  for (let u = 0; u < concurrency; u++) {
    workers.push(
      (async () => {
        for (let r = 0; r < requestsPerUser; r++) {
          const action = getRandomAction();
          const sample = await sendRequest(TARGET, action);
          samples.push(sample);
        }
      })()
    );
  }

  await Promise.all(workers);
  const elapsedSec = (Date.now() - startTime) / 1000;

  const latencies = samples.map((s) => s.durationMs).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p90 = latencies[Math.floor(latencies.length * 0.9)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  const rate429 = samples.filter((s) => s.statusCode === 429).length;
  const server5xx = samples.filter((s) => s.statusCode >= 500).length;
  const successful = samples.filter((s) => s.statusCode >= 200 && s.statusCode < 400).length;

  console.log(`Completed in ${elapsedSec.toFixed(2)}s | Throughput: ${Math.round(total / elapsedSec)} req/s`);
  console.log(`Latency: p50: ${p50}ms | p90: ${p90}ms | p95: ${p95}ms | p99: ${p99}ms`);
  console.log(`Status Codes: Successful (2xx/3xx): ${successful} (${((successful/total)*100).toFixed(1)}%) | 429: ${rate429} | 5xx: ${server5xx}`);

  return { concurrency, total, elapsedSec, rps: Math.round(total / elapsedSec), p50, p90, p95, p99, rate429, server5xx };
}

async function main() {
  console.log(`Targeting Production Endpoint: ${TARGET}`);
  const r300 = await runBenchmark(300, 6); // 1,800 requests
  const r500 = await runBenchmark(500, 6); // 3,000 requests

  console.log(`\n==================================================================`);
  console.log(`FINAL MIXED-WORKLOAD BENCHMARK SUMMARY`);
  console.log(`==================================================================`);
  console.log(`Users | Requests | Duration | RPS  | p50 (ms) | p90 (ms) | p95 (ms) | p99 (ms) | 429s | 5xxs`);
  console.log(`------------------------------------------------------------------`);
  for (const r of [r300, r500]) {
    console.log([
      String(r.concurrency).padEnd(5),
      String(r.total).padEnd(8),
      `${r.elapsedSec.toFixed(1)}s`.padEnd(8),
      String(r.rps).padEnd(4),
      String(r.p50).padEnd(8),
      String(r.p90).padEnd(8),
      String(r.p95).padEnd(8),
      String(r.p99).padEnd(8),
      String(r.rate429).padEnd(4),
      String(r.server5xx),
    ].join(" | "));
  }
  console.log(`==================================================================\n`);
}

main().catch(console.error);
