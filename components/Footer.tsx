"use client";

import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function Footer() {
  const handleResetSession = () => {
    if (confirm("Reset local browsing session and findings?")) {
      localStorage.removeItem("northstar_unlocked_findings");
      localStorage.removeItem("northstar_session_user");
      localStorage.removeItem("northstar_jwt_token");
      window.location.href = "/";
    }
  };

  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-xs">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Products</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/products" className="hover:text-slate-900">Telemetry Hardware</Link></li>
              <li><Link href="/products" className="hover:text-slate-900">Quantum Gateway</Link></li>
              <li><Link href="/products" className="hover:text-slate-900">Perimeter Enforcer</Link></li>
              <li><Link href="/products" className="hover:text-slate-900">Monitoring Suites</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Account &amp; Orders</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/account" className="hover:text-slate-900">Customer Account</Link></li>
              <li><Link href="/orders" className="hover:text-slate-900">Order Tracking</Link></li>
              <li><Link href="/account" className="hover:text-slate-900">Privacy &amp; Data</Link></li>
              <li><Link href="/account" className="hover:text-slate-900">Security Credentials</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Company</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/about" className="hover:text-slate-900">About Northstar</Link></li>
              <li><Link href="/directory" className="hover:text-slate-900">Directory</Link></li>
              <li><Link href="/about" className="hover:text-slate-900">System Architecture</Link></li>
              <li><Link href="/robots.txt" className="hover:text-slate-900">Crawler Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">System Controls</h4>
            <p className="text-slate-500 mb-3 leading-relaxed">
              Northstar Enterprise Portal v2.4.1. Fictional commercial application.
            </p>
            <button
              onClick={handleResetSession}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-mono text-[11px] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Local Session</span>
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
          <span>&copy; {new Date().getFullYear()} Northstar Systems Corp. All rights reserved.</span>
          <span>Security Research &amp; Evaluation Target</span>
        </div>
      </div>
    </footer>
  );
}
