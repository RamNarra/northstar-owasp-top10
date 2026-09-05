"use client";

import { useState } from "react";
import {
  FileCheck,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { DEPLOYMENT_MANIFEST } from "@/lib/vulnerabilities/a03-supply-chain";

export default function OperationsPage() {
  const [selectedPkg, setSelectedPkg] = useState<string>("");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  const [configJson, setConfigJson] = useState<string>(
    '{\n  "maintenanceMode": true,\n  "bypassRateLimit": true\n}'
  );
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importResult, setImportResult] = useState<any>(null);

  const auditPackage = async () => {
    if (!selectedPkg || isAuditing) return;
    setIsAuditing(true);
    setAuditResult(null);
    try {
      const res = await fetch("/api/plugins/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName: selectedPkg }),
      });
      const data = await res.json();
      setAuditResult(data);
      if (data.breachTriggered) {
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A03" } })
        );
      }
    } catch (_err) {
      setAuditResult({
        success: false,
        reason: "Network error communicating with package audit service.",
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const importConfig = async () => {
    if (isImporting) return;
    setIsImporting(true);
    setImportResult(null);
    try {
      const config = JSON.parse(configJson);
      const bytes = new TextEncoder().encode(JSON.stringify(config));
      const buffer = await crypto.subtle.digest("SHA-256", bytes);
      const checksum = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const res = await fetch("/api/integrity/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, checksum }),
      });
      const data = await res.json();
      setImportResult(data);
      if (data.breachTriggered) {
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A08" } })
        );
      }
    } catch {
      setImportResult({
        verified: false,
        error: "Invalid JSON configuration format. Ensure valid syntax.",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 font-mono">
          Infrastructure Governance
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">
          Platform Operations Console
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          Deployment provenance verification and runtime configuration tools used by Northstar
          platform operations teams to validate dependencies and service settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Deployment Dependencies & Provenance (A03) */}
        <section className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                <FileCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">
                  Deployment Dependencies &amp; Provenance
                </h2>
                <span className="text-[10px] text-slate-400 font-mono">
                  Catalog: build-manifest-v3.json
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Review deployed package sources and registry authorities before approving runtime release bundles.
            </p>

            <div className="space-y-2">
              {DEPLOYMENT_MANIFEST.map((pkg) => {
                const isUntrusted = pkg.source.includes("untrusted-pkg.net");
                const isSelected = selectedPkg === pkg.name;

                return (
                  <button
                    key={pkg.name}
                    type="button"
                    onClick={() => setSelectedPkg(pkg.name)}
                    className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-all ${
                      isSelected
                        ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">{pkg.name}</span>
                      <span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {pkg.version}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 truncate">
                      Source: <span className={isUntrusted ? "text-amber-700 font-bold" : "text-slate-600"}>{pkg.source}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={auditPackage}
              disabled={!selectedPkg || isAuditing}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 shadow-sm"
            >
              {isAuditing ? "Auditing Package Authority..." : "Audit Selected Package Provenance"}
            </button>

            {auditResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                  auditResult.success
                    ? "bg-amber-50/80 border-amber-200 text-amber-950"
                    : "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                }`}
              >
                <div className="flex items-start gap-2">
                  {auditResult.success ? (
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <div className="font-semibold">
                      {auditResult.success
                        ? "Unverified Provenance Detected"
                        : "Signature & Authority Verified"}
                    </div>
                    <p className="text-xs">{auditResult.reason}</p>
                    {auditResult.flag && (
                      <div className="text-[10px] font-mono text-amber-800 pt-1">
                        Ref: {auditResult.flag}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 2: Runtime Configuration Import (A08) */}
        <section className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-700">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900">
                  Runtime Configuration Import
                </h2>
                <span className="text-[10px] text-slate-400 font-mono">
                  Endpoint: /api/integrity/import
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Review and import runtime configuration flags for regional edge services. The client
              computes a cryptographic checksum for transmission integrity.
            </p>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">Configuration JSON</span>
                <span className="font-mono text-[10px]">Editable</span>
              </div>
              <textarea
                value={configJson}
                onChange={(e) => setConfigJson(e.target.value)}
                rows={7}
                spellCheck={false}
                className="w-full p-3 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all leading-relaxed"
              />
              <p className="text-[10px] text-slate-400">
                Payload includes <code>&quot;maintenanceMode&quot;: true</code> to test administrative overrides.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={importConfig}
              disabled={isImporting}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 shadow-sm"
            >
              {isImporting ? "Computing Checksum & Submitting..." : "Submit & Verify Integrity"}
            </button>

            {importResult && (
              <div
                className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                  importResult.breachTriggered
                    ? "bg-amber-50/80 border-amber-200 text-amber-950"
                    : importResult.error
                    ? "bg-red-50 border-red-200 text-red-900"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                {importResult.error ? (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold">Configuration Error</div>
                      <p>{importResult.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold">
                      {importResult.verified ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Status: {importResult.status || "TRUSTED_INTEGRITY_VERIFIED"}</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                          <span>Status: CHECKSUM_MISMATCH</span>
                        </>
                      )}
                    </div>
                    {importResult.calculatedHash && (
                      <div className="text-[10px] font-mono text-slate-600 break-all space-y-0.5 bg-white/70 p-2 rounded border border-slate-200/60">
                        <div><strong>Hash:</strong> {importResult.calculatedHash}</div>
                        <div><strong>Client Checksum:</strong> {importResult.providedChecksum}</div>
                      </div>
                    )}
                    {importResult.breachTriggered && (
                      <div className="pt-1 text-[11px] text-slate-700">
                        <strong>Integrity flaw:</strong> The server accepted untrusted runtime flags because it compared the computed hash against the client-supplied checksum within the same request.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Cross link to Admin */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>Executive governance controls and system audit logs require elevated privileges.</span>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 transition-colors shrink-0"
        >
          <span>Executive Administration Portal</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
