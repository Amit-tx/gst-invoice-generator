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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
        GST Calculator
      </h1>
      <p className="mt-2 text-slate-600">
        Add GST to a base amount, or find the base amount hidden inside a
        GST-inclusive total — for one item or many.
      </p>

      <div className="mt-6 inline-flex rounded-lg border border-slate-300 p-1 bg-slate-50">
        <button
          onClick={() => setMode("add")}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            mode === "add" ? "bg-[var(--brand)] text-white" : "text-slate-600"
          }`}
        >
          Add GST (exclusive → inclusive)
        </button>
        <button
          onClick={() => setMode("remove")}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            mode === "remove" ? "bg-[var(--brand)] text-white" : "text-slate-600"
          }`}
        >
          Remove GST (inclusive → exclusive)
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
            <tr>
              <th className="text-left px-3 py-3 font-semibold">Item</th>
              <th className="text-left px-3 py-3 font-semibold">
                {mode === "add" ? "Amount (excl. GST)" : "Amount (incl. GST)"}
              </th>
              <th className="text-left px-3 py-3 font-semibold">GST %</th>
              <th className="text-left px-3 py-3 font-semibold">Supply type</th>
              <th className="text-right px-3 py-3 font-semibold">Taxable value</th>
              <th className="text-right px-3 py-3 font-semibold">CGST</th>
              <th className="text-right px-3 py-3 font-semibold">SGST</th>
              <th className="text-right px-3 py-3 font-semibold">IGST</th>
              <th className="text-right px-3 py-3 font-semibold">Total</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, idx) => {
              const r = results[idx];
              return (
                <tr key={line.id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    <input
                      value={line.label}
                      onChange={(e) => updateLine(line.id, { label: e.target.value })}
                      placeholder={`Item ${idx + 1}`}
                      className="w-32 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={line.amount || ""}
                      onChange={(e) =>
                        updateLine(line.id, { amount: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0"
                      className="w-28 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={line.rate}
                      onChange={(e) => updateLine(line.id, { rate: parseFloat(e.target.value) })}
                      className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      {GST_SLABS.map((s) => (
                        <option key={s} value={s}>
                          {s}%
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={line.isInterState ? "inter" : "intra"}
                      onChange={(e) =>
                        updateLine(line.id, { isInterState: e.target.value === "inter" })
                      }
                      className="w-32 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      <option value="intra">Intra-state</option>
                      <option value="inter">Inter-state</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-slate-700">
                    {formatINR(r.taxableValue)}
                  </td>
                  <td className="px-3 py-2 text-right text-slate-600">{formatINR(r.cgst)}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{formatINR(r.sgst)}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{formatINR(r.igst)}</td>
                  <td className="px-3 py-2 text-right font-bold text-slate-900">
                    {formatINR(r.totalAmount)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => removeLine(line.id)}
                      className="text-slate-400 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={addLine}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-dark)]"
      >
        <Plus size={16} /> Add another item
      </button>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-500 mb-3">Summary</h3>
          <dl className="space-y-2 text-sm">
            <Row label="Total taxable value" value={formatINR(totals.taxableValue)} />
            <Row label="Total CGST" value={formatINR(totals.cgst)} />
            <Row label="Total SGST" value={formatINR(totals.sgst)} />
            <Row label="Total IGST" value={formatINR(totals.igst)} />
            <Row label="Total GST" value={formatINR(totals.totalTax)} />
          </dl>
        </div>
        <div className="rounded-xl bg-emerald-50 p-5 flex flex-col justify-center">
          <p className="text-sm font-semibold text-[var(--brand-dark)]">Grand total</p>
          <p className="text-3xl font-extrabold text-[var(--brand-dark)] mt-1">
            {formatINR(totals.totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-800">{value}</dd>
    </div>
  );
}
