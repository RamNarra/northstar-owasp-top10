"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Tag, AlertCircle, CheckCircle, Trash2 } from "lucide-react";

export default function CartPage() {
  const [quantity, setQuantity] = useState<number>(1);
  const [promoCode, setPromoCode] = useState<string>("WELCOME10");
  const [discount, setDiscount] = useState<number>(0);
  const [couponFeedback, setCouponFeedback] = useState<string>("");
  const [checkoutStatus, setCheckoutStatus] = useState<any>(null);
  const [isApplying, setIsApplying] = useState<boolean>(false);
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);

  const unitPrice = 100;
  const subtotal = unitPrice * Math.max(0, quantity);
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    setIsApplying(true);
    setCouponFeedback("");
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentDiscount: discount, code: promoCode }),
      });
      const data = await res.json();
      if (data.success) {
        setDiscount(data.newDiscount);
        setCouponFeedback(data.message);
        if (data.breachTriggered) {
          // Unlock A06
          window.dispatchEvent(
            new CustomEvent("northstar_finding", { detail: { id: "A06" } })
          );
        }
      } else {
        setCouponFeedback(data.message || "Invalid promotional code.");
      }
    } catch (_e) {
      setCouponFeedback("Error processing coupon.");
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
        // Unlock A10
        window.dispatchEvent(
          new CustomEvent("northstar_finding", { detail: { id: "A10" } })
        );
      }
    } catch (_e) {
      setCheckoutStatus({ error: "Checkout connection error." });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Shopping Cart
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review line items and finalize your hardware procurement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 border border-slate-200 rounded-lg bg-white p-5 space-y-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-slate-900">
                Cloud Telemetry Starter Pack
              </h3>
              <p className="text-xs text-slate-500">
                Sku: NS-TEL-100 · 1 Year Enterprise Support Included
              </p>
              <div className="text-xs font-mono font-bold text-slate-900 pt-1">
                $100.00 USD
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Qty:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-mono text-center focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Promo code box */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Promotional Discount Code:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="PROMO CODE"
                  className="w-full px-3 py-2 pl-8 border border-slate-300 rounded text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying || !promoCode}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isApplying ? "Applying..." : "Apply"}
              </button>
            </div>

            {couponFeedback && (
              <p className="text-xs font-mono text-slate-600 mt-1">
                {couponFeedback}
              </p>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-slate-200 rounded-lg bg-white p-5 space-y-4 shadow-sm h-fit">
          <h3 className="font-bold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Item Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold font-mono">
                <span>Promotional Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping &amp; Handling</span>
              <span className="font-mono">FREE</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-950">
              <span>Total Due</span>
              <span className="font-mono">${total.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isCheckingOut ? "Processing..." : "Authorize Purchase"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {checkoutStatus && (
            <div
              className={`p-3 rounded border text-xs font-mono ${
                checkoutStatus.status === "PAID"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              <div className="font-bold">
                Order Status: {checkoutStatus.status || "REJECTED"}
              </div>
              <div className="text-[11px] mt-1 text-slate-600">
                {checkoutStatus.message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
