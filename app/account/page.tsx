"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Shield,
  Download,
  Key,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "security">("profile");
  const [user, setUser] = useState<any>({ name: "Alex Rivera", email: "alex@northstar.local", role: "user" });

  // A04 state
  const [backupExport, setBackupExport] = useState<any>(null);
  const [decodedInput, setDecodedInput] = useState<string>("");
  const [verifyFeedback, setVerifyFeedback] = useState<string>("");

  // A07 JWT state
  const [token, setToken] = useState<string>("");
  const [headerJson, setHeaderJson] = useState<string>('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payloadJson, setPayloadJson] = useState<string>('{\n  "sub": "alex@northstar.local",\n  "name": "Alex Rivera",\n  "role": "user"\n}');
  const [signatureStr, setSignatureStr] = useState<string>("");
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [adminResult, setAdminResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("northstar_session_user");
      if (saved) setUser(JSON.parse(saved));
      const savedToken = localStorage.getItem("northstar_jwt_token");
      if (savedToken) {
        setToken(savedToken);
        parseJwt(savedToken);
      }
    } catch (_e) {}
  }, []);

  const handleSignInAsStaff = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "alex@northstar.local", password: "password123!" }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("northstar_jwt_token", data.token);
        localStorage.setItem("northstar_session_user", JSON.stringify(data.user));
        parseJwt(data.token);
      }
    } catch (_e) {}
  };

  const parseJwt = (jwt: string) => {
    const parts = jwt.split(".");
    if (parts.length === 3) {
      try {
        const h = JSON.parse(atob(parts[0]));
        const p = JSON.parse(atob(parts[1]));
        setHeaderJson(JSON.stringify(h, null, 2));
        setPayloadJson(JSON.stringify(p, null, 2));
        setSignatureStr(parts[2]);
      } catch (_e) {}
    }
  };

  const handlePayloadChange = (newText: string) => {
    setPayloadJson(newText);
    try {
      const parsed = JSON.parse(newText);
      setIsTampered(true);
      const hB64 = btoa(headerJson).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const pB64 = btoa(JSON.stringify(parsed)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const tampered = `${hB64}.${pB64}.${signatureStr}`;
      setToken(tampered);
    } catch (_e) {}
  };

  const handleTamperAdmin = () => {
    try {
      const parsed = JSON.parse(payloadJson);
      parsed.role = "admin";
      handlePayloadChange(JSON.stringify(parsed, null, 2));
    } catch (_e) {}
  };

  const handleTestAdminAccess = async () => {
    setIsLoading(true);
    setAdminResult(null);
    try {
      const res = await fetch("/api/admin/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      setAdminResult(data);
      if (data.breachTriggered) {
        // Unlock A07 finding
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A07" } })
        );
      }
    } catch (_e) {
      setAdminResult({ error: "Request failed." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/account/export?user=alex");
      const data = await res.json();
      setBackupExport(data);
    } catch (_e) {}
  };

  const handleVerifyDecoded = async () => {
    try {
      const res = await fetch("/api/account/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decodedPassword: decodedInput }),
      });
      const data = await res.json();
      setVerifyFeedback(data.message);
      if (data.breachTriggered) {
        // Unlock A04 finding
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A04" } })
        );
      }
    } catch (_e) {
      setVerifyFeedback("Verification failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("northstar_session_user");
    localStorage.removeItem("northstar_jwt_token");
    router.push("/login");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-8">
      {/* Account Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
            {user.name?.[0] || "A"}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500">
              {user.email} · Standard Account
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 text-xs font-medium gap-6">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "profile"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Profile &amp; Orders
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "privacy"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Data &amp; Privacy
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "security"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Security &amp; Session
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="border border-slate-200/80 rounded-xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <span className="text-slate-400 block">Account Identifier</span>
              <span className="font-mono text-slate-800">usr-101</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <span className="text-slate-400 block">Permission Level</span>
              <span className="text-slate-800 font-medium">Standard User</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <div>
              <span className="font-semibold text-slate-900 block">Order History</span>
              <p className="text-slate-500">Track shipments and view past receipts.</p>
            </div>
            <Link
              href="/orders"
              className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              View Orders
            </Link>
          </div>
        </div>
      )}

      {/* Privacy Tab (A04) */}
      {activeTab === "privacy" && (
        <div className="border border-slate-200/80 rounded-xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-slate-900">Download Account Data</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Download a complete JSON export of your personal profile and account credentials.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Account Export</span>
          </button>

          {backupExport && (
            <div className="p-5 bg-slate-50 rounded-lg border border-slate-200/80 text-xs font-mono space-y-4">
              <pre className="whitespace-pre-wrap text-slate-700">{JSON.stringify(backupExport, null, 2)}</pre>

              <div className="pt-3 border-t border-slate-200/80 space-y-2 font-sans">
                <span className="text-slate-700 font-medium block">
                  Verify credential:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={decodedInput}
                    onChange={(e) => setDecodedInput(e.target.value)}
                    placeholder="Enter plaintext credential..."
                    className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md font-mono text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                  <button
                    onClick={handleVerifyDecoded}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800"
                  >
                    Confirm
                  </button>
                </div>
                {verifyFeedback && (
                  <p className="text-[11px] text-slate-600 mt-1">
                    {verifyFeedback}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security & JWT Session Tab (A07) */}
      {activeTab === "security" && (
        <div className="border border-slate-200/80 rounded-xl bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-slate-900">Current Session Details</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              Your active session token governs API permissions. Developers and auditors can inspect
              token headers, claims, and signature validity below.
            </p>
          </div>

          {!token && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">No active session token found in browser storage.</span>
              <button
                onClick={handleSignInAsStaff}
                className="px-3.5 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign In as Staff (Alex Rivera)
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Header */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-2">
              <span className="font-semibold text-slate-700 text-xs block">Header</span>
              <pre className="font-mono text-slate-600 whitespace-pre-wrap text-[11px]">{headerJson}</pre>
            </div>

            {/* Payload */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2.5">
              <span className="font-semibold text-slate-900 text-xs block">Payload (Claims)</span>
              <textarea
                value={payloadJson}
                onChange={(e) => handlePayloadChange(e.target.value)}
                rows={4}
                className="w-full p-2 border border-slate-200 rounded-md text-[11px] font-mono bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
              <button
                onClick={handleTamperAdmin}
                className="text-[11px] px-2.5 py-1 bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors"
              >
                Change role to &quot;admin&quot;
              </button>
            </div>

            {/* Signature */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-xs flex flex-col justify-between">
              <div>
                <span className="font-semibold text-slate-700 text-xs block mb-2">
                  Signature Integrity
                </span>
                {!isTampered ? (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md text-xs font-medium flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Signature: Valid ✓</span>
                  </div>
                ) : (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-900 rounded-md text-xs font-medium flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Signature: Invalid ✗</span>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate mt-3">
                {signatureStr || "..."}
              </div>
            </div>
          </div>

          {/* Test Admin Route Button */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-400 font-mono">
              Target: /api/admin/portal
            </span>
            <button
              onClick={handleTestAdminAccess}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50 shadow-sm"
            >
              {isLoading ? "Validating..." : "Test Administrator Access"}
            </button>
          </div>

          {adminResult && (
            <div
              className={`p-4 rounded-lg border text-xs leading-relaxed ${
                adminResult.breachTriggered
                  ? "bg-amber-50/80 border-amber-200 text-amber-950"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <div className="font-semibold">
                {adminResult.breachTriggered ? "Admin Access Granted" : "Access Denied"}
              </div>
              <p className="text-xs mt-1 text-slate-700">
                {adminResult.message || adminResult.error}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
