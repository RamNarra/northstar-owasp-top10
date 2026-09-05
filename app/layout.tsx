import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northstar Security Incident · OWASP Top 10:2025 & JWT Lab",
  description: "Beginner-friendly incident investigation CTF teaching OWASP Top 10:2025 and JWT security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-slate-900 bg-[#fbfcfd]">
        {children}
      </body>
    </html>
  );
}
