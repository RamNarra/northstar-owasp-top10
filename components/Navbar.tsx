"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, User, Search, Layers, Compass } from "lucide-react";

export default function Navbar() {
  const [cartCount, setCartCount] = useState<number>(1);
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-sm tracking-tight">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-slate-900 text-base leading-none">
                NORTHSTAR
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">
                Systems &amp; Equipment
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
            <Link href="/products" className="hover:text-slate-900 transition-colors">
              Products
            </Link>
            <Link href="/directory" className="hover:text-slate-900 transition-colors">
              Customer Directory
            </Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">
              Company
            </Link>
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <Link
            href="/directory"
            className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            title="Customer Directory Lookup"
          >
            <Search className="w-4 h-4" />
          </Link>

          <Link
            href="/cart"
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-slate-900 text-white rounded-full text-[10px] flex items-center justify-center font-mono font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="h-4 w-[1px] bg-slate-200" />

          {currentUser ? (
            <Link
              href="/account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-600" />
              <span>{currentUser}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded transition-colors shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
