import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";

export const metadata: Metadata = {
  title: "5% GST Calculator — Add or Remove 5% GST Instantly | GST Suite",
  description:
    "Free 5% GST calculator for India — covers essential goods and services taxed at the lower slab. Add 5% GST to a price or remove it from a GST-inclusive total.",
};

export default function GstCalculator5Page() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-sm text-[var(--text-sec)]">
          5% is one of India&apos;s lower GST slabs, commonly applied to
          essential goods, packaged food items, and select services. Use this
          calculator with 5% pre-selected to quickly add GST to a base amount
          or extract the base amount and tax split from a GST-inclusive total.
        </p>
      </div>
      <Suspense fallback={null}>
        <GstCalculatorClient
          heading="5% GST Calculator"
          intro="5% pre-selected — add GST to a base amount or remove it from a total that already includes 5% GST."
          initialRate={5}
        />
      </Suspense>
    </div>
  );
}
