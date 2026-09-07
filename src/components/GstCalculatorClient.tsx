"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  GST_SLABS,
  GstLineInput,
  GstMode,
  calculateAll,
  formatINR,
  summarize,
} from "@/lib/gst";

let idCounter = 1;
function newId() {
  return `line-${idCounter++}`;
}

function emptyLine(): GstLineInput {
  return { id: newId(), label: "", amount: 0, rate: 18, isInterState: false };
}

export default function GstCalculatorClient() {
  const [mode, setMode] = useState<GstMode>("add");
  const [lines, setLines] = useState<GstLineInput[]>([emptyLine()]);

  const results = useMemo(() => calculateAll(lines, mode), [lines, mode]);
  const totals = useMemo(() => summarize(results), [results]);

  function updateLine(id: string, patch: Partial<GstLineInput>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }
  function removeLine(id: string) {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.id !== id) : prev));
  }

  const formula =
    mode === "add"
      ? "Add GST: GST = Base × Rate / 100"
      : "Remove GST: Base = Total / (1 + Rate / 100)";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
        GST Calculator
      </h1>
      <p className="mt-2 text-[var(--text-sec)]">
        Add GST to a base amount, or find the base amount hidden inside a
        GST-inclusive total — for one item or many.
      </p>

      {/* Mode toggle */}
      <div className="mt-6 flex rounded-2xl border border-[var(--border)] bg-[var(--subtotal-bg)] p-1">
        <button
          onClick={() => setMode("add")}
          className={`flex-1 rounded-xl py-3 text-center transition-colors ${
            mode === "add" ? "bg-[var(--card-bg)] shadow-sm" : ""
          }`}
        >
          <span className="block font-bold text-[var(--text-main)]">Exclusive</span>
          <span className="block text-xs text-[var(--text-sec)]">Add GST</span>
        </button>
        <button
          onClick={() => setMode("remove")}
          className={`flex-1 rounded-xl py-3 text-center transition-colors ${
            mode === "remove" ? "bg-[var(--card-bg)] shadow-sm" : ""
          }`}
        >
          <span className="block font-bold text-[var(--text-main)]">Inclusive</span>
          <span className="block text-xs text-[var(--text-sec)]">Remove GST</span>
        </button>
      </div>

      {/* Formula box */}
      <div className="mt-4 rounded-xl border px-4 py-3 text-sm font-medium"
        style={{
          background: "var(--formula-bg)",
          borderColor: "var(--formula-border)",
          color: "var(--formula-text)",
        }}
      >
        {formula}
      </div>

      {/* Items */}
      <div className="mt-6 space-y-4">
        {lines.map((line, idx) => {
          const r = results[idx];
          return (
            <div
              key={line.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <input
                  value={line.label}
                  onChange={(e) => updateLine(line.id, { label: e.target.value })}
                  placeholder={`Item ${idx + 1}`}
                  className="text-sm font-semibold text-[var(--text-main)] border-none bg-transparent focus:outline-none"
                />
                {lines.length > 1 && (
                  <button onClick={() => removeLine(line.id)} className="text-[var(--text-sec)] hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <label className="block text-xs font-bold uppercase tracking-wide text-[var(--text-sec)] mb-2">
                {mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"}
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--input-border)] px-4 py-3 mb-4">
                <span className="text-[var(--text-sec)]">₹</span>
                <input
                  type="number"
                  value={line.amount || ""}
                  onChange={(e) => updateLine(line.id, { amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-full text-lg font-bold text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <label className="block text-xs font-bold uppercase tracking-wide text-[var(--text-sec)] mb-2">
                GST Rate
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {GST_SLABS.filter((s) => s > 0).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateLine(line.id, { rate: s })}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      line.rate === s
                        ? "bg-[var(--btn-primary)] text-white"
                        : "border border-[var(--input-border)] text-[var(--text-main)] hover:bg-[var(--subtotal-bg)]"
                    }`}
                  >
                    {s}%
                  </button>
                ))}
              </div>

              <label className="block text-xs font-bold uppercase tracking-wide text-[var(--text-sec)] mb-2">
                Supply Type
              </label>
              <select
                value={line.isInterState ? "inter" : "intra"}
                onChange={(e) => updateLine(line.id, { isInterState: e.target.value === "inter" })}
                className="w-full rounded-xl border border-[var(--input-border)] px-4 py-2.5 text-sm mb-5"
              >
                <option value="intra">Intra-state (CGST + SGST)</option>
                <option value="inter">Inter-state (IGST)</option>
              </select>

              <div className="rounded-xl bg-[var(--subtotal-bg)] p-4 space-y-1.5 text-sm">
                <Row label="Taxable value" value={formatINR(r.taxableValue)} />
                {line.isInterState ? (
                  <Row label="IGST" value={formatINR(r.igst)} />
                ) : (
                  <>
                    <Row label="CGST" value={formatINR(r.cgst)} />
                    <Row label="SGST" value={formatINR(r.sgst)} />
                  </>
                )}
                <div className="pt-1.5 mt-1.5 border-t border-[var(--border)]">
                  <Row label="Total" value={formatINR(r.totalAmount)} bold />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={addLine}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)]"
      >
        <Plus size={16} /> Add another item
      </button>

      {lines.length > 1 && (
        <div className="mt-8 rounded-2xl p-5" style={{ background: "#111827" }}>
          <p className="text-sm font-semibold text-gray-300">Grand total ({lines.length} items)</p>
          <p className="text-3xl font-extrabold text-white mt-1">{formatINR(totals.totalAmount)}</p>
          <p className="text-xs text-gray-400 mt-1">
            Taxable: {formatINR(totals.taxableValue)} · GST: {formatINR(totals.totalTax)}
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--text-sec)]">{label}</span>
      <span className={bold ? "font-extrabold text-[var(--text-main)] text-base" : "font-semibold text-[var(--text-main)]"}>
        {value}
      </span>
    </div>
  );
}
