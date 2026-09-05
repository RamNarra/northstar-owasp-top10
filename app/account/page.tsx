"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Shield,
  Download,
  Key,
  Package,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Lock,
  ArrowRight,
  ShieldCheck,
  ShieldX,
  Terminal,
} from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "privacy" | "security">("overview");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    try {
      const saved = localStorage.getItem("northstar_session_user");
      if (saved) setUser(JSON.parse(saved));
      const savedToken = localStorage.getItem("northstar_jwt_token");
      if (savedToken) {
        setToken(savedToken);
        parseJwt(savedToken);
      } else {
        fetchDefaultToken();
      }
    } catch (_e) {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDefaultToken = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "alex@northstar.local", password: "training123" }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        localStorage.setItem("northstar_jwt_token", data.token);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Account Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
            {user.name?.[0] || "A"}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              {user.email} · Tier: Standard Operator
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-medium gap-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Overview &amp; Profile
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "privacy"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Privacy &amp; Data Export
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === "security"
              ? "border-slate-900 text-slate-900 font-semibold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Security &amp; Session Tokens
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="border border-slate-200 rounded-lg bg-white p-6 space-y-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded border border-slate-100 space-y-1">
              <span className="text-slate-500 block">User Identifier</span>
              <span className="font-mono font-semibold text-slate-900">usr-101</span>
            </div>
            <div className="p-4 bg-slate-50 rounded border border-slate-100 space-y-1">
              <span className="text-slate-500 block">Role Assignment</span>
              <span className="font-mono font-semibold text-slate-900">Standard User (user)</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900">Order Management</span>
              <p className="text-slate-500">Track current hardware shipments and view past receipts.</p>
            </div>
            <Link
              href="/orders"
              className="px-4 py-2 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
            >
              View Orders
            </Link>
          </div>
        </div>
      )}

      {/* Privacy Tab (A04) */}
      {activeTab === "privacy" && (
        <div className="border border-slate-200 rounded-lg bg-white p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Download Account Data Backup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              In compliance with enterprise portability policies, you can export a complete JSON
              backup archive of your profile and encrypted credentials.
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] font-mono text-slate-600">
            <strong>LAB FIXTURE NOTE:</strong> Backups in this environment contain synthetic training data only.
          </div>

          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Backup Archive</span>
          </button>

          {backupExport && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs font-mono space-y-4">
              <pre className="whitespace-pre-wrap">{JSON.stringify(backupExport, null, 2)}</pre>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-slate-700 font-sans font-semibold block">
                  Verify Decoded Plaintext Credential:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={decodedInput}
                    onChange={(e) => setDecodedInput(e.target.value)}
                    placeholder="Enter decoded password..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono text-xs"
                  />
                  <button
                    onClick={handleVerifyDecoded}
                    className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800"
                  >
                    Submit
                  </button>
                </div>
                {verifyFeedback && (
                  <p className="text-[11px] text-slate-700 font-sans mt-1">
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
        <div className="border border-slate-200 rounded-lg bg-white p-6 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900">Active Authentication Session</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your session is authenticated via signed JSON Web Tokens (JWT). Developers can inspect
              token claims and signature integrity below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Header */}
            <div className="p-3 bg-red-50/40 border border-red-200 rounded text-xs font-mono space-y-1">
              <span className="font-bold text-red-900 text-[11px] block">1. Header (Algorithm)</span>
              <pre className="text-red-950 whitespace-pre-wrap text-[11px]">{headerJson}</pre>
            </div>

            {/* Payload */}
            <div className="p-3 bg-purple-50/40 border border-purple-300 rounded text-xs font-mono space-y-2">
              <span className="font-bold text-purple-900 text-[11px] block">2. Payload (Claims)</span>
              <textarea
                value={payloadJson}
                onChange={(e) => handlePayloadChange(e.target.value)}
                rows={4}
                className="w-full p-1.5 border border-purple-200 rounded text-[11px] font-mono bg-white text-purple-950"
              />
              <button
                onClick={handleTamperAdmin}
                className="text-[10px] px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Tamper: Set role to &quot;admin&quot;
              </button>
            </div>

            {/* Signature */}
            <div className="p-3 bg-blue-50/40 border border-blue-200 rounded text-xs font-mono flex flex-col justify-between">
              <div>
                <span className="font-bold text-blue-900 text-[11px] block mb-1">
                  3. Signature Integrity
                </span>
                {!isTampered ? (
                  <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-[11px] font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Signature: VALID ✓</span>
                  </div>
                ) : (
                  <div className="p-2 bg-red-100 border border-red-300 text-red-900 rounded text-[11px] font-semibold flex items-center gap-1.5">
                    <ShieldX className="w-4 h-4 text-red-700" />
                    <span>Signature: INVALID ✗</span>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-slate-500 font-mono truncate mt-2">
                Sig: {signatureStr || "..."}
              </div>
            </div>
          </div>

          {/* Test Admin Route Button */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-mono">
              Target: <code>POST /api/admin/portal</code>
            </span>
            <button
              onClick={handleTestAdminAccess}
              disabled={isLoading}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? "Validating Session..." : "Test Administrator Access"}
            </button>
          </div>

          {adminResult && (
            <div
              className={`p-4 rounded border text-xs font-mono space-y-2 ${
                adminResult.breachTriggered
                  ? "bg-amber-50 border-amber-300 text-amber-950"
                  : "bg-slate-100 border-slate-200 text-slate-800"
              }`}
            >
              <div className="font-bold">
                {adminResult.breachTriggered ? "ADMIN_ACCESS_GRANTED" : "ACCESS_DENIED"}
              </div>
              <p className="font-sans text-[11px] leading-relaxed">
                {adminResult.message || adminResult.error}
              </p>
              {adminResult.breachTriggered && isTampered && (
                <div className="p-2.5 bg-amber-100 border border-amber-300 rounded text-[11px] text-amber-950 font-sans">
                  <strong>Pedagogical Insight:</strong> Notice how the signature badge above shows <strong>INVALID ✗</strong>, yet the backend authorized access anyway because it executed <code>decodeJwt()</code> without verifying cryptographic authenticity!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
