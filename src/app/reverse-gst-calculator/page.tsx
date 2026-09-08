import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";

export const metadata: Metadata = {
  title: "Reverse GST Calculator — Extract Base Amount from GST-Inclusive Total | GST Suite",
  description:
    "Free reverse GST calculator for India. Enter a GST-inclusive total and instantly find the original base amount, CGST, SGST or IGST — no signup needed.",
};

export default function ReverseGstCalculatorPage() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-sm text-[var(--text-sec)]">
          Got a price that already includes GST and need to know how much of it
          is tax? A reverse GST calculator works backwards from a
          GST-inclusive total to reveal the original base amount and the exact
          CGST/SGST or IGST portion — useful for checking bills, reconciling
          accounts, or pricing products where the sticker price is inclusive
          of tax.
        </p>
      </div>
      <Suspense fallback={null}>
        <GstCalculatorClient
          heading="Reverse GST Calculator"
          intro="Enter a GST-inclusive amount below and we'll work out the taxable value and the exact tax split — instantly."
          initialMode="remove"
        />
      </Suspense>
    </div>
  );
}
