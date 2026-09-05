"use client";

import { useState } from "react";
import { Package, Search, AlertTriangle, CheckCircle, Terminal } from "lucide-react";
import { DEPLOYMENT_MANIFEST } from "@/lib/vulnerabilities/a03-supply-chain";

interface ForensicAuditViewerProps {
  onSolved: (flag: string) => void;
  isSolved: boolean;
}

export default function ForensicAuditViewer({ onSolved, isSolved }: ForensicAuditViewerProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRunAudit = async () => {
    if (!selectedPackage) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/plugins/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName: selectedPackage }),
      });
      const data = await res.json();
      setAuditResult(data);
      if (data.breachTriggered && data.flag) {
        onSolved(data.flag);
      }
    } catch (_e) {
      setAuditResult({ error: "Audit submission failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* CI/CD Build Excerpt */}
      <div className="p-3 bg-slate-950 text-slate-300 rounded font-mono text-xs space-y-1">
        <div className="text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>CI/CD Pipeline Telemetry [Build #10492 - deployment.manifest]</span>
        </div>
        <div className="text-slate-400">&gt; npm install --prefix /var/deploy/northstar-portal</div>
        <div className="text-emerald-400">&gt; fetch northstar-core-ui@3.1.0 from https://cdn.northstar.local [Verified]</div>
        <div className="text-emerald-400">&gt; fetch northstar-crypto-utils@1.0.4 from https://cdn.northstar.local [Verified]</div>
        <div className="text-amber-400">&gt; fetch analytics-telemetry-v2@2.8.1-mirror from http://mirror.untrusted-pkg.net [External Mirror]</div>
        <div className="text-emerald-400">&gt; fetch northstar-auth-client@2.0.1 from https://cdn.northstar.local [Verified]</div>
        <div className="text-slate-400">&gt; Build completed with 0 blocking errors.</div>
      </div>

      {/* Package Manifest Table */}
      <div className="border border-slate-200 rounded overflow-hidden">
        <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-slate-600" />
            <span>Deployment Dependency Manifest</span>
          </div>
          <span className="text-[11px] text-slate-500 font-normal">Audit each source host</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono text-[11px]">
              <tr>
                <th className="p-2.5">Select</th>
                <th className="p-2.5">Package Name</th>
                <th className="p-2.5">Version</th>
                <th className="p-2.5">Distribution Source</th>
                <th className="p-2.5">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {DEPLOYMENT_MANIFEST.map((pkg) => {
                const isSelected = selectedPackage === pkg.name;
                const isSuspicious = pkg.source.includes("untrusted-pkg.net");

                return (
                  <tr
                    key={pkg.name}
                    onClick={() => setSelectedPackage(pkg.name)}
                    className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                      isSelected ? "bg-blue-50/70" : ""
                    }`}
                  >
                    <td className="p-2.5">
                      <input
                        type="radio"
                        name="suspectPackage"
                        checked={isSelected}
                        onChange={() => setSelectedPackage(pkg.name)}
                        className="text-slate-900 focus:ring-slate-900"
                      />
                    </td>
                    <td className="p-2.5 font-semibold text-slate-900">{pkg.name}</td>
                    <td className="p-2.5 text-slate-600">{pkg.version}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[11px] ${
                          isSuspicious
                            ? "bg-amber-100 text-amber-900 font-semibold"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {pkg.source}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-500 text-[10px] truncate max-w-[150px]">
                      {pkg.claimedIntegrity}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forensic Report Submission */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
        <div className="text-xs text-slate-700">
          Selected Target for Forensic Audit:{" "}
          <strong className="font-mono text-slate-900">
            {selectedPackage || "None selected"}
          </strong>
        </div>
        <button
          onClick={handleRunAudit}
          disabled={!selectedPackage || isLoading}
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors disabled:opacity-40"
        >
          {isLoading ? "Submitting Audit..." : "Submit Forensic Report"}
        </button>
      </div>

      {/* Result feedback */}
      {auditResult && (
        <div
          className={`p-3 rounded border text-xs ${
            auditResult.success
              ? "bg-emerald-50 border-emerald-300 text-emerald-950"
              : "bg-red-50 border-red-200 text-red-900"
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            {auditResult.success ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span>{auditResult.success ? "Supply Chain Vulnerability Confirmed!" : "Audit Finding Rejected"}</span>
          </div>
          <p className="text-[11px]">{auditResult.reason}</p>
        </div>
      )}
    </div>
  );
}
