"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Package, ArrowLeft, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params.id as string) || "1001";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [idorBreach, setIdorBreach] = useState<boolean>(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();

        if (res.ok && data.order) {
          setOrder(data.order);
          if (data.breachTriggered) {
            setIdorBreach(true);
            // Unlock A01 finding
            window.dispatchEvent(
              new CustomEvent("northstar_finding", { detail: { id: "A01" } })
            );
          }
        } else {
          setError(data.error || "Order not found");
        }
      } catch (_e) {
        setError("Error retrieving order.");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <Link
        href="/orders"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Order History</span>
      </Link>

      {/* Subtle IDOR banner if Alex accessed Bob's order */}
      {idorBreach && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1 text-amber-950">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Cross-Tenant Authorization Anomaly Detected</span>
          </div>
          <p className="leading-relaxed">
            You accessed <strong>Order #{orderId}</strong> belonging to <strong>{order?.customerEmail}</strong> without ownership verification.
          </p>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500 font-mono">
          Loading order details...
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      ) : (
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <div className="text-[11px] text-slate-500 font-mono uppercase">
                Invoice &amp; Packing Slip
              </div>
              <h1 className="text-lg font-bold text-slate-900 font-mono">
                Order #{order.id}
              </h1>
            </div>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-800 rounded text-xs font-mono font-semibold">
              {order.status}
            </span>
          </div>

          <div className="p-6 space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-slate-500 block mb-0.5">Purchaser Account:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {order.customerEmail}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Account ID:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {order.userId}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-slate-800 uppercase font-mono text-[11px] block">
                Line Items:
              </span>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900">{order.item}</div>
                  <div className="text-slate-500 text-[11px]">Quantity: {order.quantity}</div>
                </div>
                <div className="font-mono font-bold text-slate-900">
                  ${order.totalUsd?.toLocaleString()}.00 USD
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-500 block mb-0.5">Destination Shipping Address:</span>
              <p className="text-slate-800 font-mono">{order.shippingAddress}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
