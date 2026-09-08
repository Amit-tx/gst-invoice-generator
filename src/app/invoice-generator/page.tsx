import type { Metadata } from "next";
import InvoiceGeneratorClient from "@/components/InvoiceGeneratorClient";

export const metadata: Metadata = {
  title: "GST Invoice Generator — GSTIN, HSN, PDF Download | GST Suite",
  description:
    "Create a professional GST invoice with your logo, GSTIN, bill-to/ship-to addresses, HSN/SAC codes, automatic tax calculation and one-click PDF download.",
};

export default function InvoiceGeneratorPage() {
  return <InvoiceGeneratorClient />;
}
