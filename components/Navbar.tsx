"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Search } from "lucide-react";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("northstar_session_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed.name || parsed.email);
      }
    } catch (_e) {}
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded bg-slate-950 flex items-center justify-center text-white font-semibold text-xs tracking-tight transition-transform group-hover:scale-95">
              N
            </div>
            <span className="font-bold tracking-tight text-slate-900 text-sm">
              Northstar
            </span>
          </Link>

          {/* Clean Commercial Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-500">
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Products
            </Link>
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Solutions
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              Company
            </Link>
            <Link href="/directory" className="hover:text-slate-900 transition-colors">
              Directory
            </Link>
          </nav>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-4">
          <Link
            href="/directory"
            className="p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors"
            title="Search Directory"
          >
            <Search className="w-4 h-4" />
          </Link>

          <Link
            href="/cart"
            className="relative p-2 text-slate-500 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-colors"
            title="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-slate-900 text-white rounded-full text-[9px] flex items-center justify-center font-medium">
              1
            </span>
          </Link>

          <div className="h-3.5 w-[1px] bg-slate-200 mx-1" />

          {currentUser ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentUser}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
