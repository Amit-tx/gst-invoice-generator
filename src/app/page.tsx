import Link from "next/link";
import { Calculator, FileText, Check } from "lucide-react";

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <span className="inline-block rounded-full bg-emerald-50 text-[var(--brand)] text-xs font-semibold px-3 py-1 mb-5">
          Free · No signup · Works instantly
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto">
          GST Calculator & Invoice Generator for Indian Businesses
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          Add or remove GST on multiple items in one go, then generate a
          professional GST invoice with GSTIN, HSN codes and a PDF you can
          send to customers — all for free.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gst-calculator"
            className="rounded-lg bg-[var(--brand)] text-white font-semibold px-6 py-3 hover:bg-[var(--brand-dark)] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Calculator size={18} /> Open GST Calculator
          </Link>
          <Link
            href="/invoice-generator"
            className="rounded-lg border border-slate-300 text-slate-800 font-semibold px-6 py-3 hover:bg-slate-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <FileText size={18} /> Create an Invoice
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 p-6">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-[var(--brand)] flex items-center justify-center mb-4">
            <Calculator size={20} />
          </div>
          <h2 className="text-xl font-bold mb-2">GST Calculator</h2>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> Add GST to a base amount, or remove GST from a total</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> Calculate multiple items in a single table</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> Automatic CGST + SGST or IGST split</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> All standard slabs: 0%, 0.25%, 3%, 5%, 12%, 18%, 28%</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 p-6">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-[var(--brand)] flex items-center justify-center mb-4">
            <FileText size={20} />
          </div>
          <h2 className="text-xl font-bold mb-2">Invoice Generator</h2>
          <ul className="text-slate-600 space-y-2 text-sm">
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> Company logo, GSTIN & full business details</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> Separate bill-to and ship-to addresses</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> HSN/SAC codes per line item</li>
            <li className="flex gap-2"><Check size={16} className="mt-0.5 text-[var(--brand)] shrink-0" /> Amount in words + one-click PDF download</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
