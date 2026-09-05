import { CUSTOMER_DIRECTORY, CustomerDirectoryRecord } from "../fake-db";

/**
 * A05: Injection (SQL Injection)
 * Educational Vulnerability:
 * Unescaped user input is parsed dynamically. If a classic SQL injection payload
 * such as ' OR '1'='1 or ' OR 1=1 -- is supplied, it breaks out of the filter
 * and evaluates to true for ALL records, including confidential internal treasury accounts.
 */
export function vulnerableCustomerSearch(query: string): {
  records: CustomerDirectoryRecord[];
  injected: boolean;
  generatedQuery: string;
} {
  const rawInput = query.trim();
  const simulatedSql = `SELECT id, name, organization, email, tier, notes FROM customers WHERE name LIKE '%${rawInput}%' AND is_internal = 0;`;

  // Detect classic SQL injection tautology payloads
  const sqliPatterns = [
    /'\s*or\s*'1'\s*=\s*'1/i,
    /'\s*or\s*1\s*=\s*1/i,
    /'\s*or\s*'a'\s*=\s*'a/i,
    /'\s*--/i,
    /'\s*or\s*""=""/i,
  ];

  const hasSqli = sqliPatterns.some((pattern) => pattern.test(rawInput));

  if (hasSqli) {
    // Injected: returns ALL records, including internal confidential ID 999
    return {
      records: CUSTOMER_DIRECTORY,
      injected: true,
      generatedQuery: simulatedSql,
    };
  }

  // Normal query: matches substring only on public non-internal records
  const filtered = CUSTOMER_DIRECTORY.filter(
    (cust) => !cust.isInternal && cust.name.toLowerCase().includes(rawInput.toLowerCase())
  );

  return {
    records: filtered,
    injected: false,
    generatedQuery: simulatedSql,
  };
}
