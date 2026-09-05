import { SYNTHETIC_ORDERS, CustomerOrder } from "../fake-db";

/**
 * A01: Broken Access Control (Insecure Direct Object Reference - IDOR)
 * Educational Vulnerability:
 * The endpoint takes a client-supplied order ID parameter and returns
 * the record directly without verifying whether the requesting user owns it.
 */
export function vulnerableGetOrder(orderId: string): { order: CustomerOrder | null; isVulnerableExposure: boolean } {
  const order = SYNTHETIC_ORDERS[orderId] || null;
  // If order 1002 (belonging to Bob) is fetched, an IDOR breach occurred
  const isVulnerableExposure = orderId === "1002" && order !== null;
  return { order, isVulnerableExposure };
}
