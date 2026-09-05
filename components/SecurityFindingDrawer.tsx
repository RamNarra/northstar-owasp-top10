"use client";

import { useState, useEffect } from "react";
import { Shield, X, Code2, AlertCircle } from "lucide-react";
import { CHALLENGES, Challenge } from "@/lib/challenges";

export default function SecurityFindingDrawer() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      setIsOpen(true);
    };

    window.addEventListener("northstar_finding", handleFinding);
    return () => window.removeEventListener("northstar_finding", handleFinding);
  }, []);

  const activeChallenge = CHALLENGES.find((c) => c.id === activeChallengeId) || null;

  // Before any vulnerability is discovered, show absolutely nothing
  if (unlockedIds.length === 0 && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Subtle Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            if (!activeChallengeId && unlockedIds.length > 0) {
              setActiveChallengeId(unlockedIds[unlockedIds.length - 1]);
            }
            setIsOpen(true);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-slate-100 rounded-full text-[11px] shadow-sm backdrop-blur-sm transition-all border border-slate-700/70 font-medium"
        >
          <span className="text-slate-400 font-serif">ⓘ</span>
          <span>Security note</span>
        </button>
      )}

      {/* Slide-out Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-slate-900 flex items-center justify-center text-white">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 leading-none">
                    Security Note
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Anomalous application behavior detected during interaction
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Findings Selector Tabs */}
            {unlockedIds.length > 1 && (
              <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50 text-xs divide-x divide-slate-200">
                {unlockedIds.map((id) => {
                  const isSelected = activeChallengeId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveChallengeId(id)}
                      className={`px-3.5 py-2 flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-white font-semibold text-slate-900 border-b-2 border-slate-900"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {id}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Finding Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-relaxed">
              {activeChallenge ? (
                <>
                  <div className="space-y-1.5 border-b border-slate-100 pb-4">
                    <div className="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[11px]">
                      {activeChallenge.owaspId} · {activeChallenge.owaspTitle}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 pt-1">
                      {activeChallenge.storyTitle}
                    </h4>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-900 text-xs block">
                      What happened
                    </span>
                    <p className="text-slate-600">
                      {activeChallenge.debrief.whatHappened}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-semibold text-slate-900 text-xs block">
                      Why it matters
                    </span>
                    <p className="text-slate-600">
                      {activeChallenge.debrief.whyItWorked}
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-md text-slate-700 space-y-1">
                    <span className="font-semibold text-slate-900 text-[11px] block">
                      OWASP Top 10:2025 Context
                    </span>
                    <p className="text-[11px] text-slate-600">
                      {activeChallenge.debrief.owasp2025Note}
                    </p>
                  </div>

                  {/* Code Comparison */}
                  <div className="space-y-2.5 pt-2">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                      <Code2 className="w-4 h-4 text-slate-500" />
                      <span>Code Comparison &amp; Remediation</span>
                    </div>

                    <div className="border border-red-200 rounded-md bg-red-50/20 overflow-hidden">
                      <div className="px-3 py-1 bg-red-50 border-b border-red-100 text-[10px] font-mono font-semibold text-red-800">
                        Vulnerable Implementation
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-red-950 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeChallenge.debrief.vulnerableSnippet}
                      </pre>
                    </div>

                    <div className="border border-emerald-200 rounded-md bg-emerald-50/20 overflow-hidden">
                      <div className="px-3 py-1 bg-emerald-50 border-b border-emerald-100 text-[10px] font-mono font-semibold text-emerald-800">
                        Secure Fix
                      </div>
                      <pre className="p-3 text-[11px] font-mono text-emerald-950 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                        {activeChallenge.debrief.secureSnippet}
                      </pre>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center text-[11px] text-slate-400">
              Findings remain stored locally in your browser.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
