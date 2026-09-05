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
  totalInr: number;
  totalUsd?: number;
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

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  description: string;
  badge: string;
  image: string;
  specs: ProductSpecification[];
  availability: string;
  warranty: string;
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
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
    totalInr: 9999,
    totalUsd: 120,
    status: "CONFIRMED",
    shippingAddress: "Plot 42, Electronics City Phase 1, Bengaluru, Karnataka 560100",
  },
  "1002": {
    id: "1002",
    userId: "usr-102",
    customerEmail: "bob@northstar.local",
    item: "Quantum VPN Gateway Hardware Appliance",
    quantity: 2,
    totalInr: 399998,
    totalUsd: 2400,
    status: "SHIPPED",
    shippingAddress: "Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
  },
  "1003": {
    id: "1003",
    userId: "usr-001",
    customerEmail: "admin@northstar.local",
    item: "Zero-Trust Perimeter Enforcer",
    quantity: 5,
    totalInr: 1249995,
    totalUsd: 15000,
    status: "PROCESSING",
    shippingAddress: "Tower 2, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
  },
};

export const CUSTOMER_DIRECTORY: CustomerDirectoryRecord[] = [
  {
    id: 101,
    name: "Apex Logistics India",
    organization: "Apex Enterprise Logistics Ltd",
    email: "ops@apex-logistics.test",
    tier: "Premier Partner",
    isInternal: false,
  },
  {
    id: 102,
    name: "Beacon Health Networks",
    organization: "Beacon Care Systems India",
    email: "compliance@beacon-health.test",
    tier: "Strategic Partner",
    isInternal: false,
  },
  {
    id: 103,
    name: "Crestview Financial",
    organization: "Crestview Financial Services",
    email: "security@crestview-fin.test",
    tier: "Enterprise Partner",
    isInternal: false,
  },
  {
    id: 104,
    name: "Delta Robotics Labs",
    organization: "Delta Automation India",
    email: "labs@delta-robotics.test",
    tier: "Technology Partner",
    isInternal: false,
  },
  {
    id: 999,
    name: "Northstar Internal Billing Service",
    organization: "Northstar Systems Treasury",
    email: "treasury-vault@internal.northstar.local",
    tier: "CONFIDENTIAL_VIP",
    isInternal: true,
    notes: "Treasury escrow allocation: ₹3,50,00,000 INR",
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

export const PRODUCTS: ProductItem[] = [
  {
    id: "prod-001",
    slug: "cloud-telemetry-starter-pack",
    name: "Cloud Telemetry Starter Pack",
    category: "Monitoring & Observability",
    price: 9999,
    description: "Compact 1U rackmount edge telemetry appliance with real-time audit event streaming and TLS log forwarding.",
    badge: "Popular",
    image: "/images/products/cloud-telemetry.jpg",
    availability: "In Stock (Ships in 24 hours)",
    warranty: "3 Years Comprehensive Hardware Replacement",
    specs: [
      { label: "Form Factor", value: "1U Rackmount / Desktop" },
      { label: "Throughput", value: "2.5 Gbps Hardware Audit Pipeline" },
      { label: "Telemetry Interfaces", value: "4x 1GbE RJ-45, 1x Dedicated Management" },
      { label: "Power Supply", value: "Dual redundant 120W AC 100-240V" },
      { label: "Certifications", value: "BIS, CE, FCC Class A, RoHS" },
    ],
  },
  {
    id: "prod-002",
    slug: "quantum-vpn-gateway",
    name: "Quantum VPN Gateway Hardware Appliance",
    category: "Zero-Trust Networking",
    price: 199999,
    description: "High-throughput edge perimeter encryptor featuring dual hardware crypto enclaves and post-quantum tunnel negotiation.",
    badge: "Enterprise",
    image: "/images/products/quantum-vpn.jpg",
    availability: "In Stock (Ships from Bengaluru warehouse)",
    warranty: "5 Years 24/7 Northstar Care Replacement",
    specs: [
      { label: "Form Factor", value: "High-density Compact Appliance" },
      { label: "Encrypted Tunneling", value: "10 Gbps WireGuard & IPsec throughput" },
      { label: "Hardware Security", value: "Dedicated Cryptographic Coprocessor Enclave" },
      { label: "Ports", value: "1x 10GbE WAN, 4x Gigabit LAN, 1x Serial Console" },
      { label: "MTBF", value: "> 350,000 Hours Continuous" },
    ],
  },
  {
    id: "prod-003",
    slug: "zerotrust-perimeter-enforcer",
    name: "Zero-Trust Perimeter Enforcer",
    category: "Access Enforcement",
    price: 249999,
    description: "Layer-7 policy router with integrated mutual TLS termination, continuous posture checks, and hardware acceleration.",
    badge: "New Release",
    image: "/images/products/zero-trust.jpg",
    availability: "Immediate Dispatch",
    warranty: "5 Years Advance Hardware Replacement",
    specs: [
      { label: "Form Factor", value: "2U Rackmount Dual-Fan System" },
      { label: "Network Capacity", value: "40 Gbps Aggregate Policy Switching" },
      { label: "Fiber Uplinks", value: "8x 10G SFP+ Optical Ports, 2x 40G QSFP+" },
      { label: "Inspection Engine", value: "Hardware-accelerated Stateful L7 Inspector" },
      { label: "Redundancy", value: "Hot-swappable dual 450W power modules" },
    ],
  },
  {
    id: "prod-004",
    slug: "diagnostics-kit",
    name: "Support Monitoring & Diagnostics Kit",
    category: "Diagnostics & Health",
    price: 14999,
    description: "Ruggedized portable diagnostic console for internal network latency verification, packet jitter, and endpoint reliability.",
    badge: "Standard",
    image: "/images/products/diagnostics-kit.jpg",
    availability: "In Stock",
    warranty: "2 Years Northstar Standard Coverage",
    specs: [
      { label: "Display", value: "4.3-inch High-contrast Sunlight Readable OLED" },
      { label: "Battery Life", value: "14 Hours Continuous Field Operation" },
      { label: "Interfaces", value: "2x 10G RJ45, 1x SFP+, Dual Band RF Analysis" },
      { label: "Housing", value: "IP54 Dust & Shock Resistant Rugged Shell" },
      { label: "Weight", value: "680g Field Portable" },
    ],
  },
];
