"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Server, Building, MapPin, Mail, Activity, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  const [diagConfig, setDiagConfig] = useState<any>(null);
  const [isLoadingDiag, setIsLoadingDiag] = useState(false);

  const handleCheckDiagnostics = async () => {
    setIsLoadingDiag(true);
    try {
      const res = await fetch("/api/debug/config");
      const data = await res.json();
      setDiagConfig(data);
      if (data.breachTriggered || data.debug) {
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A02" } })
        );
      }
    } catch {}
    setIsLoadingDiag(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-16">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
          <span>Enterprise Technology &bull; India Operations</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          About Northstar Systems India
        </h1>
        <p className="text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
          Northstar Systems India Pvt. Ltd. provides specialized telemetry hardware,
          zero-trust perimeter gateways, and tamper-resistant network appliances engineered
          for mission-critical enterprises, financial institutions, and data centers.
        </p>
      </div>

      {/* Core Technology Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="p-6 bg-white border border-slate-200/80 rounded-xl space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Dedicated Cryptographic Enclaves</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hardware components implement verified secure crypto elements to preserve
            audit integrity and prevent physical side-channel tampering across enterprise infrastructure.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200/80 rounded-xl space-y-3 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Distributed Edge Telemetry</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Continuous line-rate event logging and audit synchronization coordinated across
            distributed regional data centers with microsecond accuracy.
          </p>
        </div>
      </div>

      {/* Office Locations */}
      <div className="border border-slate-200/80 rounded-xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 font-mono">
            Presence
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Regional Centers &amp; Technology Labs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Engineered, assembled, and certified through our primary engineering facilities across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Bengaluru (HQ)</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Electronics City Phase 1, Bengaluru, Karnataka 560100
            </p>
            <div className="text-[10px] text-emerald-600 font-mono pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Primary Engineering Lab</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Hyderabad</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              HITEC City, Madhapur, Hyderabad, Telangana 500081
            </p>
            <div className="text-[10px] text-emerald-600 font-mono pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Hardware Assembly Center</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Mumbai</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              Bandra Kurla Complex, Bandra East, Mumbai, Maharashtra 400051
            </p>
            <div className="text-[10px] text-emerald-600 font-mono pt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Compliance &amp; Enterprise Sales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Observability / A02 Debug Config */}
      <div className="border border-slate-200/80 rounded-xl bg-white p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 font-mono">
              Platform Observability
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Telemetry Node Diagnostics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status probe for regional gateway instances.
            </p>
          </div>
          <button
            onClick={handleCheckDiagnostics}
            disabled={isLoadingDiag}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-2 flex-shrink-0"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isLoadingDiag ? "Querying..." : "Query Gateway Node (/api/debug/config)"}</span>
          </button>
        </div>

        {diagConfig && (
          <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto space-y-1">
            <div className="text-slate-400">// Node Diagnostic Dump (Exposed Debug Interface)</div>
            <pre>{JSON.stringify(diagConfig, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Support Section */}
      <div id="support" className="border border-slate-200/80 rounded-xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 font-mono">
            Direct Assistance
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Enterprise Support &amp; Procurement
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            For hardware replacements, SLA agreements, or custom telemetry mesh deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-600" />
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-mono">Technical Inquiries</div>
              <div className="font-semibold text-slate-900">support@northstar.in</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
            <Building className="w-4 h-4 text-slate-600" />
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-mono">Enterprise Sales</div>
              <div className="font-semibold text-slate-900">procurement@northstar.in</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
