import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";

export const metadata: Metadata = {
  title: "GST Calculator India — All Slabs (5%, 12%, 18%, 28%) | GST Suite",
  description:
    "India's free GST calculator covering all official slabs — 0%, 0.25%, 3%, 5%, 12%, 18%, 28%. Add or remove GST, split CGST/SGST or IGST for inter-state supply.",
};

export default function GstCalculatorIndiaPage() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-sm text-[var(--text-sec)]">
          India&apos;s GST regime uses a handful of standard rate slabs — 0%,
          0.25%, 3%, 5%, 12%, 18%, and 28% — applied depending on the goods or
          service. This calculator supports every slab, and automatically
          splits the tax into CGST + SGST for intra-state sales or IGST for
          inter-state sales, as required under Indian GST rules.
        </p>
      </div>
      <Suspense fallback={null}>
        <GstCalculatorClient
          heading="GST Calculator — India"
          intro="Calculate GST at any official Indian slab, for one item or several, with automatic CGST/SGST/IGST split."
        />
      </Suspense>
    </div>
  );
}
