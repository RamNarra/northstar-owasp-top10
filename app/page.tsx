import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Zap, Activity, CheckCircle2 } from "lucide-react";
import { PRODUCTS, formatInr } from "@/lib/fake-db";

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 3);

  return (
    <div className="space-y-16 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 sm:pt-20 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-blue-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Enterprise Hardware Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Infrastructure that keeps teams moving.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              High-throughput edge perimeter controllers, tamper-resistant telemetry appliances,
              and diagnostics hardware engineered for modern distributed organizations across India.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs transition-colors shadow-sm"
              >
                <span>Browse Hardware Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium text-xs transition-colors"
              >
                <span>About Northstar India</span>
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>GST Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>3-Year Enterprise Care</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 aspect-[16/10] group">
              <Image
                src="/images/hero-datacenter.jpg"
                alt="Northstar Infrastructure Rack Hardware"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <div className="font-semibold text-slate-100">Unit A-04 Core Cluster</div>
                <div className="text-[11px] text-slate-300">Bengaluru Data Center &bull; Live Telemetry Active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Trust Strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-6 border-y border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span className="font-medium text-slate-400 uppercase tracking-wider text-[11px]">
            Trusted by infrastructure &amp; engineering leaders
          </span>
          <div className="flex flex-wrap items-center gap-6 font-semibold text-slate-700 text-sm">
            <span>Apex Logistics</span>
            <span className="text-slate-300">&bull;</span>
            <span>Beacon Healthcare</span>
            <span className="text-slate-300">&bull;</span>
            <span>Crestview Holdings</span>
            <span className="text-slate-300">&bull;</span>
            <span>Delta Robotics</span>
          </div>
        </div>
      </section>

      {/* Featured Hardware Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-end justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-blue-600 font-semibold text-xs tracking-wider uppercase">Procurement</span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
              Featured Infrastructure Hardware
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View all products</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((prod) => (
            <div
              key={prod.id}
              className="border border-slate-200/90 rounded-xl bg-white overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div>
                <Link href={`/products/${prod.slug}`} className="block relative h-48 bg-slate-50 overflow-hidden border-b border-slate-100">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-white/95 backdrop-blur-sm text-slate-700 rounded text-[10px] font-semibold border border-slate-200 shadow-sm">
                    {prod.badge}
                  </span>
                </Link>

                <div className="p-5 space-y-3">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    {prod.category}
                  </div>
                  <Link href={`/products/${prod.slug}`}>
                    <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {prod.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Unit Price</div>
                  <div className="font-bold text-base text-slate-900 font-mono">
                    {formatInr(prod.price)}
                  </div>
                </div>
                <Link
                  href={`/products/${prod.slug}`}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Northstar Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Zero-Overhead Deployment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pre-provisioned appliances boot directly into your telemetry mesh with automated TLS discovery.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Line-Rate Telemetry</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Continuous audit streaming with microsecond timestamp synchronization across regional nodes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 space-y-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Hardware Provenance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every unit includes cryptographically verified component manifests and tamper-evident enclaves.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
