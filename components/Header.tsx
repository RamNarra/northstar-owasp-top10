"use client";

import Link from "next/link";
import { ShieldAlert, RotateCcw, KeyRound } from "lucide-react";

interface HeaderProps {
  solvedCount: number;
  totalCount: number;
  totalPoints: number;
  onReset: () => void;
}

export default function Header({
  solvedCount,
  totalCount,
  totalPoints,
  onReset,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-900 leading-none">
                NORTHSTAR SYSTEMS
              </div>
              <div className="text-[11px] font-mono text-slate-500 tracking-wider uppercase mt-0.5">
                Incident Response Portal · OWASP 2025
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200">
              SOLVED: <strong className="text-slate-900">{solvedCount}/{totalCount}</strong>
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200">
              SCORE: <strong className="text-blue-950">{totalPoints} PTS</strong>
            </span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            title="Reset training environment"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Lab</span>
          </button>

          <Link
            href="/instructor"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-slate-700" />
            <span>Instructor Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
