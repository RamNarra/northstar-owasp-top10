import Link from "next/link";
import { ArrowRight, Shield, Cpu, Network, CheckCircle, Lock } from "lucide-react";

import { PRODUCTS } from "@/lib/fake-db";

export default function HomePage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Northstar Portal v2.4.1 Active Deployment</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 max-w-3xl mx-auto leading-[1.15]">
            Modern equipment for secure teams.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Engineered hardware, encrypted peripherals, and edge telemetry tools designed to
            protect distributed systems against modern threats.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-xs transition-colors shadow-sm"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/directory"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium text-xs transition-colors"
            >
              <span>Customer Directory</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Featured Infrastructure Hardware
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard-issue hardware deployed across enterprise data centers.
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1"
          >
            <span>View all products</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="border border-slate-200 rounded-lg bg-white p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">{prod.category}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                    {prod.badge}
                  </span>
                </div>

                <div className="w-full h-32 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-300">
                  <Cpu className="w-10 h-10" />
                </div>

                <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                  {prod.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {prod.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900 font-mono">
                  ${prod.price.toLocaleString()}.00
                </span>
                <Link
                  href="/cart"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
                >
                  Add to Cart
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Architecture Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-800">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Distributed Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Resilient serverless and edge workloads coordinated across redundant Northstar regions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-800">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Enterprise Access Control</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized JSON Web Token sessions governing order management and customer lookup.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-800">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Strict Compliance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All infrastructure adheres to modern cloud governance and operational standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
