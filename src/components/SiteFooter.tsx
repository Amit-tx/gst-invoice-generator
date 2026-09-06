export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-3">
        <p>© {new Date().getFullYear()} GST Suite. Free tools for Indian businesses.</p>
        <p>Made for freelancers, shopkeepers & small businesses across India.</p>
      </div>
    </footer>
  );
}
