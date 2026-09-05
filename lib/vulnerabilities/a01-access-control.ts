import { SYNTHETIC_ORDERS, CustomerOrder } from "../fake-db";

/**
 * A01: Broken Access Control (Insecure Direct Object Reference - IDOR)
 * Educational Vulnerability:
 * The endpoint takes a client-supplied order ID parameter and returns
 * the record directly without verifying whether the requesting user owns it.
 */
export function vulnerableGetOrder(orderId: string, requestingUserId: string = "usr-101"): {
  order: CustomerOrder | null;
  isVulnerableExposure: boolean;
  requestingUserId: string;
} {
  const order = SYNTHETIC_ORDERS[orderId] || null;
  // IDOR: Order exists, but belongs to another user (Bob usr-102) rather than requesting user (Alex usr-101)
  const isVulnerableExposure = order !== null && order.userId !== requestingUserId;
  return { order, isVulnerableExposure, requestingUserId };
}
