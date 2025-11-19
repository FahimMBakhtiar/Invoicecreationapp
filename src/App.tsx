import { useState, useEffect } from 'react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { Login } from './components/Login';
import { Button } from './components/ui/button';
import { FileText, Plus, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import atobLogo from 'figma:asset/c1a850e885b460d6ebe9f5090d5abbb6b2c2cd14.png';
import { Invoice } from './types/invoice.types';
import { InvoiceService } from '../backend/services/invoice.service';
import { AuthService } from '../backend/services/auth.service';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Load invoices when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadInvoices();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const { success, session } = await AuthService.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadInvoices = async () => {
    setIsLoadingInvoices(true);
    try {
      const result = await InvoiceService.getAllInvoices();
      if (result.success && result.data) {
        setInvoices(result.data);
      } else {
        toast.error(result.error || 'Failed to load invoices');
      }
    } catch (error) {
      console.error('Load invoices error:', error);
      toast.error('Failed to load invoices');
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    toast.success('Successfully signed in');
  };

  const handleLogout = async () => {
    try {
      const result = await AuthService.signOut();
      if (result.success) {
        setIsAuthenticated(false);
        setInvoices([]);
        setCurrentInvoice(null);
        setIsEditing(false);
        toast.success('Successfully signed out');
      } else {
        toast.error(result.error || 'Failed to sign out');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out');
    }
  };

  const handleSaveInvoice = async (invoice: Invoice) => {
    try {
      let result;
      if (invoice.id) {
        // Update existing invoice
        result = await InvoiceService.updateInvoice(invoice);
      } else {
        // Create new invoice
        result = await InvoiceService.createInvoice(invoice);
      }

      if (result.success && result.data) {
        toast.success(`Invoice ${invoice.id ? 'updated' : 'created'} successfully`);
        await loadInvoices();
        setCurrentInvoice(result.data);
        setIsEditing(false);
      } else {
        toast.error(result.error || `Failed to ${invoice.id ? 'update' : 'create'} invoice`);
      }
    } catch (error) {
      console.error('Save invoice error:', error);
      toast.error('Failed to save invoice');
    }
  };

  const handleNewInvoice = () => {
    setCurrentInvoice(null);
    setIsEditing(true);
  };

  const handleEditInvoice = () => {
    setIsEditing(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const result = await InvoiceService.deleteInvoice(id);
      if (result.success) {
        toast.success('Invoice deleted successfully');
        await loadInvoices();
        if (currentInvoice?.id === id) {
          setCurrentInvoice(null);
          setIsEditing(false);
        }
      } else {
        toast.error(result.error || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Delete invoice error:', error);
      toast.error('Failed to delete invoice');
    }
  };

  const generateInvoiceNumber = async (): Promise<string> => {
    const result = await InvoiceService.generateInvoiceNumber();
    if (result.success && result.invoiceNumber) {
      return result.invoiceNumber;
    }
    // Fallback to client-side generation if backend fails
    const today = new Date();
    const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, '');
    const existingToday = invoices.filter(inv => inv.invoiceNumber.startsWith(datePrefix));
    const nextSeq = existingToday.length + 1;
    return `${datePrefix}${nextSeq.toString().padStart(3, '0')}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A5872]" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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
          <div className="flex items-center gap-2">
            <Button onClick={handleNewInvoice} className="gap-2 bg-[#1A5872] hover:bg-[#143F52]">
              <Plus className="w-4 h-4" />
              New Invoice
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="gap-2"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <h2 className="mb-4">Saved Invoices</h2>
              {isLoadingInvoices ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#1A5872]" />
                </div>
              ) : invoices.length === 0 ? (
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
                          <p className="text-slate-500 text-sm">{new Date(invoice.date).toLocaleDateString()}</p>
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
                generateInvoiceNumber={generateInvoiceNumber}
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

export { atobLogo };