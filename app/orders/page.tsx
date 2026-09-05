"use client";

import Link from "next/link";
import { Package, ArrowRight, Clock, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-950">
            Order History
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your recent infrastructure shipments and invoices.
          </p>
        </div>
      </div>

      <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900 font-mono">Order #1001</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">Placed on Sep 4, 2026</span>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium text-[11px] flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Delivered</span>
          </span>
        </div>

        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-slate-900">
                Cloud Telemetry Starter Pack
              </h3>
              <p className="text-xs text-slate-500">
                Quantity: 1 · Shipping to 404 Northstar Way, Suite 100
              </p>
              <div className="text-xs font-mono font-bold text-slate-900 pt-0.5">
                $120.00 USD
              </div>
            </div>
          </div>

          <Link
            href="/orders/1001"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-medium rounded transition-colors"
          >
            <span>View Invoice &amp; Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
