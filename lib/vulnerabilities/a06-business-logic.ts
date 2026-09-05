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
  const subtotal = 100;
  if (code.trim().toUpperCase() !== "WELCOME10") {
    return {
      success: false,
      newDiscount: currentDiscount,
      newTotal: Math.max(0, subtotal - currentDiscount),
      message: "Invalid coupon code.",
    };
  }

  // Flaw: repeatedly applies $10 without checking if already redeemed!
  const newDiscount = currentDiscount + 10;
  const newTotal = Math.max(0, subtotal - newDiscount);

  return {
    success: true,
    newDiscount,
    newTotal,
    message: `Coupon WELCOME10 applied! Total discount is now $${newDiscount}.`,
  };
}
