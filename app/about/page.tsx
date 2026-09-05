"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Server, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const [debugData, setDebugData] = useState<any>(null);

  const handleFetchDiagnostics = async () => {
    try {
      const res = await fetch("/api/debug/config");
      const data = await res.json();
      setDebugData(data);
      if (data.breachTriggered) {
        // Trigger A02
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A02" } })
        );
      }
    } catch (_e) {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          About Northstar Systems
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
          Founded in 2024, Northstar Systems designs dedicated hardware telemetry probes,
          perimeter controllers, and zero-trust edge routers for enterprise organizations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="p-6 bg-white border border-slate-200/80 rounded-xl space-y-3 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900">Dedicated Cryptographic Enclaves</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hardware components implement verified secure elements and cryptographic modules to preserve
            integrity across enterprise deployments.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-xl space-y-3 shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-900">Distributed Observability</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Continuous telemetry publication and system metrics coordinated across multi-region infrastructure.
          </p>
        </div>
      </div>

      {/* Deployment Specifications */}
      <div className="border border-slate-200/80 rounded-xl bg-white p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">
            Platform Specifications &amp; Crawler Policies
          </h2>
          <p className="text-xs text-slate-500">
            Deployment metadata and crawler access rules for automated indexing.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-3">
          <div className="flex justify-between items-center text-slate-600">
            <span>Production Version</span>
            <span className="font-mono text-slate-900">v2.4.1-rc3</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Crawler Policy</span>
            <Link href="/robots.txt" className="text-slate-900 font-mono hover:underline">
              /robots.txt
            </Link>
          </div>
          <div className="pt-2 border-t border-slate-200/60 flex justify-between items-center">
            <span className="text-slate-600">Diagnostic Route</span>
            <button
              onClick={handleFetchDiagnostics}
              className="text-xs text-slate-900 font-medium hover:underline"
            >
              Inspect /api/debug/config
            </button>
          </div>
        </div>

        {debugData && (
          <div className="p-4 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">
              Response from /api/debug/config:
            </div>
            <pre className="text-emerald-400 whitespace-pre-wrap">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
