"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, Shield, Server, Terminal, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const [debugData, setDebugData] = useState<any>(null);

  const handleTestDiagnostic = async () => {
    try {
      const res = await fetch("/api/debug/config");
      const data = await res.json();
      setDebugData(data);
      if (data.breachTriggered) {
        // Unlock A02 finding
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A02" } })
        );
      }
    } catch (_e) {}
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          About Northstar Systems
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Founded in 2024, Northstar Systems designs tamper-resistant cryptographic appliances,
          secure telemetry probes, and edge policy routers for enterprise infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-slate-200 rounded-lg space-y-2 shadow-sm">
          <Shield className="w-5 h-5 text-slate-800" />
          <h3 className="font-bold text-sm text-slate-900">Cryptographic Integrity</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our hardware implements dedicated secure elements and audited firmware to maintain strict
            boundaries across zero-trust networks.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200 rounded-lg space-y-2 shadow-sm">
          <Server className="w-5 h-5 text-slate-800" />
          <h3 className="font-bold text-sm text-slate-900">Distributed Observability</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Real-time metric publication and edge health monitoring deployed across multi-cloud regions.
          </p>
        </div>
      </div>

      {/* System Specifications & Diagnostics Section */}
      <div className="border border-slate-200 rounded-lg bg-white p-6 space-y-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900">
            System Specifications &amp; Release Status
          </h2>
          <p className="text-xs text-slate-500">
            Current deployment diagnostics and crawler access policies.
          </p>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Active Build:</span>
            <span className="text-slate-800 font-semibold">northstar-portal-v2.4.1-rc3</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Crawler Policy:</span>
            <Link href="/robots.txt" className="text-blue-600 hover:underline">
              /robots.txt
            </Link>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-500">Internal Diagnostics Endpoint:</span>
            <button
              onClick={handleTestDiagnostic}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Fetch /api/debug/config
            </button>
          </div>
        </div>

        {debugData && (
          <div className="p-4 bg-slate-900 text-slate-200 rounded text-xs font-mono overflow-x-auto space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">
              Response from GET /api/debug/config:
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
