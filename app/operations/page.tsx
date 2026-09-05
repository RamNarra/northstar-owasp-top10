"use client";

import { useState } from "react";
import { FileCheck, Sliders, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DEPLOYMENT_MANIFEST } from "@/lib/vulnerabilities/a03-supply-chain";

export default function OperationsPage() {
  const [selectedPkg, setSelectedPkg] = useState("");
  const [auditResult, setAuditResult] = useState<any>(null);
  const [configJson, setConfigJson] = useState('{\n  "maintenanceMode": true,\n  "bypassRateLimit": true\n}');
  const [importResult, setImportResult] = useState<any>(null);

  const auditPackage = async () => {
    if (!selectedPkg) return;
    const res = await fetch("/api/plugins/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageName: selectedPkg }),
    });
    const data = await res.json();
    setAuditResult(data);
    if (data.breachTriggered) {
      window.dispatchEvent(new CustomEvent("northstar_finding", { detail: { id: "A03" } }));
    }
  };

  const importConfig = async () => {
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
        window.dispatchEvent(new CustomEvent("northstar_finding", { detail: { id: "A08" } }));
      }
    } catch {
      setImportResult({ error: "Invalid JSON configuration" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-10">
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 font-mono">Operations</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">Platform Operations</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-2xl">Deployment provenance and runtime configuration tools used by Northstar operations teams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-slate-700" />
            <h2 className="font-bold text-sm text-slate-900">Deployment Dependencies &amp; Provenance</h2>
          </div>
          <p className="text-xs text-slate-500">Review deployed package sources and registry provenance before approving a release.</p>
          <div className="space-y-2">
            {DEPLOYMENT_MANIFEST.map((pkg) => (
              <button
                key={pkg.name}
                onClick={() => setSelectedPkg(pkg.name)}
                className={`w-full text-left p-3 rounded-lg border text-xs font-mono transition-colors ${selectedPkg === pkg.name ? "border-slate-900 bg-slate-50" : "border-slate-200 hover:bg-slate-50"}`}
              >
                <div className="flex justify-between gap-3"><span>{pkg.name}</span><span className="text-slate-400">{pkg.version}</span></div>
                <div className="text-[10px] text-slate-500 mt-1 truncate">Source: {pkg.source}</div>
              </button>
            ))}
          </div>
          <button onClick={auditPackage} disabled={!selectedPkg} className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold disabled:opacity-40">Audit Selected Package Provenance</button>
          {auditResult && <div className={`p-3 rounded-lg border text-xs ${auditResult.success ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-slate-50 border-slate-200 text-slate-700"}`}><div className="flex gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /><span>{auditResult.reason}</span></div></div>}
        </section>

        <section className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-700" />
            <h2 className="font-bold text-sm text-slate-900">Runtime Configuration Import</h2>
          </div>
          <p className="text-xs text-slate-500">Review and import runtime settings for regional gateway services.</p>
          <textarea value={configJson} onChange={(e) => setConfigJson(e.target.value)} rows={8} className="w-full p-3 border border-slate-300 rounded-lg font-mono text-xs bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200" />
          <button onClick={importConfig} className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold">Submit &amp; Verify Integrity</button>
          {importResult && <div className={`p-3 rounded-lg border text-xs ${importResult.breachTriggered ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}><div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0" /><pre className="whitespace-pre-wrap font-mono overflow-x-auto">{JSON.stringify(importResult, null, 2)}</pre></div></div>}
        </section>
      </div>
    </div>
  );
}
