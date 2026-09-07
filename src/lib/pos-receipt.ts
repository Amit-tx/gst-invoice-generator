import jsPDF from "jspdf";
import { formatINRForPdf, round2 } from "./gst";

export interface PosItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  gstRate: number;
}

export interface PosSaleData {
  shopName: string;
  shopGstin: string;
  shopAddress: string;
  billNumber: string;
  isInterState: boolean;
  items: PosItem[];
}

/** Generates a narrow, thermal-receipt-style PDF (80mm width) for quick billing. */
export function generatePosReceiptPdf(data: PosSaleData) {
  const widthMm = 80;
  const marginMm = 4;
  const doc = new jsPDF({ unit: "mm", format: [widthMm, 200] });
  const centerX = widthMm / 2;
  let y = 8;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.shopName || "Your Shop", centerX, y, { align: "center" });
  y += 5;

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  if (data.shopAddress) {
    const lines = doc.splitTextToSize(data.shopAddress, widthMm - marginMm * 2);
    doc.text(lines, centerX, y, { align: "center" });
    y += lines.length * 3.2;
  }
  if (data.shopGstin) {
    doc.text(`GSTIN: ${data.shopGstin}`, centerX, y, { align: "center" });
    y += 4;
  }

  y += 1;
  doc.setLineDashPattern([0.5, 0.5], 0);
  doc.line(marginMm, y, widthMm - marginMm, y);
  y += 4;

  doc.setFontSize(7);
  doc.text(`Bill #: ${data.billNumber}`, marginMm, y);
  doc.text(new Date().toLocaleString("en-IN"), widthMm - marginMm, y, { align: "right" });
  y += 5;

  doc.line(marginMm, y, widthMm - marginMm, y);
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.text("Item", marginMm, y);
  doc.text("Qty", widthMm - marginMm - 24, y, { align: "right" });
  doc.text("Amount", widthMm - marginMm, y, { align: "right" });
  y += 3.5;
  doc.setFont("helvetica", "normal");
  doc.line(marginMm, y, widthMm - marginMm, y);
  y += 4;

  let taxableTotal = 0;
  let taxTotal = 0;

  for (const item of data.items) {
    const taxable = round2(item.qty * item.price);
    const tax = round2((taxable * item.gstRate) / 100);
    taxableTotal += taxable;
    taxTotal += tax;

    const nameLines = doc.splitTextToSize(item.name || "Item", 38);
    doc.text(nameLines, marginMm, y);
    doc.text(String(item.qty), widthMm - marginMm - 24, y, { align: "right" });
    doc.text(formatINRForPdf(round2(taxable + tax)), widthMm - marginMm, y, { align: "right" });
    y += Math.max(nameLines.length, 1) * 3.6;
  }

  y += 1;
  doc.line(marginMm, y, widthMm - marginMm, y);
  y += 4;

  const grandTotal = round2(taxableTotal + taxTotal);

  doc.setFontSize(7.5);
  doc.text("Taxable Value:", marginMm, y);
  doc.text(formatINRForPdf(taxableTotal), widthMm - marginMm, y, { align: "right" });
  y += 4;
  doc.text("Total GST:", marginMm, y);
  doc.text(formatINRForPdf(taxTotal), widthMm - marginMm, y, { align: "right" });
  y += 5;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", marginMm, y);
  doc.text(formatINRForPdf(grandTotal), widthMm - marginMm, y, { align: "right" });
  y += 6;

  doc.setFontSize(7);
  doc.setFont("helvetica", "italic");
  doc.text("Thank you for your business!", centerX, y, { align: "center" });

  doc.save(`Receipt-${data.billNumber || "draft"}.pdf`);
}
