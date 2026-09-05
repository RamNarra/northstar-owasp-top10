"use client";

interface ProgressBarProps {
  solvedCount: number;
  totalCount: number;
}

export default function ProgressBar({ solvedCount, totalCount }: ProgressBarProps) {
  const percentage = Math.round((solvedCount / totalCount) * 100);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 tracking-wide uppercase font-mono">
            Investigation Progress
          </span>
          <span className="text-slate-500 font-mono">
            ({solvedCount} of {totalCount} chapters resolved)
          </span>
        </div>
        <span className="font-mono font-bold text-slate-900">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-900 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
