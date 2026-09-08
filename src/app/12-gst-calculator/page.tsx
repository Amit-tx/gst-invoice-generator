import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";

export const metadata: Metadata = {
  title: "12% GST Calculator — Add or Remove 12% GST Instantly | GST Suite",
  description:
    "Free 12% GST calculator for India — covers processed foods, business class air travel, and other goods taxed at this middle slab. Add or remove 12% GST instantly.",
};

export default function GstCalculator12Page() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-sm text-[var(--text-sec)]">
          12% is a middle GST slab in India, applied to items like processed
          foods, mobile phones, and business-class air travel. Use this
          calculator with 12% pre-selected to quickly add GST to a base
          amount or extract the base amount and tax split from a
          GST-inclusive total.
        </p>
      </div>
      <Suspense fallback={null}>
        <GstCalculatorClient
          heading="12% GST Calculator"
          intro="12% pre-selected — add GST to a base amount or remove it from a total that already includes 12% GST."
          initialRate={12}
        />
      </Suspense>
    </div>
  );
}
