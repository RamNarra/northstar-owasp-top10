/**
 * A06: Insecure Design (Business Logic Flaw - Coupon Multi-Use)
 * Educational Vulnerability:
 * The checkout coupon handler deducts $10 for WELCOME10, but fails to check
 * whether the coupon has already been redeemed on the active cart.
 */
export interface CartState {
  items: { id: string; name: string; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
  appliedCount: number;
}

export function vulnerableApplyCoupon(currentDiscount: number, code: string): {
  success: boolean;
  newDiscount: number;
  newTotal: number;
  message: string;
} {
  const isLargeCurrency = currentDiscount >= 100;
  const subtotal = isLargeCurrency ? 9999 : 100;
  const step = isLargeCurrency ? 1000 : 10;

  if (code.trim().toUpperCase() !== "WELCOME10") {
    return {
      success: false,
      newDiscount: currentDiscount,
      newTotal: Math.max(0, subtotal - currentDiscount),
      message: "Invalid coupon code.",
    };
  }

  // Flaw: repeatedly applies discount without checking if already redeemed!
  const newDiscount = currentDiscount + step;
  const newTotal = Math.max(0, subtotal - newDiscount);

  const formattedDiscount = isLargeCurrency ? `₹${newDiscount.toLocaleString("en-IN")}` : `₹${newDiscount * 100}`;
  return {
    success: true,
    newDiscount,
    newTotal,
    message: `Coupon WELCOME10 applied! Total promotional savings is now ${formattedDiscount}.`,
  };
}
