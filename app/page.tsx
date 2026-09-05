import Link from "next/link";
import { ArrowRight, Shield, Cpu, Network, Lock, Layers } from "lucide-react";
import { PRODUCTS } from "@/lib/fake-db";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium">
            <span>Northstar Enterprise Systems</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.12]">
            Modern equipment for secure teams.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Engineered hardware appliances, high-throughput perimeter controllers, and edge
            telemetry designed to keep distributed operations resilient.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium text-xs transition-colors shadow-sm"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md font-medium text-xs transition-colors"
            >
              <span>Company Architecture</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Hardware Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Featured Infrastructure Hardware
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Standard-issue equipment deployed across enterprise data centers.
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="border border-slate-200/80 rounded-lg bg-white p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">{prod.category}</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                    {prod.badge}
                  </span>
                </div>

                <div className="w-full h-36 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-400 transition-colors">
                  <Cpu className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">
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

      {/* Engineering Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900">Distributed Availability</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multi-region failover and real-time edge telemetry with zero centralized bottlenecks.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900">Dependable Infrastructure</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Built for teams that need dependable infrastructure, straightforward deployment, and responsive support.
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900">Enterprise Standards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Standardized procurement protocols and transparent supply chains for verified partner accounts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
