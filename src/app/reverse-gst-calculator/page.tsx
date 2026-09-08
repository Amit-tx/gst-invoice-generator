import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Reverse GST Calculator — Find Base Amount from a GST-Inclusive Price | GST Suite",
  description:
    "Free reverse GST calculator for India. Enter a price that already includes GST and instantly get the base amount, plus the exact CGST, SGST or IGST split.",
};

const FAQS = [
  {
    question: "What is a reverse GST calculator?",
    answer:
      "A reverse GST calculator works backwards from a price that already includes GST (a GST-inclusive amount) to find the original base amount and the tax portion within it. It's the opposite of a normal GST calculator, which starts from a base amount and adds GST to it.",
  },
  {
    question: "How do you calculate the base amount from a GST-inclusive price?",
    answer:
      "Divide the GST-inclusive total by (1 + GST rate/100). For example, on a price of Rs. 1,180 that includes 18% GST, the base amount is 1180 / 1.18 = Rs. 1,000, and the GST portion is Rs. 180.",
  },
  {
    question: "When would I need to remove GST from a total?",
    answer:
      "This is useful when you have a final selling price (like an MRP or a total on a bill) and need to know how much of it is the base price versus tax — for example, when reconciling accounts, checking a vendor's bill, or working out your actual revenue before tax.",
  },
  {
    question: "Does this calculator show the CGST/SGST or IGST split?",
    answer:
      "Yes. Once you enter the GST-inclusive amount and select a rate, the calculator shows the base (taxable) value along with either the CGST+SGST split for intra-state supply or the IGST amount for inter-state supply.",
  },
];

export default function ReverseGstCalculatorPage() {
  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-2">
        <p className="text-sm text-[var(--text-sec)]">
          Got a price that already includes GST and need to know how much of
          it is tax? This reverse GST calculator works backwards from a
          GST-inclusive total to reveal the original base amount and the
          exact CGST/SGST or IGST portion — useful for checking bills,
          reconciling accounts, or pricing products where the sticker price
          is inclusive of tax.
        </p>
      </div>
      <Suspense fallback={null}>
        <GstCalculatorClient
          heading="Reverse GST Calculator"
          intro="Enter a GST-inclusive amount below and we'll work out the base amount and the exact tax split — instantly."
          initialMode="remove"
        />
      </Suspense>
      <FaqSection items={FAQS} />
    </div>
  );
}
