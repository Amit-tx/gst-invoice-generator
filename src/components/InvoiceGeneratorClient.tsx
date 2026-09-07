"use client";

import { useMemo, useRef, useState } from "react";
import { Plus, Trash2, Upload, Download, AlertCircle } from "lucide-react";
import { INDIAN_STATES, InvoiceData, InvoiceItem, Party } from "@/lib/invoice-types";
import { GST_SLABS, formatINR, round2, gstinError, numberToWordsINR } from "@/lib/gst";
import { generateInvoicePdf } from "@/lib/invoice-pdf";

let idCounter = 1;
function newId() {
  return `item-${idCounter++}`;
}

function emptyParty(): Party {
  return { name: "", gstin: "", address: "", state: "" };
}

function emptyItem(): InvoiceItem {
  return { id: newId(), description: "", hsn: "", qty: 1, rate: 0, gstRate: 18 };
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function InvoiceGeneratorClient() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [invoiceDate, setInvoiceDate] = useState(todayStr());
  const [dueDate, setDueDate] = useState("");
  const [isInterState, setIsInterState] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [seller, setSeller] = useState<Party>(emptyParty());
  const [billTo, setBillTo] = useState<Party>(emptyParty());
  const [shipTo, setShipTo] = useState<Party>(emptyParty());
  const [sameAsShipTo, setSameAsShipTo] = useState(true);
  const [items, setItems] = useState<InvoiceItem[]>([emptyItem()]);
  const [notes, setNotes] = useState("");
  const [bankDetails, setBankDetails] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gstinWarnings = useMemo(() => {
    const warns: string[] = [];
    const sellerErr = gstinError(seller.gstin);
    const billToErr = gstinError(billTo.gstin);
    if (sellerErr) warns.push(`Seller: ${sellerErr}`);
    if (billToErr) warns.push(`Bill-to: ${billToErr}`);
    return warns;
  }, [seller.gstin, billTo.gstin]);

  const computed = useMemo(() => {
    const rows = items.map((item) => {
      const taxable = round2(item.qty * item.rate);
      const tax = round2((taxable * item.gstRate) / 100);
      const cgst = isInterState ? 0 : round2(tax / 2);
      const sgst = isInterState ? 0 : round2(tax / 2);
      const igst = isInterState ? tax : 0;
      return { ...item, taxable, tax, cgst, sgst, igst, total: round2(taxable + tax) };
    });
    const taxableTotal = rows.reduce((s, r) => s + r.taxable, 0);
    const taxTotal = rows.reduce((s, r) => s + r.tax, 0);
    const grandTotal = round2(taxableTotal + taxTotal);
    return { rows, taxableTotal, taxTotal, grandTotal };
  }, [items, isInterState]);

  function updateItem(id: string, patch: Partial<InvoiceItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }
  function removeItem(id: string) {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleDownload() {
    const data: InvoiceData = {
      invoiceNumber,
      invoiceDate,
      dueDate,
      isInterState,
      logoDataUrl,
      seller,
      billTo,
      shipTo: sameAsShipTo ? billTo : shipTo,
      sameAsShipTo,
      items,
      notes,
      bankDetails,
    };
    generateInvoicePdf(data);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">Invoice Generator</h1>
      <p className="mt-2 text-[var(--text-sec)]">
        Fill in your business and customer details to generate a GST-compliant
        invoice with automatic tax calculation.
      </p>

      {gstinWarnings.length > 0 && (
        <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex gap-2 text-sm text-amber-800">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div className="space-y-1">
            {gstinWarnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        </div>
      )}

      {/* Logo + invoice meta */}
      <section className="mt-8 grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-[var(--text-main)] mb-2">Company logo</label>
          <div className="flex items-center gap-4">
            {logoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoDataUrl} alt="Logo preview" className="h-16 w-16 object-contain rounded border border-[var(--border)]" />
            ) : (
              <div className="h-16 w-16 rounded border border-dashed border-[var(--input-border)] flex items-center justify-center text-[var(--text-sec)] text-xs">
                No logo
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] border border-[var(--accent)] rounded-lg px-3 py-2 hover:bg-indigo-50"
            >
              <Upload size={14} /> Upload logo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Invoice number">
            <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Invoice date">
            <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Due date">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
          </Field>
          <Field label="Supply type">
            <select
              value={isInterState ? "inter" : "intra"}
              onChange={(e) => setIsInterState(e.target.value === "inter")}
              className={inputCls}
            >
              <option value="intra">Intra-state (CGST+SGST)</option>
              <option value="inter">Inter-state (IGST)</option>
            </select>
          </Field>
        </div>
      </section>

      {/* Parties */}
      <section className="mt-8 grid sm:grid-cols-3 gap-6">
        <PartyForm title="Seller (your business)" party={seller} onChange={setSeller} />
        <PartyForm title="Bill To (customer)" party={billTo} onChange={setBillTo} />
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-[var(--text-main)]">Ship To</h3>
            <label className="flex items-center gap-1.5 text-xs text-[var(--text-sec)]">
              <input
                type="checkbox"
                checked={sameAsShipTo}
                onChange={(e) => setSameAsShipTo(e.target.checked)}
              />
              Same as Bill To
            </label>
          </div>
          {!sameAsShipTo && <PartyForm title="" party={shipTo} onChange={setShipTo} hideTitle />}
        </div>
      </section>

      {/* Items table */}
      <section className="mt-10">
        <h3 className="text-sm font-bold text-[var(--text-main)] mb-3">Line items</h3>
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="bg-[var(--subtotal-bg)] text-[var(--text-sec)] text-xs uppercase">
              <tr>
                <th className="text-left px-3 py-3 font-semibold">Description</th>
                <th className="text-left px-3 py-3 font-semibold">HSN/SAC</th>
                <th className="text-left px-3 py-3 font-semibold">Qty</th>
                <th className="text-left px-3 py-3 font-semibold">Rate</th>
                <th className="text-left px-3 py-3 font-semibold">GST %</th>
                <th className="text-right px-3 py-3 font-semibold">Amount</th>
                <th className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {computed.rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--border)]">
                  <td className="px-3 py-2">
                    <input
                      value={row.description}
                      onChange={(e) => updateItem(row.id, { description: e.target.value })}
                      placeholder="Item / service"
                      className="w-40 rounded-md border border-[var(--input-border)] px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={row.hsn}
                      onChange={(e) => updateItem(row.id, { hsn: e.target.value })}
                      placeholder="0000"
                      className="w-20 rounded-md border border-[var(--input-border)] px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.qty}
                      onChange={(e) => updateItem(row.id, { qty: parseFloat(e.target.value) || 0 })}
                      className="w-16 rounded-md border border-[var(--input-border)] px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={row.rate}
                      onChange={(e) => updateItem(row.id, { rate: parseFloat(e.target.value) || 0 })}
                      className="w-24 rounded-md border border-[var(--input-border)] px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={row.gstRate}
                      onChange={(e) => updateItem(row.id, { gstRate: parseFloat(e.target.value) })}
                      className="w-20 rounded-md border border-[var(--input-border)] px-2 py-1.5 text-sm"
                    >
                      {GST_SLABS.map((s) => (
                        <option key={s} value={s}>{s}%</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-[var(--text-main)]">
                    {formatINR(row.total)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => removeItem(row.id)} className="text-[var(--text-sec)] hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={addItem}
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
        >
          <Plus size={16} /> Add item
        </button>
      </section>

      {/* Notes + bank details */}
      <section className="mt-8 grid sm:grid-cols-2 gap-6">
        <Field label="Bank details (optional)">
          <textarea value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} rows={3} className={inputCls} />
        </Field>
        <Field label="Notes / terms (optional)">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputCls} />
        </Field>
      </section>

      {/* Totals + download */}
      <section className="mt-8 grid sm:grid-cols-2 gap-4 items-start">
        <div className="rounded-xl border border-[var(--border)] p-5 text-sm space-y-2">
          <Row label="Taxable value" value={formatINR(computed.taxableTotal)} />
          <Row label="Total GST" value={formatINR(computed.taxTotal)} />
          <Row label="Grand total" value={formatINR(computed.grandTotal)} bold />
          <p className="text-xs text-[var(--text-sec)] pt-2 border-t border-[var(--border)] mt-2">
            {numberToWordsINR(computed.grandTotal)}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="rounded-lg bg-[var(--btn-primary)] text-white font-semibold px-6 py-4 hover:bg-[var(--btn-primary-hover)] transition-colors inline-flex items-center justify-center gap-2 h-fit"
        >
          <Download size={18} /> Download PDF Invoice
        </button>
      </section>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-[var(--input-border)] px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[var(--text-sec)] mb-1">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--text-sec)]">{label}</span>
      <span className={bold ? "font-extrabold text-[var(--text-main)] text-lg" : "font-semibold text-[var(--text-main)]"}>
        {value}
      </span>
    </div>
  );
}

function PartyForm({
  title,
  party,
  onChange,
  hideTitle,
}: {
  title: string;
  party: Party;
  onChange: (p: Party) => void;
  hideTitle?: boolean;
}) {
  return (
    <div>
      {!hideTitle && <h3 className="text-sm font-bold text-[var(--text-main)] mb-2">{title}</h3>}
      <div className="space-y-2">
        <input
          placeholder="Business / customer name"
          value={party.name}
          onChange={(e) => onChange({ ...party, name: e.target.value })}
          className={inputCls}
        />
        <input
          placeholder="GSTIN"
          value={party.gstin}
          onChange={(e) => onChange({ ...party, gstin: e.target.value.toUpperCase() })}
          className={inputCls}
        />
        <textarea
          placeholder="Address"
          value={party.address}
          onChange={(e) => onChange({ ...party, address: e.target.value })}
          rows={2}
          className={inputCls}
        />
        <select
          value={party.state}
          onChange={(e) => onChange({ ...party, state: e.target.value })}
          className={inputCls}
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
