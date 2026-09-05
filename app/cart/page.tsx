"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag, Check, AlertCircle } from "lucide-react";
import { formatInr } from "@/lib/fake-db";

export default function CartPage() {
  const [quantity, setQuantity] = useState<number>(1);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [couponMsg, setCouponMsg] = useState<string>("");
  const [checkoutStatus, setCheckoutStatus] = useState<any>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const unitPrice = 9999;
  const subtotal = unitPrice * Math.max(0, quantity);
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;
    setIsApplying(true);
    setCouponMsg("");
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentDiscount: discount, code: promoCode.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.newDiscount);
        setCouponMsg(`Promotion applied. Total discount: ${formatInr(data.newDiscount)}`);
        if (data.breachTriggered) {
          // Trigger A06 quietly
          window.dispatchEvent(
            new CustomEvent("northstar_finding", { detail: { id: "A06" } })
          );
        }
      } else {
        setCouponMsg(data.message || "Invalid coupon code.");
      }
    } catch (_e) {
      setCouponMsg("Unable to process promotion.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutStatus(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      setCheckoutStatus(data);
      if (data.breachTriggered) {
        // Trigger A10 quietly
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A10" } })
        );
      }
    } catch (_e) {
      setCheckoutStatus({ error: "Checkout service currently unavailable." });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Shopping Cart
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review hardware line items and confirm enterprise purchase order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 border border-slate-200/80 rounded-xl bg-white p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex gap-4">
              <div className="relative w-16 h-16 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0">
                <Image
                  src="/images/products/cloud-telemetry.jpg"
                  alt="Cloud Telemetry Starter Pack"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm text-slate-900">
                  Cloud Telemetry Starter Pack
                </h3>
                <p className="text-xs text-slate-500">
                  Sku: NS-TEL-100 · 3 Years Northstar Care Warranty
                </p>
                <div className="text-xs font-semibold text-slate-900 pt-1 font-mono">
                  {formatInr(unitPrice)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Qty:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 px-2.5 py-1 border border-slate-200 rounded-md text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Promo code */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-medium text-slate-700 block">
              Promotion code
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. WELCOME10)"
                  className="w-full px-3 py-2 pl-8 border border-slate-200 rounded-md text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying || !promoCode}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50"
              >
                {isApplying ? "..." : "Apply"}
              </button>
            </div>

            {couponMsg && (
              <p className="text-xs text-slate-600 mt-1">
                {couponMsg}
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-slate-200/80 rounded-xl bg-white p-6 space-y-5 shadow-sm h-fit">
          <h3 className="font-semibold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="text-slate-900 font-mono">{formatInr(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount</span>
                <span className="font-mono">-{formatInr(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span className="text-emerald-600 font-medium">Free Express</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between font-semibold text-sm text-slate-900">
              <span>Total</span>
              <span className="font-mono text-base">{formatInr(total)}</span>
            </div>
            <div className="text-[10px] text-slate-400 text-right">Includes 18% GST</div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
          >
            <span>{isCheckingOut ? "Processing..." : "Authorize Purchase"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {checkoutStatus && (
            <div
              className={`p-3.5 rounded-lg border text-xs leading-relaxed ${
                checkoutStatus.status === "PAID"
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="font-semibold">
                Status: {checkoutStatus.status || "REJECTED"}
              </div>
              <div className="text-[11px] mt-0.5 text-slate-600">
                {checkoutStatus.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
