import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";

export const metadata: Metadata = {
  title: "28% GST Calculator — Add or Remove 28% GST Instantly | GST Suite",
  description:
    "Free 28% GST calculator for India — the highest slab, covering luxury and sin goods like cars, tobacco, and aerated drinks. Add or remove 28% GST instantly.",
};

export default function GstCalculator28Page() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-sm text-[var(--text-sec)]">
          28% is the highest standard GST slab in India, applied to luxury
          items and so-called &quot;sin goods&quot; such as automobiles,
          tobacco products, and aerated drinks. Use this calculator with 28%
          pre-selected to quickly add GST to a base amount or extract the
          base amount and tax split from a GST-inclusive total.
        </p>
      </div>
      <Suspense fallback={null}>
        <GstCalculatorClient
          heading="28% GST Calculator"
          intro="28% pre-selected — add GST to a base amount or remove it from a total that already includes 28% GST."
          initialRate={28}
        />
      </Suspense>
    </div>
  );
}
