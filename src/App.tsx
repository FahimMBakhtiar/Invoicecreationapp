import { useState } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { Button } from './components/ui/button';
import { FileText, Plus } from 'lucide-react';
import atobLogo from 'figma:asset/c1a850e885b460d6ebe9f5090d5abbb6b2c2cd14.png';

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
}

// Generate invoice number in format: YYYYMMDD001
function generateInvoiceNumber(existingInvoices: Invoice[]): string {
  const today = new Date();
  const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // Find all invoices with today's date prefix
  const todaysInvoices = existingInvoices.filter(inv => 
    inv.invoiceNumber.startsWith(datePrefix)
  );
  
  // Get the highest sequence number for today
  const sequenceNumbers = todaysInvoices.map(inv => {
    const seqStr = inv.invoiceNumber.slice(8); // Get last 3 digits
    return parseInt(seqStr) || 0;
  });
  
  const nextSequence = Math.max(0, ...sequenceNumbers) + 1;
  const sequenceStr = nextSequence.toString().padStart(3, '0');
  
  return `${datePrefix}${sequenceStr}`;
}

export default function App() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoices');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveInvoice = (invoice: Invoice) => {
    const updatedInvoices = invoices.some(inv => inv.id === invoice.id)
      ? invoices.map(inv => inv.id === invoice.id ? invoice : inv)
      : [...invoices, invoice];
    
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setCurrentInvoice(invoice);
    setIsEditing(false);
  };

  const handleNewInvoice = () => {
    setCurrentInvoice(null);
    setIsEditing(true);
  };

  const handleEditInvoice = () => {
    setIsEditing(true);
  };

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(inv => inv.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    if (currentInvoice?.id === id) {
      setCurrentInvoice(null);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-[#1A5872] p-2 rounded-lg">
              <FileText className="w-6 h-6 text-[#F5B942]" />
            </div>
            <div>
              <h1>Invoice Manager</h1>
              <p className="text-slate-600">Create and manage your business invoices</p>
            </div>
          </div>
          <Button onClick={handleNewInvoice} className="gap-2 bg-[#1A5872] hover:bg-[#143F52]">
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <h2 className="mb-4">Saved Invoices</h2>
              {invoices.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No invoices yet. Create your first one!</p>
              ) : (
                <div className="space-y-2">
                  {invoices.map(invoice => (
                    <div
                      key={invoice.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        currentInvoice?.id === invoice.id
                          ? 'bg-[#1A5872]/10 border-[#1A5872]'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                      onClick={() => {
                        setCurrentInvoice(invoice);
                        setIsEditing(false);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-slate-900">#{invoice.invoiceNumber}</p>
                          <p className="text-slate-600 text-sm">{invoice.customerName}</p>
                          <p className="text-slate-500 text-sm">{invoice.date}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteInvoice(invoice.id);
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {isEditing ? (
              <InvoiceForm
                invoice={currentInvoice}
                onSave={handleSaveInvoice}
                onCancel={() => setIsEditing(false)}
                generateInvoiceNumber={() => generateInvoiceNumber(invoices)}
              />
            ) : currentInvoice ? (
              <InvoicePreview
                invoice={currentInvoice}
                onEdit={handleEditInvoice}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-slate-900 mb-2">No Invoice Selected</h3>
                <p className="text-slate-600 mb-6">Select an invoice from the list or create a new one to get started</p>
                <Button onClick={handleNewInvoice} className="gap-2 bg-[#1A5872] hover:bg-[#143F52]">
                  <Plus className="w-4 h-4" />
                  Create New Invoice
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { generateInvoiceNumber, atobLogo };