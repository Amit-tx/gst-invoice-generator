import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InvoiceData } from "./invoice-types";
import { formatINRForPdf, numberToWordsINR, round2 } from "./gst";

export function generateInvoicePdf(data: InvoiceData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let y = 50;

  if (data.logoDataUrl) {
    try {
      doc.addImage(data.logoDataUrl, "PNG", margin, y, 70, 70);
    } catch {
      // ignore unsupported image formats
    }
  }

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", pageWidth - margin, y + 15, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Invoice #: ${data.invoiceNumber}`, pageWidth - margin, y + 32, { align: "right" });
  doc.text(`Date: ${data.invoiceDate}`, pageWidth - margin, y + 46, { align: "right" });
  if (data.dueDate) {
    doc.text(`Due: ${data.dueDate}`, pageWidth - margin, y + 60, { align: "right" });
  }

  y += 90;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(data.seller.name || "Your Business Name", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 14;
  const sellerLines = doc.splitTextToSize(data.seller.address || "", 250);
  doc.text(sellerLines, margin, y);
  y += sellerLines.length * 11 + 4;
  doc.text(`GSTIN: ${data.seller.gstin || "-"}`, margin, y);
  y += 12;
  doc.text(`State: ${data.seller.state || "-"}`, margin, y);

  const partyStartY = y - (sellerLines.length * 11 + 30);
  let py = partyStartY;
  const col2 = pageWidth / 2 + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Bill To:", col2, py);
  py += 12;
  doc.setFont("helvetica", "normal");
  doc.text(data.billTo.name || "-", col2, py);
  py += 12;
  const billLines = doc.splitTextToSize(data.billTo.address || "", 200);
  doc.text(billLines, col2, py);
  py += billLines.length * 11 + 2;
  doc.text(`GSTIN: ${data.billTo.gstin || "-"}`, col2, py);
  py += 12;
  doc.text(`State: ${data.billTo.state || "-"}`, col2, py);

  y = Math.max(y, py) + 24;

  const rows = data.items.map((item) => {
    const taxable = round2(item.qty * item.rate);
    const tax = round2((taxable * item.gstRate) / 100);
    const cgst = data.isInterState ? 0 : round2(tax / 2);
    const sgst = data.isInterState ? 0 : round2(tax / 2);
    const igst = data.isInterState ? tax : 0;
    const total = round2(taxable + tax);
    return [
      item.description || "-",
      item.hsn || "-",
      String(item.qty),
      formatINRForPdf(item.rate),
      `${item.gstRate}%`,
      data.isInterState ? formatINRForPdf(igst) : `${formatINRForPdf(cgst)} + ${formatINRForPdf(sgst)}`,
      formatINRForPdf(total),
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Description", "HSN/SAC", "Qty", "Rate", "GST", data.isInterState ? "IGST" : "CGST+SGST", "Amount"]],
    body: rows,
    styles: { fontSize: 8, cellPadding: 6 },
    headStyles: { fillColor: [79, 70, 229] },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable.finalY + 20;

  const taxableTotal = data.items.reduce((s, i) => s + round2(i.qty * i.rate), 0);
  const taxTotal = data.items.reduce(
    (s, i) => s + round2((round2(i.qty * i.rate) * i.gstRate) / 100),
    0
  );
  const grandTotal = round2(taxableTotal + taxTotal);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  let ty = finalY;
  doc.text(`Taxable Value: ${formatINRForPdf(taxableTotal)}`, pageWidth - margin, ty, { align: "right" });
  ty += 14;
  doc.text(`Total GST: ${formatINRForPdf(taxTotal)}`, pageWidth - margin, ty, { align: "right" });
  ty += 16;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Grand Total: ${formatINRForPdf(grandTotal)}`, pageWidth - margin, ty, { align: "right" });

  ty += 24;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  const words = doc.splitTextToSize(`Amount in words: ${numberToWordsINR(grandTotal)}`, pageWidth - margin * 2);
  doc.text(words, margin, ty);
  ty += words.length * 11 + 16;

  if (data.bankDetails) {
    doc.setFont("helvetica", "bold");
    doc.text("Bank Details:", margin, ty);
    ty += 12;
    doc.setFont("helvetica", "normal");
    const bankLines = doc.splitTextToSize(data.bankDetails, pageWidth - margin * 2);
    doc.text(bankLines, margin, ty);
    ty += bankLines.length * 11 + 12;
  }

  if (data.notes) {
    doc.setFont("helvetica", "bold");
    doc.text("Notes:", margin, ty);
    ty += 12;
    doc.setFont("helvetica", "normal");
    const noteLines = doc.splitTextToSize(data.notes, pageWidth - margin * 2);
    doc.text(noteLines, margin, ty);
  }

  doc.save(`Invoice-${data.invoiceNumber || "draft"}.pdf`);
}
