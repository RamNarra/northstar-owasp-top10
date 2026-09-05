"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, X, ChevronRight, CheckCircle2, Code2, AlertTriangle } from "lucide-react";
import { CHALLENGES, Challenge } from "@/lib/challenges";

export default function SecurityFindingDrawer() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [justUnlocked, setJustUnlocked] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("northstar_unlocked_findings");
      if (stored) {
        setUnlockedIds(JSON.parse(stored));
      }
    } catch (_e) {}

    const handleFinding = (e: Event) => {
      const customEvent = e as CustomEvent<{ id: string }>;
      const id = customEvent.detail?.id;
      if (!id) return;

      setUnlockedIds((prev) => {
        if (!prev.includes(id)) {
          const updated = [...prev, id];
          try {
            localStorage.setItem("northstar_unlocked_findings", JSON.stringify(updated));
          } catch (_err) {}
          return updated;
        }
        return prev;
      });

      setActiveChallengeId(id);
      setJustUnlocked(id);
      setIsOpen(true);
    };

    window.addEventListener("northstar_finding", handleFinding);
    return () => window.removeEventListener("northstar_finding", handleFinding);
  }, []);

  const activeChallenge = CHALLENGES.find((c) => c.id === activeChallengeId) || null;

  if (unlockedIds.length === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Pill (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            if (!activeChallengeId && unlockedIds.length > 0) {
              setActiveChallengeId(unlockedIds[unlockedIds.length - 1]);
            }
            setIsOpen(true);
          }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-3.5 py-2 bg-slate-900 text-white rounded-full text-xs font-mono shadow-lg hover:bg-slate-800 transition-all border border-slate-700"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>Security Findings ({unlockedIds.length}/10 Discovered)</span>
        </button>
      )}

      {/* Slide-out Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Security Analysis &amp; Findings
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500">
                    Discovered through application inspection ({unlockedIds.length} of 10 identified)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Findings Selector Tabs */}
            <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100/60 text-xs font-mono divide-x divide-slate-200">
              {unlockedIds.map((id) => {
                const isSelected = activeChallengeId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveChallengeId(id)}
                    className={`px-3 py-2 flex-shrink-0 transition-colors ${
                      isSelected
                        ? "bg-white font-bold text-slate-900 border-b-2 border-slate-900"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {id}
                  </button>
                );
              })}
            </div>

            {/* Finding Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {activeChallenge ? (
                <>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono font-bold text-[11px]">
                        {activeChallenge.owaspId}: {activeChallenge.owaspTitle}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        [{activeChallenge.storyTitle}]
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 pt-1">
                      {activeChallenge.owaspTitle}
                    </h4>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                    <span className="font-bold text-slate-900 uppercase font-mono text-[11px] block">
                      What Happened:
                    </span>
                    <p className="text-slate-700 leading-relaxed font-sans">
                      {activeChallenge.debrief.whatHappened}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1">
                    <span className="font-bold text-slate-900 uppercase font-mono text-[11px] block">
                      Why It Worked (Root Cause):
                    </span>
                    <p className="text-slate-700 leading-relaxed font-sans">
                      {activeChallenge.debrief.whyItWorked}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-blue-950 space-y-1">
                    <span className="font-bold uppercase font-mono text-[11px] block">
                      OWASP Top 10:2025 Context:
                    </span>
                    <p className="leading-relaxed font-sans text-[11px]">
                      {activeChallenge.debrief.owasp2025Note}
                    </p>
                  </div>

                  {/* Code Comparison */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 font-bold font-mono text-slate-800 uppercase text-[11px]">
                      <Code2 className="w-4 h-4 text-slate-600" />
                      <span>Implementation Comparison</span>
                    </div>

                    <div className="border border-red-200 rounded bg-red-50/30 overflow-hidden">
                      <div className="px-3 py-1 bg-red-100 text-[10px] font-mono font-bold text-red-900">
                        VULNERABLE BACKEND CODE
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-red-950 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeChallenge.debrief.vulnerableSnippet}
                      </pre>
                    </div>

                    <div className="border border-emerald-200 rounded bg-emerald-50/30 overflow-hidden">
                      <div className="px-3 py-1 bg-emerald-100 text-[10px] font-mono font-bold text-emerald-900">
                        SECURE REMEDIATION
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-emerald-950 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeChallenge.debrief.secureSnippet}
                      </pre>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono">
                  Interact with the website to discover security vulnerabilities.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-mono">
              Findings remain saved in browser localStorage.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
