"use client";

import { useEffect, useState } from "react";
import { FileCheck, Sliders, AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, ArrowRight, Info, RotateCcw } from "lucide-react";
import Link from "next/link";
import { DEPLOYMENT_MANIFEST } from "@/lib/vulnerabilities/a03-supply-chain";

const SAFE_CONFIG = '{\n  "maintenanceMode": false,\n  "bypassRateLimit": false\n}';

export default function OperationsConsole() {
  const [selectedPkg, setSelectedPkg] = useState("");
  const [auditResult, setAuditResult] = useState<any>(null);
  const [configJson, setConfigJson] = useState(SAFE_CONFIG);
  const [checksum, setChecksum] = useState("");
  const [importResult, setImportResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const hashConfig = async (value: string) => {
    const config = JSON.parse(value);
    const bytes = new TextEncoder().encode(JSON.stringify(config));
    const buffer = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  useEffect(() => {
    void hashConfig(SAFE_CONFIG).then(setChecksum);
  }, []);

  const auditPackage = async (packageName: string) => {
    if (busy) return;
    setBusy(true);
    setSelectedPkg(packageName);
    setAuditResult(null);
    try {
      const res = await fetch("/api/plugins/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName }),
      });
      const data = await res.json();
      setAuditResult(data);
      if (data.breachTriggered) window.dispatchEvent(new CustomEvent("northstar_finding", { detail: { id: "A03" } }));
    } catch {
      setAuditResult({ success: false, reason: "Network error communicating with package audit service." });
    } finally {
      setBusy(false);
    }
  };

  const recalculateChecksum = async () => {
    try {
      setChecksum(await hashConfig(configJson));
      setImportResult(null);
    } catch {
      setImportResult({ error: "Fix the JSON syntax before recalculating the checksum." });
    }
  };

  const importConfig = async () => {
    if (busy) return;
    setBusy(true);
    setImportResult(null);
    try {
      const config = JSON.parse(configJson);
      const res = await fetch("/api/integrity/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config, checksum }),
      });
      const data = await res.json();
      setImportResult(data);
      if (data.breachTriggered) window.dispatchEvent(new CustomEvent("northstar_finding", { detail: { id: "A08" } }));
    } catch {
      setImportResult({ error: "Invalid JSON configuration format. Ensure valid syntax." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="border-b border-slate-100 pb-6">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600 font-mono">Infrastructure Governance</span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950 mt-1">Platform Operations Console</h1>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">Review deployment dependencies and test runtime configuration integrity controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-700"><FileCheck className="w-4 h-4" /></div><div><h2 className="font-bold text-sm text-slate-900">Dependency Provenance Review</h2><span className="text-[10px] text-slate-400 font-mono">build-manifest-v3.json</span></div></div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-blue-900 leading-relaxed"><strong>Beginner clue:</strong> One package uses an <strong>HTTP mirror</strong> instead of the trusted HTTPS CDN. <strong>Click that package.</strong></div>
            <div className="space-y-2">
              {DEPLOYMENT_MANIFEST.map((pkg) => {
                const bad = pkg.source.includes("untrusted-pkg.net");
                return <button key={pkg.name} type="button" onClick={() => void auditPackage(pkg.name)} className={`w-full text-left p-3 rounded-lg border text-xs transition-all ${selectedPkg === pkg.name ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"}`}>
                  <div className="flex items-center justify-between gap-2"><span className="font-semibold text-slate-900 font-mono">{pkg.name}</span><span className="text-[10px] text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">{pkg.version}</span></div>
                  <div className="text-[10px] text-slate-500 mt-1 truncate">Source: <span className={bad ? "text-amber-700 font-bold" : "text-slate-600"}>{pkg.source}</span></div>
                  <div className={`mt-2 text-[10px] font-semibold ${bad ? "text-amber-700" : "text-slate-400"}`}>{bad ? "⚠ Untrusted HTTP source — audit this" : "Click to audit"}</div>
                </button>;
              })}
            </div>
          </div>
          {auditResult && <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${auditResult.success ? "bg-amber-50/80 border-amber-200 text-amber-950" : "bg-emerald-50/80 border-emerald-200 text-emerald-950"}`}><div className="flex items-start gap-2">{auditResult.success ? <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> : <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}<div className="space-y-1"><div className="font-semibold">{auditResult.success ? "A03 Detected" : "Package Verified"}</div><p>{auditResult.reason}</p>{auditResult.flag && <div className="text-[10px] font-mono text-amber-800 pt-1">Ref: {auditResult.flag}</div>}</div></div></div>}
        </section>

        <section className="border border-slate-200 rounded-xl bg-white p-6 shadow-sm space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-700"><Sliders className="w-4 h-4" /></div><div><h2 className="font-bold text-sm text-slate-900">Runtime Configuration Integrity</h2><span className="text-[10px] text-slate-400 font-mono">/api/integrity/import</span></div></div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-blue-900 leading-relaxed"><strong>Beginner clue:</strong> Change <code className="font-mono">maintenanceMode</code> to <code className="font-mono">true</code>, click <strong>Recalculate Checksum</strong>, then submit. The lesson is that the client controls both the data and the checksum.</div>
            <div className="space-y-1.5"><div className="flex items-center justify-between text-[11px] text-slate-500"><span className="font-medium text-slate-700">Configuration JSON</span><span className="font-mono text-[10px]">Editable</span></div><textarea value={configJson} onChange={(e) => setConfigJson(e.target.value)} rows={6} spellCheck={false} className="w-full p-3 border border-slate-200 rounded-lg font-mono text-xs bg-slate-50 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all leading-relaxed" /></div>
            <div className="space-y-1.5"><div className="flex items-center justify-between text-[11px] text-slate-500"><span className="font-medium text-slate-700">Client-supplied SHA-256 checksum</span><button type="button" onClick={() => void recalculateChecksum()} className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800"><RotateCcw className="w-3 h-3" /> Recalculate Checksum</button></div><div className="p-2.5 border border-slate-200 rounded-lg bg-slate-50 font-mono text-[10px] text-slate-600 break-all min-h-10">{checksum || "Calculating..."}</div></div>
            <p className="text-[10px] text-slate-400">Start with the safe configuration. Change one flag, recalculate the client checksum, and submit again.</p>
          </div>
          <div className="space-y-3 pt-2"><button onClick={() => void importConfig()} disabled={busy} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-40 shadow-sm">{busy ? "Processing..." : "Submit & Verify Integrity"}</button>
            {importResult && <div className={`p-3.5 rounded-lg border text-xs leading-relaxed ${importResult.breachTriggered ? "bg-amber-50/80 border-amber-200 text-amber-950" : importResult.error ? "bg-red-50 border-red-200 text-red-900" : "bg-slate-50 border-slate-200 text-slate-800"}`}>{importResult.error ? <div className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" /><div><div className="font-semibold">Configuration Error</div><p>{importResult.error}</p></div></div> : <div className="space-y-2"><div className="flex items-center gap-1.5 font-semibold">{importResult.verified ? <><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /><span>Status: {importResult.status || "TRUSTED_INTEGRITY_VERIFIED"}</span></> : <><AlertTriangle className="w-4 h-4 text-red-600 shrink-0" /><span>Status: CHECKSUM_MISMATCH</span></>}</div>{importResult.breachTriggered && <div className="pt-1 text-[11px] text-slate-700"><strong>A08 Detected:</strong> The server trusted a checksum supplied by the same client that supplied the configuration.</div>}</div>}</div>}
          </div>
        </section>
      </div>

      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"><div className="flex items-center gap-2 text-slate-600"><Info className="w-4 h-4 text-slate-400 shrink-0" /><span>Executive governance controls and system audit logs require elevated privileges.</span></div><Link href="/admin" className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 transition-colors shrink-0"><span>Executive Administration Portal</span><ArrowRight className="w-3.5 h-3.5" /></Link></div>
    </div>
  );
}
