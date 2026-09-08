import type { Metadata } from "next";
import { Suspense } from "react";
import GstCalculatorClient from "@/components/GstCalculatorClient";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "GST Calculator — Add or Remove GST on Multiple Items | GST Suite",
  description:
    "Free online GST calculator. Add GST to a base amount or remove GST from an inclusive total. Supports multiple line items and automatic CGST/SGST/IGST split.",
};

const FAQS = [
  {
    question: "What is the formula to calculate GST?",
    answer:
      "To add GST: GST amount = Base amount x GST rate / 100, and the total is Base amount + GST amount. To remove GST from a price that already includes it: Base amount = Total / (1 + GST rate / 100).",
  },
  {
    question: "How do I calculate GST percentage on a total amount?",
    answer:
      "If you know the base amount and the GST rate, multiply the base amount by the rate and divide by 100 — for example, 18% GST on Rs. 1,000 is 1000 x 18 / 100 = Rs. 180. If you only have the final total, use the reverse GST calculator instead to work out the rate and base amount.",
  },
  {
    question: "How do I calculate GST on MRP?",
    answer:
      "In India, MRP (Maximum Retail Price) is generally treated as GST-inclusive. To find the GST portion within an MRP, divide the MRP by (1 + GST rate/100) to get the base price, then subtract that from the MRP to get the GST amount — this calculator does it automatically when you switch to 'Remove GST' mode.",
  },
  {
    question: "What is the difference between CGST, SGST and IGST?",
    answer:
      "For sales within the same state (intra-state), GST is split equally between CGST (Central GST) and SGST (State GST). For sales between different states (inter-state), the full GST amount is charged as IGST (Integrated GST) instead. This calculator lets you choose the supply type and applies the correct split automatically.",
  },
  {
    question: "What are the GST rate slabs in India?",
    answer:
      "India's GST law defines several rate slabs: 0%, 0.25%, 3%, 5%, 12%, 18%, and 28%, applied depending on the type of goods or service. 18% is the most common slab, covering most goods and services.",
  },
];

export default function GstCalculatorPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <GstCalculatorClient />
      </Suspense>
      <FaqSection items={FAQS} />
    </div>
  );
}
