import { SYNTHETIC_ORDERS, CustomerOrder } from "../fake-db";

/**
 * A01 Secure Remediation:
 * Enforce ownership checks. Compare the requested resource's owner with
 * the authenticated session's userId before returning data.
 */
export function secureGetOrder(orderId: string, authenticatedUserId: string): {
  authorized: boolean;
  order: CustomerOrder | null;
  error?: string;
} {
  const order = SYNTHETIC_ORDERS[orderId];
  if (!order) {
    return { authorized: false, order: null, error: "Order not found" };
  }

  // Enforce object-level access control
  if (order.userId !== authenticatedUserId) {
    return {
      authorized: false,
      order: null,
      error: "403 Forbidden: You do not have permission to view this order.",
    };
  }

  return { authorized: true, order };
}
