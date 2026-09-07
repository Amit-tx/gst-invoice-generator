import Link from "next/link";
import { Calculator, FileText, Check, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <span className="inline-block rounded-full bg-indigo-50 text-[var(--accent)] text-xs font-bold px-3 py-1.5 mb-5">
          Free · No signup · Works instantly
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)] max-w-3xl mx-auto">
          GST Calculator & Invoice Generator for Indian Businesses
        </h1>
        <p className="mt-5 text-lg text-[var(--text-sec)] max-w-2xl mx-auto">
          Add or remove GST on multiple items in one go, then generate a
          professional GST invoice with GSTIN, HSN codes and a PDF you can
          send to customers — all for free.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/gst-calculator"
            className="rounded-full bg-[var(--btn-primary)] text-white font-semibold px-6 py-3 hover:bg-[var(--btn-primary-hover)] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Calculator size={18} /> Open GST Calculator
          </Link>
          <Link
            href="/invoice-generator"
            className="rounded-full border border-[var(--input-border)] text-[var(--text-main)] font-semibold px-6 py-3 hover:bg-[var(--subtotal-bg)] transition-colors inline-flex items-center justify-center gap-2"
          >
            <FileText size={18} /> Create an Invoice
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20 grid sm:grid-cols-3 gap-5">
        <Card
          icon={<Calculator size={20} />}
          title="GST Calculator"
          items={[
            "Add GST to a base amount, or remove GST from a total",
            "Calculate multiple items in a single table",
            "Automatic CGST + SGST or IGST split",
          ]}
        />
        <Card
          icon={<FileText size={20} />}
          title="Invoice Generator"
          items={[
            "Company logo, GSTIN & full business details",
            "Separate bill-to and ship-to addresses",
            "HSN/SAC codes + PDF download",
          ]}
        />
        <Card
          icon={<ShoppingCart size={20} />}
          title="POS Billing"
          items={[
            "Fast checkout for shop counters",
            "Shop details saved on your device",
            "Instant printable receipt",
          ]}
        />
      </section>
    </div>
  );
}

function Card({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
      <div className="h-10 w-10 rounded-xl bg-indigo-50 text-[var(--accent)] flex items-center justify-center mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-bold mb-3 text-[var(--text-main)]">{title}</h2>
      <ul className="text-[var(--text-sec)] space-y-2 text-sm">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <Check size={16} className="mt-0.5 text-[var(--success)] shrink-0" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
