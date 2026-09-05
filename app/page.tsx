"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Activity,
  Lock,
  Layers,
  FileText,
  KeyRound,
} from "lucide-react";
import { CHALLENGES } from "@/lib/challenges";
import Header from "@/components/Header";

export default function HomePage() {
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("northstar_solved");
      if (stored) setSolvedIds(JSON.parse(stored));
    } catch (_e) {}
  }, []);

  const totalPoints = CHALLENGES.reduce(
    (sum, c) => (solvedIds.includes(c.id) ? sum + c.points : sum),
    0
  );

  const handleReset = () => {
    if (confirm("Reset all challenge progress?")) {
      localStorage.removeItem("northstar_solved");
      setSolvedIds([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        solvedCount={solvedIds.length}
        totalCount={CHALLENGES.length}
        totalPoints={totalPoints}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10 space-y-12">
        {/* Incident Alert Banner */}
        <div className="border border-red-200 bg-red-50/50 rounded-lg p-5 sm:p-6 text-slate-900">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-700 uppercase tracking-wider mb-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Chapter 00 · Security Incident Declared</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 mb-3">
            Northstar Portal Compromise
          </h1>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
            At 02:00 UTC, suspicious activities were detected across multiple subsystems of{" "}
            <strong>Northstar Portal</strong>. Initial forensic triage suggests the breach is not a
            single isolated flaw, but a sequence of architectural and implementation weaknesses
            spanning the complete <strong>OWASP Top 10:2025</strong> matrix.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/incident"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Launch Incident Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/instructor"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-700 border border-slate-300 rounded font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              <KeyRound className="w-4 h-4 text-slate-600" />
              <span>Instructor Portal</span>
            </Link>
          </div>
        </div>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-700 uppercase mb-1">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>OWASP Top 10:2025</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Updated to the official 2025 catalog, featuring newly prioritized categories like
              Software Supply Chain Failures (A03) and Mishandling of Exceptional Conditions (A10).
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-700 uppercase mb-1">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>JWT Centerpiece (A07)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive Token Inspector with real-time signature validity tracking. See how
              tampering payload claims breaks signatures, yet vulnerable systems authorize requests anyway.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-700 uppercase mb-1">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Safe Toy Sandboxing</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Purely synthetic accounts, orders, and tokens. Zero arbitrary shell commands, SSRF, or
              destructive database actions. 100% safe for public cloud deployment.
            </p>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>Investigation Timeline Chapters</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {solvedIds.length} / {CHALLENGES.length} Resolved
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg bg-white overflow-hidden">
            {CHALLENGES.map((ch) => {
              const isDone = solvedIds.includes(ch.id);

              return (
                <div
                  key={ch.id}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                      Ch.{ch.chapterNumber}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {ch.storyTitle}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          [{ch.owaspId}]
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate max-w-lg hidden sm:block">
                        {ch.briefing}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-mono text-slate-500 hidden md:inline">
                      {ch.difficulty} · {ch.tier}
                    </span>
                    {isDone ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <Link
                        href={`/incident#${ch.id}`}
                        className="text-xs font-semibold text-blue-700 hover:text-blue-900 font-mono"
                      >
                        Investigate &rarr;
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legacy Reference Note */}
        <div className="p-4 bg-slate-100/70 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1 font-mono">
          <div className="font-bold text-slate-900 uppercase">
            Curriculum Note: OWASP 2021 vs 2025 Edition
          </div>
          <p className="text-slate-600 leading-relaxed font-sans">
            In older courses and tutorials referencing OWASP 2021, you may encounter categories such as
            Server-Side Request Forgery (SSRF) or Cross-Site Scripting (XSS) as standalone headers. In the
            official <strong>OWASP Top 10:2025</strong> edition, SSRF has been consolidated into Broken Access
            Control (A01), while newly prioritized categories like Software Supply Chain Failures (A03) and
            Mishandling of Exceptional Conditions (A10) have been introduced.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-mono">
        Northstar Systems · Incident Investigation Cyber Range · Fictional Training Environment
      </footer>
    </div>
  );
}
