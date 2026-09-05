import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SecurityFindingDrawer from "@/components/SecurityFindingDrawer";

export const metadata: Metadata = {
  title: "Northstar · Modern Equipment for Secure Teams",
  description: "Enterprise telemetry hardware, quantum perimeter appliances, and cloud infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col text-slate-900 bg-[#fbfcfd]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <SecurityFindingDrawer />
      </body>
    </html>
  );
}
