export default function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card-bg)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-sm text-[var(--text-sec)] flex flex-col sm:flex-row justify-between gap-3">
        <p>© {new Date().getFullYear()} GST Suite. Free tools for Indian businesses.</p>
        <p>Made for freelancers, shopkeepers & small businesses across India.</p>
      </div>
    </footer>
  );
}
