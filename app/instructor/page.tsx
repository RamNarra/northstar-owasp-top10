"use client";

import { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Code2,
  Terminal,
  ShieldAlert,
} from "lucide-react";

interface InstructorSolution {
  id: string;
  chapterNumber: string;
  owaspId: string;
  owaspTitle: string;
  storyTitle: string;
  tier: string;
  difficulty: string;
  points: number;
  flag: string;
  objective: string;
  hints: [string, string, string];
  debrief: {
    whatHappened: string;
    whyItWorked: string;
    owasp2025Note: string;
    vulnerableSnippet: string;
    secureSnippet: string;
  };
}

export default function InstructorPage() {
  const [passcode, setPasscode] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [solutions, setSolutions] = useState<InstructorSolution[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/instructor/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.authorized) {
        setIsAuthenticated(true);
        setSolutions(data.solutions || []);
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "Invalid instructor credentials.");
      }
    } catch (_err) {
      setErrorMsg("Authentication request failed. Check server connectivity.");
    } finally {
      setIsLoading(false);
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
                Server-Side Authentication Required
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Access to the master solutions catalog, deterministic exploit commands, and pedagogical
            remediations requires server-side instructor authentication.
          </p>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Instructor Passcode:
              </label>
              <input
                type="password"
                placeholder="Enter workshop passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-mono">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !passcode}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? "Verifying Credentials..." : "Authenticate as Instructor"}
            </button>
          </form>

          <div className="pt-2 text-center">
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
          <div className="p-2 bg-white border border-slate-300 rounded font-mono text-[11px] text-slate-800">
            <strong>Simulation Note:</strong> Chapters A03 and A05 are explicitly designed as deterministic
            simulations. A03 simulates CI/CD supply-chain provenance verification, and A05 simulates dynamic
            SQL tautology injection without executing destructive SQL queries.
          </div>
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
                {solutions.map((ch) => (
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

          {solutions.map((ch) => (
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
