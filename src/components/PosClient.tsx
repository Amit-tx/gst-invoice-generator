"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Receipt, Save } from "lucide-react";
import { GST_SLABS, formatINR, round2 } from "@/lib/gst";
import { generatePosReceiptPdf, PosItem } from "@/lib/pos-receipt";

let idCounter = 1;
function newId() {
  return `pos-${idCounter++}`;
}

function emptyItem(): PosItem {
  return { id: newId(), name: "", qty: 1, price: 0, gstRate: 18 };
}

function nextBillNumber() {
  const stored =
    typeof window !== "undefined" ? window.localStorage.getItem("pos-last-bill-no") : null;
  const n = stored ? parseInt(stored, 10) + 1 : 1;
  return n;
}

export default function PosClient() {
  const [shopName, setShopName] = useState("");
  const [shopGstin, setShopGstin] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [isInterState, setIsInterState] = useState(false);
  const [billNo, setBillNo] = useState<number>(() => nextBillNumber());
  const [items, setItems] = useState<PosItem[]>([emptyItem()]);

  const shopSettingsKey = "pos-shop-settings";

  useMemo(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(shopSettingsKey);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveShopSettings() {
    window.localStorage.setItem(
      shopSettingsKey,
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

  function handleCheckout() {
    const billNumber = `POS-${String(billNo).padStart(4, "0")}`;
    generatePosReceiptPdf({
      shopName,
      shopGstin,
      shopAddress,
      billNumber,
      isInterState,
      items,
    });
    window.localStorage.setItem("pos-last-bill-no", String(billNo));
    setBillNo((n) => n + 1);
    setItems([emptyItem()]);
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

      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text-main)]">Bill #POS-{String(billNo).padStart(4, "0")}</h3>
      </div>

      <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-[var(--subtotal-bg)] text-[var(--text-sec)] text-xs uppercase">
            <tr>
              <th className="text-left px-3 py-3 font-semibold">Item</th>
              <th className="text-left px-3 py-3 font-semibold">Qty</th>
              <th className="text-left px-3 py-3 font-semibold">Price</th>
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
                    value={row.name}
                    onChange={(e) => updateItem(row.id, { name: e.target.value })}
                    placeholder="Item name"
                    className="w-36 rounded-md border border-[var(--input-border)] px-2 py-1.5 text-sm"
                    autoFocus={row.id === items[items.length - 1].id}
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
                    value={row.price || ""}
                    onChange={(e) => updateItem(row.id, { price: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
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

      <div className="mt-8 grid sm:grid-cols-2 gap-4 items-center">
        <div className="rounded-xl bg-indigo-50 p-5">
          <p className="text-sm font-semibold text-[var(--text-main)]">Grand total</p>
          <p className="text-3xl font-extrabold text-[var(--text-main)] mt-1">
            {formatINR(computed.grandTotal)}
          </p>
          <p className="text-xs text-[var(--text-sec)] mt-1">
            Taxable: {formatINR(computed.taxableTotal)} · GST: {formatINR(computed.taxTotal)}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          className="rounded-lg bg-[var(--btn-primary)] text-white font-semibold px-6 py-4 hover:bg-[var(--btn-primary-hover)] transition-colors inline-flex items-center justify-center gap-2"
        >
          <Receipt size={18} /> Checkout & Print Receipt
        </button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-[var(--input-border)] px-3 py-2 text-sm";
