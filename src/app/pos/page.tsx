import type { Metadata } from "next";
import PosClient from "@/components/PosClient";

export const metadata: Metadata = {
  title: "POS Billing — Quick GST Receipt Generator | GST Suite",
  description:
    "Fast point-of-sale billing for shop counters. Add items, apply GST automatically, and print a receipt in seconds. No login required.",
};

export default function PosPage() {
  return <PosClient />;
}
