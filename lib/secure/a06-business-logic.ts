/**
 * A06 Secure Remediation:
 * Define explicit state machine invariants. Track applied discounts and limit
 * to 1 coupon per cart.
 */
export function secureApplyCoupon(
  appliedCoupons: string[],
  subtotal: number,
  code: string
): { success: boolean; discount: number; total: number; error?: string } {
  if (appliedCoupons.includes(code)) {
    return {
      success: false,
      discount: 10,
      total: Math.max(0, subtotal - 10),
      error: "Coupon already applied to this order.",
    };
  }

  if (appliedCoupons.length >= 1) {
    return {
      success: false,
      discount: 10,
      total: Math.max(0, subtotal - 10),
      error: "Maximum of 1 promotional code allowed per order.",
    };
  }

  return { success: true, discount: 10, total: subtotal - 10 };
}
