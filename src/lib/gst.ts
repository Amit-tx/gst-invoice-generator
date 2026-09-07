export type GstMode = "add" | "remove";

export interface GstLineInput {
  id: string;
  label: string;
  amount: number; // base amount (add mode) or gross amount (remove mode)
  rate: number; // GST % e.g. 18
  isInterState: boolean; // true => IGST, false => CGST+SGST split
}

export interface GstLineResult extends GstLineInput {
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalAmount: number;
}

export const GST_SLABS = [0, 0.25, 3, 5, 12, 18, 28] as const;

export function calculateLine(input: GstLineInput, mode: GstMode): GstLineResult {
  const rate = input.rate;
  let taxableValue: number;
  let totalAmount: number;

  if (mode === "add") {
    taxableValue = input.amount;
    totalAmount = taxableValue * (1 + rate / 100);
  } else {
    totalAmount = input.amount;
    taxableValue = totalAmount / (1 + rate / 100);
  }

  const totalTax = totalAmount - taxableValue;
  const cgst = input.isInterState ? 0 : totalTax / 2;
  const sgst = input.isInterState ? 0 : totalTax / 2;
  const igst = input.isInterState ? totalTax : 0;

  return {
    ...input,
    taxableValue: round2(taxableValue),
    cgst: round2(cgst),
    sgst: round2(sgst),
    igst: round2(igst),
    totalTax: round2(totalTax),
    totalAmount: round2(totalAmount),
  };
}

export function calculateAll(inputs: GstLineInput[], mode: GstMode): GstLineResult[] {
  return inputs.map((i) => calculateLine(i, mode));
}

export function summarize(results: GstLineResult[]) {
  return results.reduce(
    (acc, r) => {
      acc.taxableValue += r.taxableValue;
      acc.cgst += r.cgst;
      acc.sgst += r.sgst;
      acc.igst += r.igst;
      acc.totalTax += r.totalTax;
      acc.totalAmount += r.totalAmount;
      return acc;
    },
    { taxableValue: 0, cgst: 0, sgst: 0, igst: 0, totalTax: 0, totalAmount: 0 }
  );
}

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * jsPDF's built-in Helvetica font cannot render the ₹ glyph (it prints a
 * garbled superscript instead). Use this "Rs." formatter for anything drawn
 * directly onto a PDF via doc.text(); use formatINR() everywhere else (web UI).
 */
export function formatINRForPdf(n: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(n);
  return `Rs. ${formatted}`;
}

const GSTIN_CODE_MAP = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Validates a GSTIN's format AND its checksum (15th character).
 * GSTIN checksum uses a modified ISO 7064 MOD-36 algorithm.
 */
export function validGstin(gstin: string): boolean {
  const value = gstin.trim().toUpperCase();
  const formatRe = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!formatRe.test(value)) return false;
  return computeGstinChecksum(value.slice(0, 14)) === value[14];
}

/** Returns the expected 15th (checksum) character for the first 14 chars of a GSTIN. */
export function computeGstinChecksum(first14: string): string {
  const factor = 2;
  const modulus = 36;
  let sum = 0;

  for (let i = 0; i < first14.length; i++) {
    const codePoint = GSTIN_CODE_MAP.indexOf(first14[i]);
    const f = i % 2 === 0 ? 1 : factor;
    let product = codePoint * f;
    product = Math.floor(product / modulus) + (product % modulus);
    sum += product;
  }

  const checksumIndex = (modulus - (sum % modulus)) % modulus;
  return GSTIN_CODE_MAP[checksumIndex];
}

/** Returns why a GSTIN is invalid, or null if it's valid — useful for inline error messages. */
export function gstinError(gstin: string): string | null {
  const value = gstin.trim().toUpperCase();
  if (!value) return null;
  const formatRe = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (value.length !== 15) return "GSTIN must be exactly 15 characters.";
  if (!formatRe.test(value)) return "GSTIN format is invalid (expected: 22AAAAA0000A1Z5).";
  if (computeGstinChecksum(value.slice(0, 14)) !== value[14]) {
    return "GSTIN checksum doesn't match — please re-check the number.";
  }
  return null;
}

export function numberToWordsINR(amount: number): string {
  const num = Math.floor(amount);
  const decimals = Math.round((amount - num) * 100);
  if (num === 0 && decimals === 0) return "Zero Rupees Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function twoDigit(n: number): string {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  }
  function threeDigit(n: number): string {
    if (n < 100) return twoDigit(n);
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + twoDigit(n % 100) : "");
  }

  function convert(n: number): string {
    if (n === 0) return "";
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const hundred = n;

    let str = "";
    if (crore) str += threeDigit(crore) + " Crore ";
    if (lakh) str += threeDigit(lakh) + " Lakh ";
    if (thousand) str += threeDigit(thousand) + " Thousand ";
    if (hundred) str += threeDigit(hundred) + " ";
    return str.trim();
  }

  let result = convert(num) + " Rupees";
  if (decimals > 0) {
    result += " and " + convert(decimals) + " Paise";
  }
  return result + " Only";
}
