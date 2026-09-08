"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TOOLS = [
  { href: "/gst-calculator", label: "GST Calculator" },
  { href: "/gst-calculator?mode=remove", label: "Reverse GST" },
  { href: "/invoice-generator", label: "Invoice Generator" },
  { href: "/pos", label: "POS Billing" },
];

export default function ToolTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentMode = searchParams.get("mode");

  return (
    <div className="sticky top-16 z-30 bg-[var(--page-bg)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto py-3 no-scrollbar">
          {TOOLS.map((tool) => {
            const [toolPath, toolQuery] = tool.href.split("?");
            const toolMode = toolQuery ? new URLSearchParams(toolQuery).get("mode") : null;
            const isActive = pathname === toolPath && currentMode === toolMode;
            return (
              <Link
                key={tool.label}
                href={tool.href}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-[var(--btn-primary)] text-white"
                    : "bg-[var(--subtotal-bg)] text-[var(--text-main)] hover:bg-[var(--border)]"
                }`}
              >
                {tool.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
