"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Sliders,
  FileCheck,
  Activity,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { DEPLOYMENT_MANIFEST } from "@/lib/vulnerabilities/a03-supply-chain";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");

  // A03 state
  const [selectedPkg, setSelectedPkg] = useState<string>("");
  const [pkgAuditResult, setPkgAuditResult] = useState<any>(null);

  // A08 state
  const [configJson, setConfigJson] = useState<string>('{\n  "maintenanceMode": true,\n  "bypassRateLimit": true\n}');
  const [importResult, setImportResult] = useState<any>(null);

  // A09 state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    try {
      const savedToken = localStorage.getItem("northstar_jwt_token");
      if (savedToken) {
        setToken(savedToken);
        verifyAdmin(savedToken);
      } else {
        setLoading(false);
      }
    } catch (_e) {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAdmin = async (t: string) => {
    try {
      const res = await fetch("/api/admin/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` },
        body: JSON.stringify({ token: t }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        loadAuditLogs();
      }
    } catch (_e) {}
    setLoading(false);
  };

  const loadAuditLogs = async () => {
    try {
      const res = await fetch("/api/audit");
      const data = await res.json();
      if (data.logs) {
        setAuditLogs(data.logs);
        // Dispatch A09 finding
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A09" } })
        );
      }
    } catch (_e) {}
  };

  const handleAuditPackage = async () => {
    if (!selectedPkg) return;
    try {
      const res = await fetch("/api/plugins/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName: selectedPkg }),
      });
      const data = await res.json();
      setPkgAuditResult(data);
      if (data.breachTriggered) {
        // Unlock A03 finding
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A03" } })
        );
      }
    } catch (_e) {}
  };

  const handleImportConfig = async () => {
    try {
      const parsed = JSON.parse(configJson);
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
      setImportResult(resData);
      if (resData.breachTriggered) {
        // Unlock A08 finding
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A08" } })
        );
      }
    } catch (_e) {}
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs font-mono text-slate-500">
        Verifying administrator credentials...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 bg-white border border-slate-200 rounded-lg shadow-sm text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-base font-bold text-slate-900">
          Executive Administration Portal
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          Access is strictly restricted to sessions holding the <code>admin</code> role claim. Your
          current session role is <code>user</code>.
        </p>
        <div className="pt-2">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Account &amp; Session Inspector</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
              ROLE: ADMIN
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              Executive Administration Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Northstar Operations &amp; Infrastructure Governance Console
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded border border-slate-200">
          Treasury Balance: ₹3,50,00,000 INR
        </span>
      </div>

      {/* Admin Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: System Updates & Dependencies (A03) */}
        <div className="border border-slate-200 rounded-lg bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <FileCheck className="w-4 h-4 text-slate-600" />
            <span>Deployment Dependencies &amp; Provenance</span>
          </div>
          <p className="text-xs text-slate-500">
            Audit deployed package manifests against internal signature authorities.
          </p>

          <div className="space-y-2">
            {DEPLOYMENT_MANIFEST.map((pkg) => (
              <div
                key={pkg.name}
                onClick={() => setSelectedPkg(pkg.name)}
                className={`p-2.5 rounded border text-xs font-mono cursor-pointer transition-colors ${
                  selectedPkg === pkg.name
                    ? "border-slate-900 bg-slate-50 font-semibold"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between">
                  <span>{pkg.name}</span>
                  <span className="text-slate-400">{pkg.version}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  Source: {pkg.source}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAuditPackage}
            disabled={!selectedPkg}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Audit Selected Package Provenance
          </button>

          {pkgAuditResult && (
            <div
              className={`p-3 rounded border text-xs ${
                pkgAuditResult.success
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              <p className="font-semibold">{pkgAuditResult.reason}</p>
            </div>
          )}
        </div>

        {/* Section 2: Configuration Importer (A08) */}
        <div className="border border-slate-200 rounded-lg bg-white p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>System Configuration Importer</span>
          </div>
          <p className="text-xs text-slate-500">
            Upload configuration JSON. Integrity is verified against client-supplied checksum.
          </p>

          <textarea
            value={configJson}
            onChange={(e) => setConfigJson(e.target.value)}
            rows={5}
            className="w-full p-2.5 border border-slate-300 rounded font-mono text-xs bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />

          <button
            onClick={handleImportConfig}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
          >
            Submit &amp; Verify Integrity
          </button>

          {importResult && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono">
              <pre className="whitespace-pre-wrap">{JSON.stringify(importResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: System Audit Trail (A09) */}
      <div className="border border-slate-200 rounded-lg bg-white p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Activity className="w-4 h-4 text-slate-600" />
            <span>Security Audit Log Viewer</span>
          </div>
          <button
            onClick={loadAuditLogs}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono text-[11px]">
              <tr>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Event</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5">Actor</th>
                <th className="p-2.5">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-500">{log.timestamp}</td>
                  <td className="p-2.5 font-semibold text-slate-800">{log.event}</td>
                  <td className="p-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                      {log.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-600">{log.actor}</td>
                  <td className="p-2.5 text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          Notice: Only successful system events are preserved. Security anomalies and failed
          authentication attempts are not recorded.
        </p>
      </div>
    </div>
  );
}
