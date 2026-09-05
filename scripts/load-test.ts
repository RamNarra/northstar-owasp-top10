/**
 * Northstar Load Testing Suite - Concurrency & Workshop Simulation
 * Simulates 50, 100, 200, 300, and 500 concurrent students performing realistic actions.
 */

import http from "http";
import https from "https";
import { URL } from "url";

interface RequestSample {
  path: string;
  method: string;
  statusCode: number;
  durationMs: number;
  isError: boolean;
}

interface ConcurrencyResult {
  concurrency: number;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rate429Count: number;
  server5xxCount: number;
  durationSec: number;
  requestsPerSec: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
}

const TARGET_BASE_URL = process.env.LOAD_TEST_TARGET || "http://localhost:3000";

const ACTIONS = [
  { path: "/", method: "GET" },
  { path: "/products", method: "GET" },
  { path: "/products/quantum-vpn-gateway", method: "GET" },
  { path: "/about", method: "GET" },
  { path: "/partners", method: "GET" },
  { path: "/api/orders/1001", method: "GET" },
  { path: "/api/orders/1002", method: "GET" },
  { path: "/api/search?q=Apex", method: "GET" },
  { path: "/api/search?q=" + encodeURIComponent("' OR '1'='1"), method: "GET" },
  { path: "/api/debug/config", method: "GET" },
  {
    path: "/api/auth/login",
    method: "POST",
    body: { email: "alex@northstar.local", password: "password123!" },
  },
  {
    path: "/api/cart/coupon",
    method: "POST",
    body: { currentDiscount: 2000, code: "WELCOME10" },
  },
  {
    path: "/api/checkout",
    method: "POST",
    body: { itemId: "starter-telemetry", quantity: 1 },
  },
];

async function makeRequest(targetUrl: string, action: typeof ACTIONS[0]): Promise<RequestSample> {
  const url = new URL(action.path, targetUrl);
  const isHttps = url.protocol === "https:";
  const client = isHttps ? https : http;

  const payload = action.body ? JSON.stringify(action.body) : null;
  const headers: Record<string, string> = {
    "User-Agent": "Northstar-WorkshopLoadTester/1.0",
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
          const durationMs = Date.now() - start;
          resolve({
            path: action.path,
            method: action.method,
            statusCode: res.statusCode || 500,
            durationMs,
            isError: (res.statusCode || 500) >= 400,
          });
        });
      }
    );

    req.on("error", () => {
      resolve({
        path: action.path,
        method: action.method,
        statusCode: 599,
        durationMs: Date.now() - start,
        isError: true,
      });
    });

    req.on("timeout", () => {
      req.destroy();
      resolve({
        path: action.path,
        method: action.method,
        statusCode: 504,
        durationMs: Date.now() - start,
        isError: true,
      });
    });

    if (payload) req.write(payload);
    req.end();
  });
}

async function runTier(targetUrl: string, concurrency: number, requestsPerUser = 6): Promise<ConcurrencyResult> {
  process.stdout.write(`  [Simulating ${concurrency} concurrent students (${requestsPerUser} requests each)...] `);
  const total = concurrency * requestsPerUser;
  const samples: RequestSample[] = [];

  const startTier = Date.now();

  // Run in batches matching concurrency
  const workerPool: Promise<void>[] = [];
  let completed = 0;

  for (let u = 0; u < concurrency; u++) {
    workerPool.push(
      (async () => {
        for (let r = 0; r < requestsPerUser; r++) {
          const action = ACTIONS[(u + r) % ACTIONS.length];
          const sample = await makeRequest(targetUrl, action);
          samples.push(sample);
          completed++;
        }
      })()
    );
  }

  await Promise.all(workerPool);
  const durationSec = (Date.now() - startTier) / 1000;

  const latencies = samples.map((s) => s.durationMs).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.5)] || 0;
  const p95 = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const p99 = latencies[Math.floor(latencies.length * 0.99)] || 0;

  const rate429 = samples.filter((s) => s.statusCode === 429).length;
  const server5xx = samples.filter((s) => s.statusCode >= 500).length;
  const failed = samples.filter((s) => s.isError).length;

  console.log(`Done in ${durationSec.toFixed(2)}s | p95: ${p95}ms | Errors: ${failed}/${total}`);

  return {
    concurrency,
    totalRequests: total,
    successfulRequests: total - failed,
    failedRequests: failed,
    rate429Count: rate429,
    server5xxCount: server5xx,
    durationSec,
    requestsPerSec: Math.round(total / (durationSec || 1)),
    p50Ms: p50,
    p95Ms: p95,
    p99Ms: p99,
  };
}

async function main() {
  console.log("==================================================================");
  console.log("NORTHSTAR WORKSHOP LOAD TESTING & CAPACITY SIMULATION");
  console.log(`Target: ${TARGET_BASE_URL}`);
  console.log("==================================================================\n");

  const concurrencyLevels = [50, 100, 200, 300, 500];
  const results: ConcurrencyResult[] = [];

  for (const c of concurrencyLevels) {
    const res = await runTier(TARGET_BASE_URL, c);
    results.push(res);
  }

  console.log("\n==================================================================");
  console.log("LOAD SIMULATION RESULTS SUMMARY");
  console.log("==================================================================");
  console.log("Users | Requests | Duration | RPS  | p50 (ms) | p95 (ms) | p99 (ms) | Errors | 429s | 5xxs");
  console.log("------------------------------------------------------------------");
  for (const r of results) {
    const row = [
      String(r.concurrency).padEnd(5),
      String(r.totalRequests).padEnd(8),
      `${r.durationSec.toFixed(1)}s`.padEnd(8),
      String(r.requestsPerSec).padEnd(4),
      String(r.p50Ms).padEnd(8),
      String(r.p95Ms).padEnd(8),
      String(r.p99Ms).padEnd(8),
      `${((r.failedRequests / r.totalRequests) * 100).toFixed(1)}%`.padEnd(6),
      String(r.rate429Count).padEnd(4),
      String(r.server5xxCount),
    ].join(" | ");
    console.log(row);
  }
  console.log("==================================================================\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
