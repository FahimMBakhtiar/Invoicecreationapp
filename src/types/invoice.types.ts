export interface LineItem {
  id: string;
  itemName: string;
  description: string;
  size: string;
  quantity: number;
  unitCost: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  lineItems: LineItem[];
  notes: string;
  taxRate: number;
  discount: number;
  advancePaid: number;
  createdAt?: string;
  updatedAt?: string;
}

