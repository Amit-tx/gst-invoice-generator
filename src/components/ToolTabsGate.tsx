"use client";

import { usePathname } from "next/navigation";
import ToolTabs from "./ToolTabs";

export default function ToolTabsGate() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <ToolTabs />;
}
