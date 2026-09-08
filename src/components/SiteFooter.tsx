import Link from "next/link";

const QUICK_LINKS = [
  { href: "/gst-calculator", label: "GST Calculator" },
  { href: "/gst-calculator-india", label: "GST Calculator India" },
  { href: "/reverse-gst-calculator", label: "Reverse GST Calculator" },
  { href: "/18-gst-calculator", label: "18% GST Calculator" },
  { href: "/12-gst-calculator", label: "12% GST Calculator" },
  { href: "/5-gst-calculator", label: "5% GST Calculator" },
  { href: "/28-gst-calculator", label: "28% GST Calculator" },
  { href: "/invoice-generator", label: "Invoice Generator" },
  { href: "/pos", label: "POS Billing" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card-bg)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-sec)] mb-6">
          {QUICK_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[var(--accent)]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm text-[var(--text-sec)] flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-[var(--border)]">
          <p>© {new Date().getFullYear()} GST Suite. Free tools for Indian businesses.</p>
          <p>Made for freelancers, shopkeepers & small businesses across India.</p>
        </div>
      </div>
    </footer>
  );
}
