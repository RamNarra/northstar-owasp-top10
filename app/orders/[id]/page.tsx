"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { formatInr } from "@/lib/fake-db";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = (params.id as string) || "1001";
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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
            // Unobtrusively unlock A01 Security Note
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

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">
          Loading order details...
        </div>
      ) : error ? (
        <div className="p-6 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg">
          {error}
        </div>
      ) : (
        <div className="border border-slate-200/80 rounded-xl bg-white overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
            <div>
              <div className="text-[11px] text-slate-400 font-mono uppercase">
                Invoice Reference
              </div>
              <h1 className="text-xl font-bold text-slate-900 font-mono">
                Order #{order.id}
              </h1>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">
              {order.status}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6 text-xs">
            <div className="grid grid-cols-2 gap-4 pb-5 border-b border-slate-100">
              <div>
                <span className="text-slate-400 block mb-1">Purchaser</span>
                <span className="font-semibold text-slate-900">
                  {order.customerEmail}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Account ID</span>
                <span className="font-mono text-slate-700">
                  {order.userId}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <span className="font-medium text-slate-700 text-xs block">
                Line Items
              </span>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-900 text-sm">{order.item}</div>
                  <div className="text-slate-500 text-xs">Quantity: {order.quantity}</div>
                </div>
                <div className="font-semibold text-slate-900 text-sm font-mono">
                  {formatInr(order.totalInr || order.totalUsd || 9999)}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block mb-1">Delivery Address</span>
              <p className="text-slate-700">{order.shippingAddress}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
