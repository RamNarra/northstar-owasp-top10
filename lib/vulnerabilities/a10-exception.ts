/**
 * A10: Mishandling of Exceptional Conditions
 * Educational Vulnerability:
 * An invalid negative quantity causes an arithmetic underflow exception.
 * The broad catch handler fails open, approving the transaction as PAID.
 */
export function vulnerableProcessCheckout(quantity: number): {
  success: boolean;
  status: "PAID" | "REJECTED";
  orderId: string;
  chargedAmount: number;
  message: string;
  failOpenOccurred: boolean;
} {
  let status: "PAID" | "REJECTED" = "REJECTED";
  let failOpenOccurred = false;

  try {
    if (quantity <= 0) {
      throw new Error(`InvalidOrderQuantityException: Quantity ${quantity} violates inventory constraints.`);
    }
    status = "PAID";
  } catch (_err) {
    // FATAL VULNERABILITY: Catch block mistakenly marks status as PAID instead of aborting!
    status = "PAID";
    failOpenOccurred = true;
  }

  return {
    success: true,
    status,
    orderId: "ORD-FAILOPEN-7749",
    chargedAmount: quantity <= 0 ? 0 : quantity * 9999,
    message: failOpenOccurred
      ? "EXCEPTION_CAUGHT: Server caught InvalidOrderQuantityException but exception handler failed open and completed order as PAID!"
      : "Order processed successfully.",
    failOpenOccurred,
  };
}
