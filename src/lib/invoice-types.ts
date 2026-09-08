export interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  unit: string;
  rate: number;
  gstRate: number;
}

export interface Party {
  name: string;
  gstin: string;
  address: string;
  state: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  isInterState: boolean;
  logoDataUrl: string | null;
  seller: Party;
  billTo: Party;
  shipTo: Party;
  sameAsShipTo: boolean;
  items: InvoiceItem[];
  notes: string;
  bankDetails: string;
}

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];
