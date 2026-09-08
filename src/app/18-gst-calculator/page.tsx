import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";

export const metadata: Metadata = {
  title: "18% GST Calculator — Add or Remove 18% GST Instantly | GST Suite",
  description:
    "Free 18% GST calculator — the most common GST slab in India, covering most goods and services. Add 18% GST to a base price or remove it from an inclusive total.",
};

export default function GstCalculator18Page() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-sm text-[var(--text-sec)]">
          18% is the standard GST slab that covers the majority of goods and
          services in India — from electronics and financial services to most
          restaurant bills and professional fees. Use this calculator with
          18% pre-selected to quickly add GST to a price or extract it from
          a GST-inclusive amount.
        </p>
      </div>
      <Suspense fallback={null}>
        <GstCalculatorClient
          heading="18% GST Calculator"
          intro="18% pre-selected — add GST to a base amount or remove it from a total that already includes 18% GST."
          initialRate={18}
        />
      </Suspense>
    </div>
  );
}
