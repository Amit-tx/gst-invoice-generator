import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ToolTabsGate from "@/components/ToolTabsGate";

export const metadata: Metadata = {
  title: "GST Calculator & Invoice Generator | GST Suite",
  description:
    "Free GST calculator (add/remove GST, multi-item) and a full business invoice generator with GSTIN, HSN codes, and PDF download — built for Indian businesses.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--page-bg)] text-[var(--text-main)]">
        <SiteHeader />
        <Suspense fallback={null}>
          <ToolTabsGate />
        </Suspense>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
