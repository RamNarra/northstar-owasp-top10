"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Lock,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Code2,
  Terminal,
  ShieldAlert,
} from "lucide-react";
import { CHALLENGES } from "@/lib/challenges";

export default function InstructorPage() {
  const [passcode, setPasscode] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const expectedPasscode =
    process.env.NEXT_PUBLIC_INSTRUCTOR_PASSCODE || "northstar-instructor-2025";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === expectedPasscode) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid instructor passcode. (Default demo: northstar-instructor-2025)");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#fbfcfd]">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white">
              <KeyRound className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Instructor Portal Gate
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Northstar Security Incident Solutions
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            This section contains complete vulnerability analysis, exploit payloads, flags, and
            teaching recommendations for workshop facilitators.
          </p>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Instructor Passcode:
              </label>
              <input
                type="password"
                placeholder="Enter passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            {errorMsg && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-mono">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
            >
              Access Instructor Dashboard
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Passcode hint:</span>
            <code>northstar-instructor-2025</code>
          </div>

          <div className="text-center pt-1">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Incident Portal</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcfd] text-slate-900">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <span>INSTRUCTOR SOLUTIONS MANUAL · OWASP TOP 10:2025</span>
          </div>
          <Link
            href="/incident"
            className="text-xs font-mono text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Lab</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Guide Overview */}
        <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-700 space-y-2">
          <h2 className="font-bold text-slate-900 text-sm font-mono uppercase">
            Workshop Facilitator Guidance
          </h2>
          <p className="leading-relaxed font-sans">
            Use this dashboard during active classroom or workshop sessions. Students should solve
            challenges independently using the 3 progressive hints on their cards. If a student is
            stuck after Hint 3, review the exact exploit sequence below.
          </p>
        </div>

        {/* Master Flags Table */}
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-mono text-xs font-bold text-slate-900 uppercase">
            Master Flags Catalog
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-mono text-[11px]">
                <tr>
                  <th className="p-3">Chapter</th>
                  <th className="p-3">OWASP 2025</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {CHALLENGES.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{ch.chapterNumber}</td>
                    <td className="p-3 text-blue-700">{ch.owaspId}</td>
                    <td className="p-3 text-slate-800">{ch.storyTitle}</td>
                    <td className="p-3 text-slate-600">{ch.points}</td>
                    <td className="p-3 text-emerald-800 font-bold select-all">{ch.flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Solutions by Chapter */}
        <div className="space-y-6">
          <h2 className="text-base font-bold text-slate-900 font-mono uppercase tracking-wider">
            Detailed Exploitation &amp; Remediation Playbook
          </h2>

          {CHALLENGES.map((ch) => (
            <div
              key={ch.id}
              className="border border-slate-200 rounded-lg bg-white p-5 space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                    Ch.{ch.chapterNumber}
                  </span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-900 rounded">
                    {ch.owaspId}: {ch.owaspTitle}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{ch.storyTitle}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Tier: <strong>{ch.tier}</strong>
                </span>
              </div>

              {/* Exploit Walkthrough */}
              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="font-bold text-slate-800 uppercase text-[11px]">
                  Exploit Trigger &amp; Reproduction:
                </div>
                <div className="text-slate-700 font-sans leading-relaxed">
                  {ch.hints[2]}
                </div>
              </div>

              {/* Code comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="border border-red-200 rounded bg-red-50/20 overflow-hidden">
                  <div className="px-3 py-1 bg-red-100 text-[11px] font-mono font-bold text-red-900">
                    Vulnerable Pattern
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-red-950 whitespace-pre-wrap">
                    {ch.debrief.vulnerableSnippet}
                  </pre>
                </div>
                <div className="border border-emerald-200 rounded bg-emerald-50/20 overflow-hidden">
                  <div className="px-3 py-1 bg-emerald-100 text-[11px] font-mono font-bold text-emerald-900">
                    Secure Remediation
                  </div>
                  <pre className="p-3 text-[11px] font-mono text-emerald-950 whitespace-pre-wrap">
                    {ch.debrief.secureSnippet}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
