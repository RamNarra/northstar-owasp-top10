"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [failedCount, setFailedCount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("northstar_session_user", JSON.stringify(data.user));
        localStorage.setItem("northstar_jwt_token", data.token);
        router.push("/account");
      } else {
        const nextFailed = failedCount + 1;
        setFailedCount(nextFailed);
        setError(data.error || "Authentication failed. Please verify credentials.");

        // If 3+ failed logins against admin account occur, dispatch A09 finding
        if (nextFailed >= 3 && email.toLowerCase().includes("admin")) {
          window.dispatchEvent(
            new CustomEvent("northstar_finding", { detail: { id: "A09" } })
          );
        }
      }
    } catch (_err) {
      setError("Network error connecting to Northstar Auth Gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white border border-slate-200/80 rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center mx-auto mb-3">
            <Lock className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Sign in to Northstar
          </h1>
          <p className="text-xs text-slate-500">
            Access your orders, support tickets, and hardware licenses.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50/80 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Work email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full px-3 py-2 pl-9 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-medium text-slate-700">Password</label>
              <span className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer">
                Forgot?
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full px-3 py-2 pl-9 border border-slate-200 rounded-md text-xs font-mono focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-900"
              />
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <span>{isLoading ? "Signing in..." : "Continue"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
