import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card-bg)] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white text-sm font-bold">
            G
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-sky-400 border-2 border-white" />
          </span>
          <span className="font-extrabold text-lg text-[var(--text-main)]">GST Suite</span>
          <span className="rounded-md bg-indigo-50 text-[var(--accent)] text-xs font-bold px-1.5 py-0.5">
            .IN
          </span>
        </Link>
        <Link
          href="/invoice-generator"
          className="rounded-full bg-[var(--btn-primary)] text-white text-sm font-semibold px-5 py-2.5 hover:bg-[var(--btn-primary-hover)] transition-colors"
        >
          Create Invoice
        </Link>
      </div>
    </header>
  );
}
