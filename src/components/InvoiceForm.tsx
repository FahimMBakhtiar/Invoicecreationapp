import { useState, useEffect } from 'react';
import { Invoice, LineItem } from '../types/invoice.types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { Plus, Trash2, Loader2 } from 'lucide-react';

interface InvoiceFormProps {
  invoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  generateInvoiceNumber: () => Promise<string>;
}

export function InvoiceForm({ invoice, onSave, onCancel, generateInvoiceNumber }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Invoice | null>(null);
  const [isLoadingInvoiceNumber, setIsLoadingInvoiceNumber] = useState(false);

  useEffect(() => {
    const initializeForm = async () => {
      if (invoice) {
        setFormData(invoice);
      } else {
        setIsLoadingInvoiceNumber(true);
        try {
          const invoiceNumber = await generateInvoiceNumber();
          setFormData({
            id: crypto.randomUUID(),
            invoiceNumber,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            businessName: 'Anything2BD',
            businessEmail: 'anything2bd@gmail.com',
            businessPhone: '',
            businessAddress: '',
            customerName: '',
            customerEmail: '',
            customerAddress: '',
            lineItems: [
              { id: crypto.randomUUID(), itemName: '', description: '', size: '', quantity: 1, unitCost: 0 }
            ],
            notes: '',
            taxRate: 0,
            discount: 0,
            advancePaid: 0,
          });
        } catch (error) {
          console.error('Failed to generate invoice number:', error);
          // Fallback invoice number
          const today = new Date();
          const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');
          setFormData({
            id: crypto.randomUUID(),
            invoiceNumber: `${datePrefix}001`,
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            businessName: 'Anything2BD',
            businessEmail: 'anything2bd@gmail.com',
            businessPhone: '',
            businessAddress: '',
            customerName: '',
            customerEmail: '',
            customerAddress: '',
            lineItems: [
              { id: crypto.randomUUID(), itemName: '', description: '', size: '', quantity: 1, unitCost: 0 }
            ],
            notes: '',
            taxRate: 0,
            discount: 0,
            advancePaid: 0,
          });
        } finally {
          setIsLoadingInvoiceNumber(false);
        }
      }
    };

    initializeForm();
  }, [invoice, generateInvoiceNumber]);

  if (!formData || isLoadingInvoiceNumber) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#1A5872]" />
        </div>
      </Card>
    );
  }

  const handleInputChange = (field: keyof Invoice, value: string | number) => {
    setFormData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleLineItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        lineItems: prev.lineItems.map(item =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      };
    });
  };

  const addLineItem = () => {
    setFormData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        lineItems: [...prev.lineItems, { id: crypto.randomUUID(), itemName: '', description: '', size: '', quantity: 1, unitCost: 0 }],
      };
    });
  };

  const removeLineItem = (id: string) => {
    if (formData && formData.lineItems.length > 1) {
      setFormData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          lineItems: prev.lineItems.filter(item => item.id !== id),
        };
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2>Invoice Details</h2>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1A5872] hover:bg-[#143F52]">Save Invoice</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                required
                disabled
                className="bg-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                min="0"
                value={formData.taxRate}
                onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="discount">Discount Amount (BDT)</Label>
              <Input
                id="discount"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount}
                onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div>
              <Label htmlFor="advancePaid">Advance Paid (BDT)</Label>
              <Input
                id="advancePaid"
                type="number"
                step="0.01"
                min="0"
                value={formData.advancePaid}
                onChange={(e) => handleInputChange('advancePaid', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3>Your Business Details</h3>
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="businessEmail">Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={formData.businessEmail}
                onChange={(e) => handleInputChange('businessEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="businessPhone">Phone</Label>
              <Input
                id="businessPhone"
                value={formData.businessPhone}
                onChange={(e) => handleInputChange('businessPhone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="businessAddress">Address</Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3>Customer Details</h3>
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="customerAddress">Address</Label>
              <Textarea
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3>Line Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {formData.lineItems.map((item, index) => (
              <div key={item.id} className="p-4 bg-slate-50 rounded-lg space-y-3">
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-12 md:col-span-4">
                    <Label htmlFor={`itemName-${item.id}`}>Item Name</Label>
                    <Input
                      id={`itemName-${item.id}`}
                      value={item.itemName}
                      onChange={(e) => handleLineItemChange(item.id, 'itemName', e.target.value)}
                      placeholder="Item name"
                      required
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <Label htmlFor={`size-${item.id}`}>Size</Label>
                    <Input
                      id={`size-${item.id}`}
                      value={item.size}
                      onChange={(e) => handleLineItemChange(item.id, 'size', e.target.value)}
                      placeholder="Size"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Label htmlFor={`quantity-${item.id}`}>Qty</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <Label htmlFor={`unitCost-${item.id}`}>Unit Cost (BDT)</Label>
                    <Input
                      id={`unitCost-${item.id}`}
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.unitCost}
                      onChange={(e) => handleLineItemChange(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="col-span-12 md:col-span-1 flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLineItem(item.id)}
                      disabled={formData.lineItems.length === 1}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`description-${item.id}`}>Description</Label>
                  <Textarea
                    id={`description-${item.id}`}
                    value={item.description}
                    onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                    placeholder="Item description (optional)"
                    rows={2}
                  />
                </div>
                <div className="text-right text-slate-600">
                  Total: BDT {(item.quantity * item.unitCost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Additional notes or payment terms..."
            rows={4}
          />
        </div>
      </Card>
    </form>
  );
}