"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  RotateCcw,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { CHALLENGES } from "@/lib/challenges";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import ChallengeCard from "@/components/ChallengeCard";

export default function IncidentPage() {
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [latestSolvedFlag, setLatestSolvedFlag] = useState<{ id: string; flag: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("northstar_solved");
      if (stored) {
        setSolvedIds(JSON.parse(stored));
      }
    } catch (_e) {}
  }, []);

  const handleChallengeSolved = (challengeId: string, flag: string) => {
    if (!solvedIds.includes(challengeId)) {
      const updated = [...solvedIds, challengeId];
      setSolvedIds(updated);
      try {
        localStorage.setItem("northstar_solved", JSON.stringify(updated));
      } catch (_e) {}
    }
    setLatestSolvedFlag({ id: challengeId, flag });
  };

  const handleReset = () => {
    if (confirm("Reset all 10 challenge progress?")) {
      try {
        localStorage.removeItem("northstar_solved");
      } catch (_e) {}
      setSolvedIds([]);
      setLatestSolvedFlag(null);
    }
  };

  const totalPoints = CHALLENGES.reduce(
    (sum, c) => (solvedIds.includes(c.id) ? sum + c.points : sum),
    0
  );

  const isAllResolved = solvedIds.length === CHALLENGES.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfcfd]">
      <Header
        solvedCount={solvedIds.length}
        totalCount={CHALLENGES.length}
        totalPoints={totalPoints}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Incident Briefing</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
              Northstar Incident Investigation Timeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Investigate the evidence, reproduce each flaw, unlock root cause debriefs, and secure the portal.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/instructor"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-600" />
              <span>Instructor Portal</span>
            </Link>
          </div>
        </div>

        {/* Global Progress Meter */}
        <ProgressBar solvedCount={solvedIds.length} totalCount={CHALLENGES.length} />

        {/* Success Alert Banner on Latest Solved */}
        {latestSolvedFlag && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-950 uppercase font-mono tracking-wider">
                  Vulnerability Successfully Reproduced! [{latestSolvedFlag.id}]
                </div>
                <div className="text-xs font-mono text-emerald-800 mt-1">
                  Flag Captured: <code>{latestSolvedFlag.flag}</code>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  Layer 3 (Lesson &amp; Remediation) has been unlocked on the challenge card below.
                </div>
              </div>
            </div>
            <button
              onClick={() => setLatestSolvedFlag(null)}
              className="text-xs text-emerald-700 hover:text-emerald-950 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* All Resolved Victory Banner */}
        {isAllResolved && (
          <div className="border border-emerald-300 bg-emerald-50/70 rounded-lg p-6 text-slate-950 space-y-4">
            <div className="flex items-center gap-2 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>INCIDENT RESOLVED · 10/10 VULNERABILITIES RESOLVED</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
              Northstar Portal Secured
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-3xl">
              Congratulations, Investigator! You successfully demonstrated every flaw in the{" "}
              <strong>OWASP Top 10:2025</strong> matrix, escalated privileges by tampering with JWT claims,
              and identified the remediation principles required to protect modern web applications.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/instructor"
                className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Review Full Instructor Defense Guide
              </Link>
            </div>
          </div>
        )}

        {/* Challenge Cards (Chapters 01 - 10) */}
        <div className="space-y-8">
          {CHALLENGES.map((ch) => (
            <ChallengeCard
              key={ch.id}
              challenge={ch}
              isSolved={solvedIds.includes(ch.id)}
              onSolved={handleChallengeSolved}
            />
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 font-mono">
        Northstar Systems · Incident Investigation Cyber Range · OWASP Top 10:2025
      </footer>
    </div>
  );
}
