import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, formatInr } from "@/lib/fake-db";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function ProductsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 font-mono">
            Direct Procurement
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1">
            Hardware &amp; Equipment Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xl leading-relaxed">
            Enterprise network telemetry beacons, hardware perimeter encryptors, and line-rate diagnostic consoles.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>All Prices Include GST</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="border border-slate-200/90 rounded-xl bg-white overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
          >
            <div>
              <Link href={`/products/${prod.slug}`} className="block relative h-64 bg-slate-50 border-b border-slate-100 overflow-hidden">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200 shadow-sm">
                  {prod.badge}
                </span>
              </Link>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                    {prod.category}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {prod.availability}
                  </span>
                </div>

                <Link href={`/products/${prod.slug}`}>
                  <h2 className="font-bold text-lg text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {prod.name}
                  </h2>
                </Link>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {prod.description}
                </p>

                <div className="pt-2">
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5">Key Specifications:</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {prod.specs.slice(0, 2).map((s, idx) => (
                      <div key={idx}>
                        <span className="text-slate-400 block text-[10px]">{s.label}</span>
                        <span className="font-medium text-slate-800 truncate block">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block font-mono">Procurement Price</span>
                <span className="font-extrabold text-lg text-slate-900 font-mono">
                  {formatInr(prod.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${prod.slug}`}
                  className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  Specifications
                </Link>
                <Link
                  href="/cart"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  Add to Cart
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
