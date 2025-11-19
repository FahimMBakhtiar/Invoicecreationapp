import { Invoice } from '../types/invoice.types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Pencil, Printer, Download, Instagram } from 'lucide-react';
import atobLogo from 'figma:asset/c1a850e885b460d6ebe9f5090d5abbb6b2c2cd14.png';

interface InvoicePreviewProps {
  invoice: Invoice;
  onEdit: () => void;
}

// Helper function to format numbers with commas
function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function InvoicePreview({ invoice, onEdit }: InvoicePreviewProps) {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
  const tax = subtotal * (invoice.taxRate / 100);
  const totalBeforeDiscount = subtotal + tax;
  const total = totalBeforeDiscount - invoice.discount;
  const dueAmount = total - invoice.advancePaid;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, this would generate a PDF
    alert('PDF download functionality would be implemented here');
  };

  return (
    <Card className="print:shadow-none print:border-0">
      {/* Header with Logo */}
      <div className="bg-gradient-to-r from-[#1A5872] to-[#0D2F3F] p-8 print:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              <img src={atobLogo} alt="AtoB Logo" className="h-12 w-auto" />
            </div>
            <div className="border-l-2 border-[#F5B942] pl-4">
              <h1 className="text-white">INVOICE</h1>
              <p className="text-[#F5B942]">#{invoice.invoiceNumber}</p>
            </div>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="secondary" size="sm" onClick={onEdit} className="gap-2">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8 print:p-6">
        {/* Business and Customer Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="inline-block bg-[#F5B942] px-3 py-1 rounded mb-2">
              <p className="text-[#1A5872]">From</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-900">{invoice.businessName}</p>
              {invoice.businessEmail && <p className="text-slate-600">{invoice.businessEmail}</p>}
              {invoice.businessPhone && <p className="text-slate-600">{invoice.businessPhone}</p>}
              {invoice.businessAddress && (
                <p className="text-slate-600 whitespace-pre-line">{invoice.businessAddress}</p>
              )}
              <div className="pt-2">
                <a 
                  href="https://www.instagram.com/anything2bd/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#1A5872] hover:text-[#F5B942] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@anything2bd</span>
                </a>
              </div>
            </div>
          </div>

          <div>
            <div className="inline-block bg-[#1A5872] px-3 py-1 rounded mb-2">
              <p className="text-white">Bill To</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-900">{invoice.customerName}</p>
              {invoice.customerEmail && <p className="text-slate-600">{invoice.customerEmail}</p>}
              {invoice.customerAddress && (
                <p className="text-slate-600 whitespace-pre-line">{invoice.customerAddress}</p>
              )}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
          <div>
            <p className="text-slate-500">Invoice Date</p>
            <p className="text-slate-900">{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-slate-500">Due Date</p>
            <p className="text-slate-900">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        <Separator className="bg-[#F5B942]" />

        {/* Line Items Table */}
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1A5872] text-white">
                  <th className="text-left py-3 px-4">Item</th>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Size</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Unit Cost</th>
                  <th className="text-right py-3 px-4">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                  >
                    <td className="py-3 px-4 text-slate-900">{item.itemName}</td>
                    <td className="py-3 px-4 text-slate-600 whitespace-pre-line">{item.description}</td>
                    <td className="py-3 px-4 text-slate-600">{item.size}</td>
                    <td className="py-3 px-4 text-right text-slate-600">{item.quantity.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-slate-600">৳{formatCurrency(item.unitCost)}</td>
                    <td className="py-3 px-4 text-right text-slate-900">৳{formatCurrency(item.quantity * item.unitCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="mt-8 flex justify-end">
            <div className="w-full md:w-80 space-y-3">
              <div className="flex justify-between text-slate-600 py-2 border-b border-slate-200">
                <span>Net Subtotal</span>
                <span>৳{formatCurrency(subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-slate-600 py-2 border-b border-slate-200">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>৳{formatCurrency(tax)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between text-slate-600 py-2 border-b border-slate-200">
                  <span>Discount</span>
                  <span>-৳{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between bg-[#1A5872] text-white p-4 rounded-lg">
                <span>Total</span>
                <span>৳{formatCurrency(total)}</span>
              </div>
              {invoice.advancePaid > 0 && (
                <div className="flex justify-between text-slate-600 py-2 border-b border-slate-200">
                  <span>Advance Paid</span>
                  <span>৳{formatCurrency(invoice.advancePaid)}</span>
                </div>
              )}
              <div className="flex justify-between bg-[#F5B942] text-[#1A5872] p-4 rounded-lg">
                <span>Due Amount</span>
                <span>৳{formatCurrency(dueAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <>
            <Separator className="bg-slate-200" />
            <div>
              <div className="inline-block bg-[#1A5872] px-3 py-1 rounded mb-2">
                <p className="text-white text-sm">Notes</p>
              </div>
              <p className="text-slate-600 whitespace-pre-line">{invoice.notes}</p>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm print:mt-12 pt-8 border-t border-[#F5B942]">
          <p>Thank you for your business!</p>
          <div className="flex items-center justify-center gap-2 text-xs mt-1">
            <p>Powered by ANYTHING TO BANGLADESH</p>
            <span>•</span>
            <a 
              href="https://www.instagram.com/anything2bd/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#1A5872]"
            >
              <Instagram className="w-3 h-3" />
              @anything2bd
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}
