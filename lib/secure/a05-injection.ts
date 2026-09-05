import { CUSTOMER_DIRECTORY, CustomerDirectoryRecord } from "../fake-db";

/**
 * A05 Secure Remediation:
 * Parameterized queries / prepared statements treat input as strict data,
 * preventing user strings from modifying SQL grammar.
 */
export function secureCustomerSearch(query: string): CustomerDirectoryRecord[] {
  const sanitized = query.trim().toLowerCase();
  return CUSTOMER_DIRECTORY.filter(
    (cust) => !cust.isInternal && cust.name.toLowerCase().includes(sanitized)
  );
}
