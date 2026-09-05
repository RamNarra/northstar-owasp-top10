/**
 * Synthetic Training Dataset for Northstar Security Incident
 * All accounts, orders, keys, and values are entirely fictional and safe for public deployment.
 */

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin" | "auditor";
  secretPin: string;
  accountBackupB64: string;
}

export interface CustomerOrder {
  id: string;
  userId: string;
  customerEmail: string;
  item: string;
  quantity: number;
  totalUsd: number;
  status: "CONFIRMED" | "PROCESSING" | "SHIPPED";
  shippingAddress: string;
}

export interface CustomerDirectoryRecord {
  id: number;
  name: string;
  organization: string;
  email: string;
  tier: string;
  isInternal: boolean;
  notes?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  event: string;
  status: "SUCCESS" | "FAILURE";
  actor: string;
  ip: string;
}

export const SYNTHETIC_USERS: Record<string, UserAccount> = {
  "alex@northstar.local": {
    id: "usr-101",
    email: "alex@northstar.local",
    name: "Alex Rivera",
    role: "user",
    secretPin: "8492",
    accountBackupB64: Buffer.from("password123!").toString("base64"), // cGFzc3dvcmQxMjMh
  },
  "bob@northstar.local": {
    id: "usr-102",
    email: "bob@northstar.local",
    name: "Bob Vance",
    role: "user",
    secretPin: "3141",
    accountBackupB64: Buffer.from("bob-secret-2025").toString("base64"),
  },
  "admin@northstar.local": {
    id: "usr-001",
    email: "admin@northstar.local",
    name: "Chief Security Officer",
    role: "admin",
    secretPin: "9900",
    accountBackupB64: Buffer.from("admin-quantum-core").toString("base64"),
  },
};

export const SYNTHETIC_ORDERS: Record<string, CustomerOrder> = {
  "1001": {
    id: "1001",
    userId: "usr-101",
    customerEmail: "alex@northstar.local",
    item: "Cloud Telemetry Starter Pack",
    quantity: 1,
    totalUsd: 120,
    status: "CONFIRMED",
    shippingAddress: "404 Northstar Way, Suite 100, San Francisco, CA",
  },
  "1002": {
    id: "1002",
    userId: "usr-102",
    customerEmail: "bob@northstar.local",
    item: "Quantum VPN Gateway Hardware Appliance",
    quantity: 2,
    totalUsd: 2400,
    status: "SHIPPED",
    shippingAddress: "77 Vance Refrigeration Blvd, Scranton, PA",
  },
  "1003": {
    id: "1003",
    userId: "usr-001",
    customerEmail: "admin@northstar.local",
    item: "Zero-Trust Perimeter Enforcer",
    quantity: 5,
    totalUsd: 15000,
    status: "PROCESSING",
    shippingAddress: "1 Executive Penthouse Suite, New York, NY",
  },
};

export const CUSTOMER_DIRECTORY: CustomerDirectoryRecord[] = [
  {
    id: 101,
    name: "Apex Logistics Corp",
    organization: "Apex Enterprise",
    email: "ops@apex-logistics.test",
    tier: "Standard",
    isInternal: false,
  },
  {
    id: 102,
    name: "Beacon Health Networks",
    organization: "Beacon Care",
    email: "compliance@beacon-health.test",
    tier: "Enterprise",
    isInternal: false,
  },
  {
    id: 103,
    name: "Crestview Financial",
    organization: "Crestview LLC",
    email: "security@crestview-fin.test",
    tier: "Enterprise",
    isInternal: false,
  },
  {
    id: 104,
    name: "Delta Robotics Labs",
    organization: "Delta Automation",
    email: "labs@delta-robotics.test",
    tier: "Standard",
    isInternal: false,
  },
  {
    id: 999,
    name: "Northstar Internal Billing Service",
    organization: "Northstar Systems Treasury",
    email: "treasury-vault@internal.northstar.local",
    tier: "CONFIDENTIAL_VIP",
    isInternal: true,
    notes: "Treasury escrow allocation: $4,250,000 USD",
  },
];

export const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: "evt-901",
    timestamp: "2026-09-05T08:12:00Z",
    event: "User authentication successful",
    status: "SUCCESS",
    actor: "alex@northstar.local",
    ip: "192.168.1.45",
  },
  {
    id: "evt-902",
    timestamp: "2026-09-05T08:14:22Z",
    event: "Order placed: #1001",
    status: "SUCCESS",
    actor: "alex@northstar.local",
    ip: "192.168.1.45",
  },
  {
    id: "evt-903",
    timestamp: "2026-09-05T08:30:10Z",
    event: "Password reset requested",
    status: "SUCCESS",
    actor: "bob@northstar.local",
    ip: "10.0.4.12",
  },
  {
    id: "evt-904",
    timestamp: "2026-09-05T09:01:45Z",
    event: "System health check executed",
    status: "SUCCESS",
    actor: "SYSTEM_DAEMON",
    ip: "127.0.0.1",
  },
];


export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  badge: string;
}

export const PRODUCTS: ProductItem[] = [
  {
    id: "prod-001",
    name: "Cloud Telemetry Starter Pack",
    category: "Monitoring & Observability",
    price: 120,
    description: "Compact multi-region telemetry beacon appliance with real-time audit streaming.",
    badge: "Popular",
  },
  {
    id: "prod-002",
    name: "Quantum VPN Gateway Hardware Appliance",
    category: "Zero-Trust Networking",
    price: 2400,
    description: "High-throughput edge perimeter encryptor featuring dual hardware crypto enclaves.",
    badge: "Enterprise",
  },
  {
    id: "prod-003",
    name: "Zero-Trust Perimeter Enforcer",
    category: "Access Enforcement",
    price: 3000,
    description: "Layer-7 policy router with integrated mutual TLS termination and continuous posture checks.",
    badge: "New Release",
  },
  {
    id: "prod-004",
    name: "Support Monitoring & Diagnostics Kit",
    category: "Diagnostics & Health",
    price: 180,
    description: "Plug-and-play diagnostic probe for internal network latency and endpoint reliability.",
    badge: "Standard",
  },
];
