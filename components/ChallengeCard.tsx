"use client";

import { useState } from "react";
import {
  ShieldCheck,
  HelpCircle,
  Code2,
  ChevronDown,
  ChevronUp,
  Terminal,
  AlertOctagon,
  Search,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Challenge } from "@/lib/challenges";
import { INCIDENT_EVIDENCE } from "@/lib/evidence";
import TokenInspector from "./TokenInspector";
import ForensicAuditViewer from "./ForensicAuditViewer";

interface ChallengeCardProps {
  challenge: Challenge;
  isSolved: boolean;
  onSolved: (challengeId: string, flag: string) => void;
}

export default function ChallengeCard({ challenge, isSolved, onSolved }: ChallengeCardProps) {
  const [expandedTab, setExpandedTab] = useState<"investigation" | "lesson">("investigation");
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  // Interactive Target States
  const [a01OrderId, setA01OrderId] = useState<string>("1001");
  const [a01Result, setA01Result] = useState<any>(null);

  const [a02Result, setA02Result] = useState<any>(null);

  const [a04ExportData, setA04ExportData] = useState<any>(null);
  const [a04InputPlaintext, setA04InputPlaintext] = useState<string>("");
  const [a04Result, setA04Result] = useState<any>(null);

  const [a05SearchTerm, setA05SearchTerm] = useState<string>("");
  const [a05Result, setA05Result] = useState<any>(null);

  const [a06Discount, setA06Discount] = useState<number>(0);
  const [a06CouponCode, setA06CouponCode] = useState<string>("WELCOME10");
  const [a06Result, setA06Result] = useState<any>(null);

  const [a08ConfigJson, setA08ConfigJson] = useState<string>('{\n  "maintenanceMode": true,\n  "rateLimitBypass": true\n}');
  const [a08Result, setA08Result] = useState<any>(null);

  const [a09Attempts, setA09Attempts] = useState<number>(0);
  const [a09AuditData, setA09AuditData] = useState<any>(null);

  const [a10Quantity, setA10Quantity] = useState<number>(-1);
  const [a10Result, setA10Result] = useState<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const evidence = INCIDENT_EVIDENCE[challenge.id];

  const toggleHint = (index: number) => {
    if (revealedHints.includes(index)) {
      setRevealedHints(revealedHints.filter((i) => i !== index));
    } else {
      setRevealedHints([...revealedHints, index]);
    }
  };

  // Execution Handlers
  const handleA01FetchOrder = async (idToFetch: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/orders/${idToFetch}`);
      const data = await res.json();
      setA01Result(data);
      if (data.breachTriggered && data.flag) {
        onSolved("A01", data.flag);
      }
    } catch (_e) {
      setA01Result({ error: "Request failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA02CheckDebug = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/debug/config");
      const data = await res.json();
      setA02Result(data);
      if (data.breachTriggered && data.flag) {
        onSolved("A02", data.flag);
      }
    } catch (_e) {
      setA02Result({ error: "Request failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA04FetchBackup = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/account/export?user=alex");
      const data = await res.json();
      setA04ExportData(data);
    } catch (_e) {
      setA04ExportData({ error: "Failed to export backup." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA04VerifyPlaintext = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/account/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decodedPassword: a04InputPlaintext }),
      });
      const data = await res.json();
      setA04Result(data);
      if (data.breachTriggered && data.flag) {
        onSolved("A04", data.flag);
      }
    } catch (_e) {
      setA04Result({ error: "Verification failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA05Search = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(a05SearchTerm)}`);
      const data = await res.json();
      setA05Result(data);
      if (data.breachTriggered && data.flag) {
        onSolved("A05", data.flag);
      }
    } catch (_e) {
      setA05Result({ error: "Search failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA06ApplyCoupon = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentDiscount: a06Discount, code: a06CouponCode }),
      });
      const data = await res.json();
      setA06Result(data);
      if (data.success) {
        setA06Discount(data.newDiscount);
      }
      if (data.breachTriggered && data.flag) {
        onSolved("A06", data.flag);
      }
    } catch (_e) {
      setA06Result({ error: "Coupon request failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA08Import = async () => {
    setIsLoading(true);
    try {
      let parsed = {};
      try {
        parsed = JSON.parse(a08ConfigJson);
      } catch (_e) {}

      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(parsed));
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      const res = await fetch("/api/integrity/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: parsed, checksum: calculatedHash }),
      });
      const resData = await res.json();
      setA08Result(resData);
      if (resData.breachTriggered && resData.flag) {
        onSolved("A08", resData.flag);
      }
    } catch (_e) {
      setA08Result({ error: "Import error." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA09FailedLogin = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@northstar.local",
          password: `badPassword_${Date.now()}`,
        }),
      });
      setA09Attempts((prev) => prev + 1);
    } catch (_e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleA09InspectAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/audit");
      const data = await res.json();
      setA09AuditData(data);
      if (a09Attempts >= 3 && data.breachTriggered && data.flag) {
        onSolved("A09", data.flag);
      }
    } catch (_e) {
      setA09AuditData({ error: "Failed to read audit log." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleA10Checkout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: a10Quantity }),
      });
      const data = await res.json();
      setA10Result(data);
      if (data.breachTriggered && data.flag) {
        onSolved("A10", data.flag);
      }
    } catch (_e) {
      setA10Result({ error: "Checkout failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article
      id={challenge.id}
      className={`border rounded-lg bg-white overflow-hidden transition-all shadow-sm ${
        isSolved ? "border-emerald-300 ring-1 ring-emerald-200" : "border-slate-200"
      }`}
    >
      {/* Chapter Top Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
            CHAPTER {challenge.chapterNumber}
          </span>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
            {challenge.owaspId}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {challenge.storyTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {challenge.tier} · {challenge.difficulty}
          </span>
          {isSolved ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              <span>REPRODUCED ({challenge.points} PTS)</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-slate-500">
              +{challenge.points} PTS
            </span>
          )}
        </div>
      </div>

      {/* Layer 1: Story / Incident Evidence */}
      {evidence && (
        <div className="p-4 bg-amber-50/50 border-b border-amber-100 text-xs text-amber-950">
          <div className="flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-amber-900 mb-0.5">
                {evidence.source} [{evidence.timestamp}]
              </div>
              <p className="text-amber-800 leading-relaxed">{evidence.alert}</p>
              <p className="text-slate-600 mt-1 font-mono text-[11px]">{evidence.context}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs (Layer 2 vs Layer 3) */}
      <div className="flex border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setExpandedTab("investigation")}
          className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors ${
            expandedTab === "investigation"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Layer 2: Investigation &amp; Target</span>
        </button>

        <button
          onClick={() => setExpandedTab("lesson")}
          className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors ${
            expandedTab === "lesson"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Layer 3: Lesson &amp; Remediation</span>
          {isSolved && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 space-y-6">
        {expandedTab === "investigation" && (
          <div className="space-y-5">
            {/* Objective */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs">
              <span className="font-bold text-slate-900 uppercase font-mono tracking-wider block mb-1">
                Investigation Objective:
              </span>
              <p className="text-slate-700 leading-relaxed">{challenge.objective}</p>
            </div>

            {/* Target Interface per Challenge */}
            <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/40">
              <div className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider mb-3">
                Northstar Portal Target Interface
              </div>

              {/* A01 Target: Clear Distinction of AuthN vs AuthZ */}
              {challenge.id === "A01" && (
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-2.5">
                    <div className="p-2 bg-blue-50/60 border border-blue-200 rounded text-[11px] font-mono text-blue-950 space-y-1">
                      <div><strong>Authentication (Who are you?):</strong> Verified as <code>alex@northstar.local</code> (Order #1001 owner).</div>
                      <div><strong>Authorization (What can you access?):</strong> Should only access your own records. What happens if you request #1002?</div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <label className="text-xs font-medium text-slate-700">Order Lookup ID:</label>
                      <input
                        type="text"
                        value={a01OrderId}
                        onChange={(e) => setA01OrderId(e.target.value)}
                        className="px-2 py-1 border border-slate-300 rounded font-mono text-xs w-28"
                      />
                      <button
                        onClick={() => handleA01FetchOrder(a01OrderId)}
                        disabled={isLoading}
                        className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                      >
                        Fetch Order
                      </button>
                    </div>
                  </div>

                  {a01Result && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a01Result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* A02 Target */}
              {challenge.id === "A02" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                    <span>Endpoint: <code className="text-blue-600 font-bold">GET /api/debug/config</code></span>
                    <button
                      onClick={handleA02CheckDebug}
                      disabled={isLoading}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      Query Diagnostic Route
                    </button>
                  </div>
                  {a02Result && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a02Result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* A03 Target (Forensic Simulation) */}
              {challenge.id === "A03" && (
                <div className="space-y-2">
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span><strong>Forensic Supply Chain Simulation:</strong> Audit build manifests and provenance logs. No real third-party packages are installed or executed.</span>
                  </div>
                  <ForensicAuditViewer
                    onSolved={(flag) => onSolved("A03", flag)}
                    isSolved={isSolved}
                  />
                </div>
              )}

              {/* A04 Target (Synthetic Training Credential) */}
              {challenge.id === "A04" && (
                <div className="space-y-3">
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700">
                    <strong>LAB SAFETY BOUNDARY:</strong> All credentials and backup tokens in this challenge are 100% synthetic training fixtures. No real accounts or passwords exist.
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded text-xs">
                    <span className="text-slate-700 font-mono">Export Alex Rivera&apos;s Account Backup:</span>
                    <button
                      onClick={handleA04FetchBackup}
                      disabled={isLoading}
                      className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      Download Backup
                    </button>
                  </div>

                  {a04ExportData && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono space-y-3">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a04ExportData, null, 2)}</pre>
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                        <span className="text-slate-700">Submit Decoded Plaintext Password:</span>
                        <input
                          type="text"
                          placeholder="e.g. password..."
                          value={a04InputPlaintext}
                          onChange={(e) => setA04InputPlaintext(e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded font-mono text-xs w-48"
                        />
                        <button
                          onClick={handleA04VerifyPlaintext}
                          disabled={isLoading}
                          className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                        >
                          Verify Credential
                        </button>
                      </div>
                    </div>
                  )}

                  {a04Result && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a04Result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* A05 Target (Deterministic SQLi Simulation) */}
              {challenge.id === "A05" && (
                <div className="space-y-3">
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span><strong>Deterministic SQL Injection Simulation:</strong> Models dynamic string concatenation into an SQL statement (<code>SELECT * FROM customers WHERE name LIKE &apos;%[INPUT]%&apos;</code>) to demonstrate boolean tautology attacks without executing destructive SQL.</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded text-xs">
                    <Search className="w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search customer directory (e.g. Apex or ' OR '1'='1)..."
                      value={a05SearchTerm}
                      onChange={(e) => setA05SearchTerm(e.target.value)}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded font-mono text-xs"
                    />
                    <button
                      onClick={handleA05Search}
                      disabled={isLoading}
                      className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      Search
                    </button>
                  </div>

                  {a05Result && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono space-y-2">
                      <div className="text-[11px] text-slate-500">
                        Executed Query: <code>{a05Result.generatedQuery}</code>
                      </div>
                      <div className="font-semibold text-slate-800">
                        Records Returned: {a05Result.records?.length || 0}
                      </div>
                      <pre className="whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {JSON.stringify(a05Result.records, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* A06 Target */}
              {challenge.id === "A06" && (
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-3">
                    <div className="flex items-center justify-between font-mono">
                      <span>Order Subtotal: <strong>$100.00 USD</strong></span>
                      <span className="text-emerald-700 font-bold">
                        Current Discount: -${a06Discount}.00 USD
                      </span>
                      <span>Total Due: <strong>${Math.max(0, 100 - a06Discount)}.00 USD</strong></span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <label className="text-slate-700">Promo Code:</label>
                      <input
                        type="text"
                        value={a06CouponCode}
                        onChange={(e) => setA06CouponCode(e.target.value)}
                        className="px-2 py-1 border border-slate-300 rounded font-mono text-xs w-36 uppercase"
                      />
                      <button
                        onClick={handleA06ApplyCoupon}
                        disabled={isLoading}
                        className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                      >
                        Apply Coupon
                      </button>
                      <span className="text-slate-500 text-[11px]">
                        (Goal: Reach at least $30 discount)
                      </span>
                    </div>
                  </div>

                  {a06Result && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a06Result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* A07 Target (JWT Centerpiece) */}
              {challenge.id === "A07" && (
                <TokenInspector
                  onSolved={(flag) => onSolved("A07", flag)}
                  isSolved={isSolved}
                />
              )}

              {/* A08 Target */}
              {challenge.id === "A08" && (
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-2">
                    <label className="text-slate-700 font-mono block">Configuration Payload (JSON):</label>
                    <textarea
                      value={a08ConfigJson}
                      onChange={(e) => setA08ConfigJson(e.target.value)}
                      rows={4}
                      className="w-full p-2 border border-slate-300 rounded font-mono text-xs"
                    />
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-slate-500 text-[11px]">
                        Server verifies client hash against client-supplied hash parameter.
                      </span>
                      <button
                        onClick={handleA08Import}
                        disabled={isLoading}
                        className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                      >
                        Import Config
                      </button>
                    </div>
                  </div>

                  {a08Result && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a08Result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* A09 Target (Stateless Logging Absence Demonstration) */}
              {challenge.id === "A09" && (
                <div className="space-y-3">
                  <div className="p-2 bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700">
                    <strong>Detection Capability Assessment:</strong> Demonstrates the critical security flaw where authentication failures are dropped silently with zero logging or alert emission.
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Simulate Failed Login Attacks on <code>admin@northstar.local</code>:</span>
                      <button
                        onClick={handleA09FailedLogin}
                        disabled={isLoading}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                      >
                        Trigger Failed Login Attempt (+1)
                      </button>
                    </div>
                    <div className="text-slate-600 font-mono text-[11px]">
                      Failed Login Counter: <strong>{a09Attempts}</strong> (Trigger at least 3, then inspect audit log)
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-700">Check Audit Log at <code>/api/audit</code>:</span>
                      <button
                        onClick={handleA09InspectAudit}
                        disabled={isLoading}
                        className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                      >
                        Inspect Audit Log
                      </button>
                    </div>
                  </div>

                  {a09AuditData && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                      <div className="text-slate-500 text-[11px] mb-1">
                        Notice: Audit log shows zero entries for the {a09Attempts} failed logins!
                      </div>
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a09AuditData, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}

              {/* A10 Target (Fail-Open Exception) */}
              {challenge.id === "A10" && (
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-slate-200 rounded text-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-slate-700 font-medium">Item Quantity:</label>
                      <input
                        type="number"
                        value={a10Quantity}
                        onChange={(e) => setA10Quantity(Number(e.target.value))}
                        className="px-2 py-1 border border-slate-300 rounded font-mono text-xs w-24"
                      />
                      <button
                        onClick={handleA10Checkout}
                        disabled={isLoading}
                        className="px-4 py-1 bg-slate-900 text-white rounded text-xs font-medium hover:bg-slate-800 transition-colors"
                      >
                        Process Checkout
                      </button>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Target: Pass an invalid negative quantity (<code>-1</code>) to trigger an arithmetic underflow exception. The generic handler fails open and completes the order as PAID.
                    </div>
                  </div>

                  {a10Result && (
                    <div className="p-3 bg-white border border-slate-200 rounded text-xs font-mono">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(a10Result, null, 2)}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3 Progressive Hints */}
            <div className="border border-slate-200 rounded-lg p-3.5 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Progressive Investigation Hints</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {challenge.hints.map((hint, idx) => {
                  const isRevealed = revealedHints.includes(idx);
                  const labels = ["Hint 1: Conceptual Direction", "Hint 2: Location & Target", "Hint 3: Solution Payload"];

                  return (
                    <div key={idx} className="text-xs border border-slate-200 rounded bg-white overflow-hidden">
                      <button
                        onClick={() => toggleHint(idx)}
                        className="w-full px-3 py-1.5 flex items-center justify-between text-left text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                      >
                        <span>{labels[idx]}</span>
                        {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {isRevealed && (
                        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 text-slate-800 font-mono text-[11px] leading-relaxed">
                          {hint}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Layer 3: Lesson & Remediation */}
        {expandedTab === "lesson" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <span className="font-bold text-slate-900 uppercase font-mono block">
                  What Happened
                </span>
                <p className="text-slate-700 leading-relaxed">{challenge.debrief.whatHappened}</p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <span className="font-bold text-slate-900 uppercase font-mono block">
                  Why It Worked
                </span>
                <p className="text-slate-700 leading-relaxed">{challenge.debrief.whyItWorked}</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-950">
              <span className="font-bold font-mono uppercase block mb-1">
                OWASP Top 10:2025 Context
              </span>
              <p className="leading-relaxed">{challenge.debrief.owasp2025Note}</p>
            </div>

            {/* Side-by-Side Code Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2">
              <div className="border border-red-200 rounded bg-red-50/30 overflow-hidden">
                <div className="px-3 py-1.5 bg-red-100/70 border-b border-red-200 text-[11px] font-mono font-bold text-red-900">
                  VULNERABLE IMPLEMENTATION
                </div>
                <pre className="p-3 text-[11px] font-mono text-red-950 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {challenge.debrief.vulnerableSnippet}
                </pre>
              </div>

              <div className="border border-emerald-200 rounded bg-emerald-50/30 overflow-hidden">
                <div className="px-3 py-1.5 bg-emerald-100/70 border-b border-emerald-200 text-[11px] font-mono font-bold text-emerald-900">
                  SECURE REMEDIATION
                </div>
                <pre className="p-3 text-[11px] font-mono text-emerald-950 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {challenge.debrief.secureSnippet}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
