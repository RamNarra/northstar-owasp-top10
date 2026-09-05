import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-xs">
          <div>
            <h4 className="font-semibold text-slate-900 mb-3.5">Products</h4>
            <ul className="space-y-2.5 text-slate-500">
              <li><Link href="/products" className="hover:text-slate-900 transition-colors">Telemetry Hardware</Link></li>
              <li><Link href="/products" className="hover:text-slate-900 transition-colors">Perimeter Gateways</Link></li>
              <li><Link href="/products" className="hover:text-slate-900 transition-colors">Edge Routers</Link></li>
              <li><Link href="/products" className="hover:text-slate-900 transition-colors">Monitoring Probes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3.5">Solutions</h4>
            <ul className="space-y-2.5 text-slate-500">
              <li><Link href="/products" className="hover:text-slate-900 transition-colors">Distributed Infrastructure</Link></li>
              <li><Link href="/products" className="hover:text-slate-900 transition-colors">Zero-Trust Telemetry</Link></li>
              <li><Link href="/products" className="hover:text-slate-900 transition-colors">Enterprise Observability</Link></li>
              <li><Link href="/about" className="hover:text-slate-900 transition-colors">Platform Compliance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3.5">Account</h4>
            <ul className="space-y-2.5 text-slate-500">
              <li><Link href="/account" className="hover:text-slate-900 transition-colors">Customer Portal</Link></li>
              <li><Link href="/orders" className="hover:text-slate-900 transition-colors">Order Tracking</Link></li>
              <li><Link href="/account" className="hover:text-slate-900 transition-colors">Data &amp; Privacy</Link></li>
              <li><Link href="/login" className="hover:text-slate-900 transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3.5">Company</h4>
            <ul className="space-y-2.5 text-slate-500">
              <li><Link href="/about" className="hover:text-slate-900 transition-colors">About Northstar</Link></li>
              <li><Link href="/partners" className="hover:text-slate-900 transition-colors">Partner Network</Link></li>
              <li><Link href="/about#support" className="hover:text-slate-900 transition-colors">Support &amp; Inquiries</Link></li>
              <li><span className="text-slate-400">Offices: Bengaluru &bull; Hyderabad &bull; Mumbai</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <span>&copy; {new Date().getFullYear()} Northstar Systems Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-slate-600 transition-colors">System Specifications</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
