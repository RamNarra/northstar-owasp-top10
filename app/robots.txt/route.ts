import { NextResponse } from "next/server";

export async function GET() {
  const robots = `# Northstar Production Crawler Policy
User-agent: *
Disallow: /admin/
Disallow: /account/
Disallow: /api/debug/
Allow: /
`;
  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
