import Link from "next/link";
import { PRODUCTS } from "@/lib/fake-db";
import { Cpu, ArrowRight } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Hardware &amp; Equipment Catalog
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized enterprise network telemetry, encryption hardware, and diagnostics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="border border-slate-200 rounded-lg bg-white p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-500 text-[11px]">{prod.category}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
                  {prod.badge}
                </span>
              </div>

              <div className="w-full h-40 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-300">
                <Cpu className="w-12 h-12" />
              </div>

              <h2 className="font-bold text-base text-slate-900 leading-snug">
                {prod.name}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {prod.description}
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-base text-slate-900 font-mono">
                ${prod.price.toLocaleString()}.00
              </span>
              <Link
                href="/cart"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
              >
                Add to Cart
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
