import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)] text-white text-sm">
            ₹
          </span>
          GST Suite
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/gst-calculator" className="hover:text-slate-900">GST Calculator</Link>
          <Link href="/invoice-generator" className="hover:text-slate-900">Invoice Generator</Link>
        </nav>
        <Link
          href="/invoice-generator"
          className="rounded-lg bg-[var(--brand)] text-white text-sm font-semibold px-4 py-2 hover:bg-[var(--brand-dark)] transition-colors"
        >
          Create Invoice
        </Link>
      </div>
    </header>
  );
}
