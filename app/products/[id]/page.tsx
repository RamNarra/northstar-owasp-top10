import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PRODUCTS, formatInr } from "@/lib/fake-db";
import { ArrowLeft, ShieldCheck, Truck, Clock, Check, FileText } from "lucide-react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.slug }));
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.slug === id || p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/products" className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Catalog</span>
        </Link>
        <span>/</span>
        <span className="text-slate-400 font-mono">{product.category}</span>
        <span>/</span>
        <span className="text-slate-900 font-medium truncate">{product.name}</span>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Hardware Visual */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-contain p-8"
            />
            <span className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-sm text-slate-800 rounded-md text-xs font-semibold border border-slate-200 shadow-sm">
              {product.badge}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs text-slate-500 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-slate-700" />
              <span className="text-[11px] font-medium text-slate-700">Pan-India Dispatch</span>
              <span className="text-[10px] text-slate-400">Air Express Transit</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span className="text-[11px] font-medium text-slate-700">Northstar Care</span>
              <span className="text-[10px] text-slate-400">Advance Replacement</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col items-center gap-1">
              <FileText className="w-4 h-4 text-slate-700" />
              <span className="text-[11px] font-medium text-slate-700">GST Invoice</span>
              <span className="text-[10px] text-slate-400">18% Input Tax Credit</span>
            </div>
          </div>
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="text-xs font-mono font-medium text-blue-600 uppercase tracking-wider">
              {product.category}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{product.availability}</span>
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
            <div className="text-xs text-slate-500 font-mono uppercase">Standard Commercial Price</div>
            <div className="text-3xl font-black text-slate-950 font-mono tracking-tight">
              {formatInr(product.price)}
            </div>
            <div className="text-[11px] text-slate-500">Includes all local taxes and insured transit across India.</div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Overview</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">Technical Specifications</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {product.specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-3 p-3 bg-white hover:bg-slate-50/60 transition-colors">
                  <span className="font-medium text-slate-500 col-span-1">{spec.label}</span>
                  <span className="font-semibold text-slate-900 col-span-2">{spec.value}</span>
                </div>
              ))}
              <div className="grid grid-cols-3 p-3 bg-white">
                <span className="font-medium text-slate-500 col-span-1">Warranty Coverage</span>
                <span className="font-semibold text-slate-900 col-span-2">{product.warranty}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/cart"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-center text-xs font-semibold transition-colors shadow-sm"
            >
              Add to Cart &bull; {formatInr(product.price)}
            </Link>
            <Link
              href="/about#support"
              className="px-5 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
