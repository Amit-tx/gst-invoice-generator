import type { Metadata } from "next";
import GstCalculatorClient from "@/components/GstCalculatorClient";

export const metadata: Metadata = {
  title: "GST Calculator — Add or Remove GST on Multiple Items | GST Suite",
  description:
    "Free online GST calculator. Add GST to a base amount or remove GST from an inclusive total. Supports multiple line items and automatic CGST/SGST/IGST split.",
};

export default function GstCalculatorPage() {
  return <GstCalculatorClient />;
}
