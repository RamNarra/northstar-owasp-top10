"use client";

import { useState, useEffect } from "react";
import { Search, Building2, ShieldAlert, ArrowRight } from "lucide-react";

export default function DirectoryPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.records) {
        setResults(data.records);
        if (data.breachTriggered) {
          // Unlock A05 finding
          window.dispatchEvent(
            new CustomEvent("northstar_finding", { detail: { id: "A05" } })
          );
        }
      }
    } catch (_e) {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-load default public list
  useEffect(() => {
    fetch("/api/search?q=")
      .then((r) => r.json())
      .then((d) => {
        if (d.records) setResults(d.records);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Partner &amp; Client Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Public business verification registry for authorized Northstar network operators.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company name (e.g. Apex, Beacon)..."
            className="w-full px-3.5 py-2.5 pl-10 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Results Table */}
      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs font-mono">
          <span className="text-slate-600">
            Records Found: <strong>{results.length}</strong>
          </span>
          <span className="text-slate-400">Registry Region: us-west-enterprise</span>
        </div>

        <div className="divide-y divide-slate-100">
          {results.map((record) => (
            <div
              key={record.id}
              className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors ${
                record.isInternal ? "bg-amber-50/70 border-l-4 border-l-amber-500" : ""
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">
                    {record.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700">
                    {record.tier}
                  </span>
                  {record.isInternal && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                      INTERNAL RESTRICTED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-mono">{record.email}</p>
                {record.notes && (
                  <p className="text-xs text-amber-900 font-mono pt-1">
                    {record.notes}
                  </p>
                )}
              </div>

              <div className="text-xs font-mono text-slate-400 flex-shrink-0">
                ID: #{record.id}
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No matching accounts found in the directory.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
