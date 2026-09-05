"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, ShieldX, Terminal, ArrowRight, RefreshCw, Key, AlertTriangle } from "lucide-react";

interface TokenInspectorProps {
  onSolved: (flag: string) => void;
  isSolved: boolean;
}

export default function TokenInspector({ onSolved, isSolved }: TokenInspectorProps) {
  const [token, setToken] = useState<string>("");
  const [headerJson, setHeaderJson] = useState<string>('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payloadJson, setPayloadJson] = useState<string>(
    '{\n  "sub": "alex@northstar.local",\n  "name": "Alex Rivera",\n  "role": "user"\n}'
  );
  const [signatureStr, setSignatureStr] = useState<string>("");
  const [isTampered, setIsTampered] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate initial token on mount
  useEffect(() => {
    fetchInitialToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInitialToken = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "alex@northstar.local", password: "training123" }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        parseAndDisplayToken(data.token);
        setIsTampered(false);
      }
    } catch (_err) {
      // fallback if offline
    } finally {
      setIsLoading(false);
    }
  };

  const parseAndDisplayToken = (jwt: string) => {
    const parts = jwt.split(".");
    if (parts.length === 3) {
      try {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        setHeaderJson(JSON.stringify(header, null, 2));
        setPayloadJson(JSON.stringify(payload, null, 2));
        setSignatureStr(parts[2]);
      } catch (_e) {}
    }
  };

  const handlePayloadChange = (newText: string) => {
    setPayloadJson(newText);
    try {
      const parsed = JSON.parse(newText);
      setIsTampered(true);

      // Reconstruct token with tampered payload and original signature
      const headerPart = btoa(headerJson).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const payloadPart = btoa(JSON.stringify(parsed)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      const reconstructedJwt = `${headerPart}.${payloadPart}.${signatureStr}`;
      setToken(reconstructedJwt);
    } catch (_e) {
      // in progress
    }
  };

  const handleEscalateToAdmin = () => {
    try {
      const parsed = JSON.parse(payloadJson);
      parsed.role = "admin";
      handlePayloadChange(JSON.stringify(parsed, null, 2));
    } catch (_e) {}
  };

  const handleSubmitToPortal = async () => {
    setIsLoading(true);
    setApiResponse(null);
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
      setApiResponse(data);
      if (data.breachTriggered && data.flag) {
        onSolved(data.flag);
      }
    } catch (_err) {
      setApiResponse({ error: "Network error submitting token." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Identity Context */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-xs font-mono">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-slate-600" />
          <span>Authentication Status: <strong>alex@northstar.local</strong> (Standard User Claim)</span>
        </div>
        <button
          onClick={fetchInitialToken}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Reset Fresh Valid Token</span>
        </button>
      </div>

      {/* 3-Section Token Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Header */}
        <div className="border border-red-200 bg-red-50/40 rounded p-3 text-xs font-mono">
          <div className="text-[11px] font-bold text-red-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>1. Header (Algorithm)</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">Read-only</span>
          </div>
          <pre className="text-red-950 whitespace-pre-wrap">{headerJson}</pre>
        </div>

        {/* Payload (Editable) */}
        <div className="border border-purple-300 bg-purple-50/40 rounded p-3 text-xs font-mono relative">
          <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>2. Payload (Claims)</span>
            <span className="text-[10px] px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded font-semibold">
              Editable
            </span>
          </div>
          <textarea
            value={payloadJson}
            onChange={(e) => handlePayloadChange(e.target.value)}
            rows={5}
            className="w-full bg-white border border-purple-200 rounded p-1.5 text-xs font-mono text-purple-950 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={handleEscalateToAdmin}
            className="mt-2 text-[11px] px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Tamper: Set role to &quot;admin&quot;
          </button>
        </div>

        {/* Signature & Verification State */}
        <div className="border border-blue-200 bg-blue-50/40 rounded p-3 text-xs font-mono flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1.5">
              3. Signature Verification
            </div>
            <div className="truncate text-slate-500 text-[11px] mb-2 font-mono">
              HMACSHA256(base64(hdr) + &quot;.&quot; + base64(pay), secret)
            </div>

            {/* Signature Status Badge */}
            {!isTampered ? (
              <div className="flex items-center gap-1.5 p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">Signature: VALID ✓</div>
                  <div className="text-[10px] text-emerald-800 leading-tight">
                    Issued by Northstar Auth Server with server secret.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 p-2 bg-red-100 border border-red-300 text-red-900 rounded">
                <ShieldX className="w-4 h-4 text-red-700 flex-shrink-0" />
                <div>
                  <div className="font-bold text-[11px]">Signature: INVALID ✗</div>
                  <div className="text-[10px] text-red-800 leading-tight">
                    Payload altered! Cryptographic HMAC mismatch.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3">
            <span className="text-[10px] text-slate-600 block">Current Signature:</span>
            <div className="truncate font-mono text-[10px] text-slate-700 bg-white p-1 rounded border border-slate-200">
              {signatureStr || "..."}
            </div>
          </div>
        </div>
      </div>

      {/* Raw Assembled Token */}
      <div className="p-2.5 bg-slate-900 text-slate-300 rounded font-mono text-xs overflow-x-auto">
        <span className="text-[10px] uppercase text-slate-500 block mb-1">
          Assembled HTTP Bearer Token:
        </span>
        <div className="truncate text-slate-100">{token || "Generating..."}</div>
      </div>

      {/* Submit Action */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="text-xs text-slate-600">
          Target Route: <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">POST /api/admin/portal</code>
        </div>
        <button
          onClick={handleSubmitToPortal}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50"
        >
          <span>Submit Token to Admin Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Explicit Pedagogical Contradiction Alert */}
      {apiResponse && (
        <div
          className={`p-3.5 rounded border text-xs font-mono space-y-2 ${
            apiResponse.breachTriggered
              ? "bg-amber-50 border-amber-300 text-amber-950"
              : "bg-slate-100 border-slate-200 text-slate-800"
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            <Terminal className="w-4 h-4" />
            <span>Response from /api/admin/portal:</span>
          </div>
          <pre className="whitespace-pre-wrap">{JSON.stringify(apiResponse, null, 2)}</pre>

          {apiResponse.breachTriggered && isTampered && (
            <div className="mt-2.5 p-3 bg-amber-100 border border-amber-300 rounded text-[11px] leading-relaxed text-amber-950 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>THE CORE LESSON:</strong> The signature is invalid. The vulnerable server accepts it anyway because it decodes the JWT (<code>decodeJwt</code>) instead of cryptographically verifying it (<code>jwtVerify</code>). Modifying the payload invalidated the signature, but without server-side verification, the application blindly authorized the tampered administrator claim.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
