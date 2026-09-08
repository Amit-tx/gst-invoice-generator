"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Receipt, Save, Share2 } from "lucide-react";
import { GST_SLABS, UNITS, formatINR, round2 } from "@/lib/gst";
import { generatePosReceiptPdf, sharePosReceiptPdf, PosItem, PaymentMode } from "@/lib/pos-receipt";

let idCounter = 1;
function newId() {
  return `pos-${idCounter++}`;
}

function emptyItem(): PosItem {
  return { id: newId(), name: "", qty: 1, unit: "pcs", price: 0, gstRate: 18 };
}

const SHOP_SETTINGS_KEY = "pos-shop-settings";
const LAST_BILL_KEY = "pos-last-bill-no";

export default function PosClient() {
  const [shopName, setShopName] = useState("");
  const [shopGstin, setShopGstin] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [isInterState, setIsInterState] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [billNo, setBillNo] = useState<number>(1);
  const [items, setItems] = useState<PosItem[]>([emptyItem()]);

  // Runs once after mount (client-only) — localStorage isn't available during
  // server rendering, so both the bill number and saved shop details load here.
  useEffect(() => {
    const storedBill = window.localStorage.getItem(LAST_BILL_KEY);
    if (storedBill) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from localStorage after mount, not a re-render loop
      setBillNo(parseInt(storedBill, 10) + 1);
    }

    const raw = window.localStorage.getItem(SHOP_SETTINGS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setShopName(parsed.shopName || "");
        setShopGstin(parsed.shopGstin || "");
        setShopAddress(parsed.shopAddress || "");
      } catch {
        // ignore corrupted storage
      }
    }
  }, []);

  function saveShopSettings() {
    window.localStorage.setItem(
      SHOP_SETTINGS_KEY,
      JSON.stringify({ shopName, shopGstin, shopAddress })
    );
  }

  const computed = useMemo(() => {
    const rows = items.map((item) => {
      const taxable = round2(item.qty * item.price);
      const tax = round2((taxable * item.gstRate) / 100);
      return { ...item, taxable, tax, total: round2(taxable + tax) };
    });
    const taxableTotal = rows.reduce((s, r) => s + r.taxable, 0);
    const taxTotal = rows.reduce((s, r) => s + r.tax, 0);
    return { rows, taxableTotal, taxTotal, grandTotal: round2(taxableTotal + taxTotal) };
  }, [items]);

  function updateItem(id: string, patch: Partial<PosItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }
  function removeItem(id: string) {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));
  }

  function currentSaleData() {
    const billNumber = `POS-${String(billNo).padStart(4, "0")}`;
    return { shopName, shopGstin, shopAddress, billNumber, isInterState, paymentMode, items };
  }

  function finishSale() {
    window.localStorage.setItem(LAST_BILL_KEY, String(billNo));
    setBillNo((n) => n + 1);
    setItems([emptyItem()]);
  }

  function handleDownload() {
    generatePosReceiptPdf(currentSaleData());
    finishSale();
  }

  async function handleShare() {
    const result = await sharePosReceiptPdf(currentSaleData());
    // Only reset the bill if the receipt actually went somewhere (shared or
    // downloaded). If the user cancelled the share sheet, keep the bill open.
    if (result !== "cancelled") {
      finishSale();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">POS Billing</h1>
      <p className="mt-2 text-[var(--text-sec)]">
        Quick point-of-sale billing for your shop counter — add items, hit
        checkout, get a printable receipt in seconds.
      </p>

      <details className="mt-6 rounded-xl border border-[var(--border)] p-4">
        <summary className="text-sm font-semibold text-[var(--text-main)] cursor-pointer">
          Shop details (saved on this device)
        </summary>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <input
            placeholder="Shop name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className={inputCls}
          />
          <input
            placeholder="GSTIN (optional)"
            value={shopGstin}
            onChange={(e) => setShopGstin(e.target.value.toUpperCase())}
            className={inputCls}
          />
          <input
            placeholder="Address"
            value={shopAddress}
            onChange={(e) => setShopAddress(e.target.value)}
            className={`${inputCls} sm:col-span-2`}
          />
          <select
            value={isInterState ? "inter" : "intra"}
            onChange={(e) => setIsInterState(e.target.value === "inter")}
            className={inputCls}
          >
            <option value="intra">Intra-state (CGST+SGST)</option>
            <option value="inter">Inter-state (IGST)</option>
          </select>
          <button
            onClick={saveShopSettings}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--accent)] border border-[var(--accent)] rounded-lg px-3 py-2 hover:bg-indigo-50"
          >
            <Save size={14} /> Save shop details
          </button>
        </div>
      </details>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <h3 className="text-sm font-bold text-[var(--text-main)]">Bill #POS-{String(billNo).padStart(4, "0")}</h3>
        <div className="flex rounded-full border border-[var(--border)] bg-[var(--subtotal-bg)] p-1">
          <button
            onClick={() => setPaymentMode("cash")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              paymentMode === "cash" ? "bg-[var(--btn-primary)] text-white" : "text-[var(--text-main)]"
            }`}
          >
            Cash
          </button>
          <button
            onClick={() => setPaymentMode("online")}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
              paymentMode === "online" ? "bg-[var(--btn-primary)] text-white" : "text-[var(--text-main)]"
            }`}
          >
            Online
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {computed.rows.map((row, idx) => (
          <div
            key={row.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <input
                value={row.name}
                onChange={(e) => updateItem(row.id, { name: e.target.value })}
                placeholder="Item name"
                className="flex-1 rounded-md border border-[var(--input-border)] px-3 py-2 text-sm font-medium"
                autoFocus={row.id === items[items.length - 1].id}
              />
              <button
                onClick={() => removeItem(row.id)}
                className="shrink-0 text-[var(--text-sec)] hover:text-red-500 p-1"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-sec)] mb-1">Qty</label>
                <input
                  type="number"
                  value={row.qty}
                  onChange={(e) => updateItem(row.id, { qty: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border border-[var(--input-border)] px-2 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-sec)] mb-1">Unit</label>
                <select
                  value={row.unit}
                  onChange={(e) => updateItem(row.id, { unit: e.target.value })}
                  className="w-full rounded-md border border-[var(--input-border)] px-2 py-2 text-sm"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-sec)] mb-1">Price</label>
                <input
                  type="number"
                  value={row.price || ""}
                  onChange={(e) => updateItem(row.id, { price: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full rounded-md border border-[var(--input-border)] px-2 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-[var(--text-sec)] mb-1">GST %</label>
                <select
                  value={row.gstRate}
                  onChange={(e) => updateItem(row.id, { gstRate: parseFloat(e.target.value) })}
                  className="w-full rounded-md border border-[var(--input-border)] px-2 py-2 text-sm"
                >
                  {GST_SLABS.map((s) => (
                    <option key={s} value={s}>{s}%</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
              <span className="text-xs text-[var(--text-sec)]">Item {idx + 1}</span>
              <span className="font-bold text-[var(--text-main)]">{formatINR(row.total)}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
      >
        <Plus size={16} /> Add item
      </button>

      <div className="mt-8 grid sm:grid-cols-2 gap-4 items-stretch">
        <div className="rounded-xl bg-indigo-50 p-5">
          <p className="text-sm font-semibold text-[var(--text-main)]">Grand total</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] mt-1">
            {formatINR(computed.grandTotal)}
          </p>
          <p className="text-xs text-[var(--text-sec)] mt-1">
            Taxable: {formatINR(computed.taxableTotal)} · GST: {formatINR(computed.taxTotal)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleShare}
            className="rounded-lg bg-[var(--btn-primary)] text-white font-semibold px-6 py-3 hover:bg-[var(--btn-primary-hover)] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Share2 size={18} /> Share / Save Receipt
          </button>
          <button
            onClick={handleDownload}
            className="rounded-lg border border-[var(--input-border)] text-[var(--text-main)] font-semibold px-6 py-3 hover:bg-[var(--subtotal-bg)] transition-colors inline-flex items-center justify-center gap-2"
          >
            <Receipt size={18} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-[var(--input-border)] px-3 py-2 text-sm";
