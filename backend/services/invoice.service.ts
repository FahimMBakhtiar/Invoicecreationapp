import { supabase } from '../supabase/config';

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

interface DatabaseInvoice {
  id: string;
  user_id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  business_name: string;
  business_email: string | null;
  business_phone: string | null;
  business_address: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_address: string | null;
  notes: string | null;
  tax_rate: number;
  discount: number;
  advance_paid: number;
  created_at: string;
  updated_at: string;
}

interface DatabaseLineItem {
  id: string;
  invoice_id: string;
  item_name: string;
  description: string | null;
  size: string | null;
  quantity: number;
  unit_cost: number;
  created_at: string;
  updated_at: string;
}

export class InvoiceService {
  /**
   * Transform database invoice to app invoice format
   */
  private static transformInvoice(dbInvoice: DatabaseInvoice, lineItems: DatabaseLineItem[]): Invoice {
    return {
      id: dbInvoice.id,
      invoiceNumber: dbInvoice.invoice_number,
      date: dbInvoice.date,
      dueDate: dbInvoice.due_date,
      businessName: dbInvoice.business_name,
      businessEmail: dbInvoice.business_email || '',
      businessPhone: dbInvoice.business_phone || '',
      businessAddress: dbInvoice.business_address || '',
      customerName: dbInvoice.customer_name,
      customerEmail: dbInvoice.customer_email || '',
      customerAddress: dbInvoice.customer_address || '',
      lineItems: lineItems.map(item => ({
        id: item.id,
        itemName: item.item_name,
        description: item.description || '',
        size: item.size || '',
        quantity: item.quantity,
        unitCost: parseFloat(item.unit_cost.toString()),
      })),
      notes: dbInvoice.notes || '',
      taxRate: parseFloat(dbInvoice.tax_rate.toString()),
      discount: parseFloat(dbInvoice.discount.toString()),
      advancePaid: parseFloat(dbInvoice.advance_paid.toString()),
      createdAt: dbInvoice.created_at,
      updatedAt: dbInvoice.updated_at,
    };
  }

  /**
   * Transform app invoice to database format
   */
  private static transformInvoiceForDB(invoice: Partial<Invoice>, userId: string) {
    return {
      user_id: userId,
      invoice_number: invoice.invoiceNumber,
      date: invoice.date,
      due_date: invoice.dueDate,
      business_name: invoice.businessName,
      business_email: invoice.businessEmail || null,
      business_phone: invoice.businessPhone || null,
      business_address: invoice.businessAddress || null,
      customer_name: invoice.customerName,
      customer_email: invoice.customerEmail || null,
      customer_address: invoice.customerAddress || null,
      notes: invoice.notes || null,
      tax_rate: invoice.taxRate || 0,
      discount: invoice.discount || 0,
      advance_paid: invoice.advancePaid || 0,
    };
  }

  /**
   * Get all invoices for the current user
   */
  static async getAllInvoices(): Promise<{ success: boolean; data: Invoice[] | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, data: null, error: 'User not authenticated' };
      }

      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      if (!invoices || invoices.length === 0) {
        return { success: true, data: [], error: null };
      }

      // Fetch line items for all invoices
      const invoiceIds = invoices.map(inv => inv.id);
      const { data: lineItems, error: lineItemsError } = await supabase
        .from('line_items')
        .select('*')
        .in('invoice_id', invoiceIds);

      if (lineItemsError) throw lineItemsError;

      // Group line items by invoice_id
      const lineItemsMap = new Map<string, DatabaseLineItem[]>();
      (lineItems || []).forEach(item => {
        const items = lineItemsMap.get(item.invoice_id) || [];
        items.push(item);
        lineItemsMap.set(item.invoice_id, items);
      });

      // Transform invoices
      const transformedInvoices = invoices.map(invoice => 
        this.transformInvoice(invoice as DatabaseInvoice, lineItemsMap.get(invoice.id) || [])
      );

      return { success: true, data: transformedInvoices, error: null };
    } catch (error: any) {
      console.error('Get all invoices error:', error);
      return { 
        success: false, 
        data: null, 
        error: error.message || 'Failed to fetch invoices' 
      };
    }
  }

  /**
   * Get a single invoice by ID
   */
  static async getInvoiceById(id: string): Promise<{ success: boolean; data: Invoice | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, data: null, error: 'User not authenticated' };
      }

      const { data: invoice, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (invoiceError) throw invoiceError;
      if (!invoice) {
        return { success: false, data: null, error: 'Invoice not found' };
      }

      const { data: lineItems, error: lineItemsError } = await supabase
        .from('line_items')
        .select('*')
        .eq('invoice_id', id)
        .order('created_at', { ascending: true });

      if (lineItemsError) throw lineItemsError;

      const transformedInvoice = this.transformInvoice(
        invoice as DatabaseInvoice,
        (lineItems || []) as DatabaseLineItem[]
      );

      return { success: true, data: transformedInvoice, error: null };
    } catch (error: any) {
      console.error('Get invoice error:', error);
      return { 
        success: false, 
        data: null, 
        error: error.message || 'Failed to fetch invoice' 
      };
    }
  }

  /**
   * Create a new invoice
   */
  static async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: Invoice | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, data: null, error: 'User not authenticated' };
      }

      // Validate required fields
      if (!invoice.invoiceNumber || !invoice.businessName || !invoice.customerName) {
        return { success: false, data: null, error: 'Missing required fields' };
      }

      if (!invoice.lineItems || invoice.lineItems.length === 0) {
        return { success: false, data: null, error: 'At least one line item is required' };
      }

      // Insert invoice
      const invoiceData = this.transformInvoiceForDB(invoice, user.id);
      const { data: newInvoice, error: invoiceError } = await supabase
        .from('invoices')
        .insert(invoiceData)
        .select()
        .single();

      if (invoiceError) {
        console.error('Invoice insert error:', invoiceError);
        throw invoiceError;
      }
      
      if (!newInvoice || !newInvoice.id) {
        throw new Error('Invoice was not created successfully - no ID returned');
      }

      const invoiceId = newInvoice.id;
      console.log('Invoice created with ID:', invoiceId);

      // Verify invoice exists and is accessible (important for RLS)
      let invoiceVerified = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        const { data: verifyInvoice, error: verifyError } = await supabase
          .from('invoices')
          .select('id')
          .eq('id', invoiceId)
          .eq('user_id', user.id)
          .single();

        if (!verifyError && verifyInvoice) {
          invoiceVerified = true;
          break;
        }
        
        if (attempt < 4) {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
        }
      }

      if (!invoiceVerified) {
        // Clean up the orphaned invoice
        await supabase.from('invoices').delete().eq('id', invoiceId);
        throw new Error('Invoice was created but is not accessible. This may be a database configuration issue.');
      }

      // Prepare line items data
      const lineItemsJson = invoice.lineItems.map(item => ({
        item_name: item.itemName || '',
        description: item.description || null,
        size: item.size || null,
        quantity: item.quantity || 1,
        unit_cost: item.unitCost || 0,
      }));

      // Try to insert line items using database function first (bypasses RLS)
      let lineItemsInserted = false;
      const { error: functionError } = await supabase.rpc('insert_line_items_for_invoice', {
        p_invoice_id: invoiceId,
        p_line_items: lineItemsJson,
      });

      if (!functionError) {
        lineItemsInserted = true;
        console.log('Line items inserted via function');
      } else {
        console.warn('Function call failed, trying direct insert:', functionError.message);
        
        // Fallback: Try direct insert with retries
        const lineItemsData = invoice.lineItems.map(item => ({
          invoice_id: invoiceId,
          item_name: item.itemName,
          description: item.description || null,
          size: item.size || null,
          quantity: item.quantity,
          unit_cost: item.unitCost,
        }));

        for (let attempt = 0; attempt < 3; attempt++) {
          const { error: lineItemsError } = await supabase
            .from('line_items')
            .insert(lineItemsData);

          if (!lineItemsError) {
            lineItemsInserted = true;
            console.log('Line items inserted via direct insert');
            break;
          }

          if (attempt < 2) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
          } else {
            // Last attempt failed - clean up invoice and throw error
            await supabase.from('invoices').delete().eq('id', invoiceId);
            throw new Error(`Failed to insert line items: ${lineItemsError.message}. Invoice has been rolled back.`);
          }
        }
      }

      if (!lineItemsInserted) {
        // Clean up the orphaned invoice
        await supabase.from('invoices').delete().eq('id', invoiceId);
        throw new Error('Failed to insert line items after all retry attempts');
      }

      // Fetch the complete invoice with line items
      const result = await this.getInvoiceById(newInvoice.id);
      return result;
    } catch (error: any) {
      console.error('Create invoice error:', error);
      return { 
        success: false, 
        data: null, 
        error: error.message || 'Failed to create invoice' 
      };
    }
  }

  /**
   * Update an existing invoice
   */
  static async updateInvoice(invoice: Invoice): Promise<{ success: boolean; data: Invoice | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, data: null, error: 'User not authenticated' };
      }

      // Validate required fields
      if (!invoice.invoiceNumber || !invoice.businessName || !invoice.customerName) {
        return { success: false, data: null, error: 'Missing required fields' };
      }

      if (!invoice.lineItems || invoice.lineItems.length === 0) {
        return { success: false, data: null, error: 'At least one line item is required' };
      }

      // Verify invoice exists and belongs to user
      // If invoice doesn't exist, it might be a new invoice with a frontend-generated ID
      // In that case, we should create it instead of updating
      const { data: existingInvoice, error: fetchError } = await supabase
        .from('invoices')
        .select('id, created_at')
        .eq('id', invoice.id)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !existingInvoice) {
        // Check if this is a "not found" error (PGRST116) vs other errors
        const isNotFound = fetchError?.code === 'PGRST116' || 
                          fetchError?.message?.includes('No rows') ||
                          !existingInvoice;
        
        if (isNotFound) {
          // Invoice doesn't exist - this might be a new invoice with a frontend-generated ID
          // Check if invoice has a createdAt timestamp (only saved invoices have this)
          if (!invoice.createdAt) {
            // This is a new invoice, not an update - redirect to create
            // Strip ID, createdAt, and updatedAt since createInvoice doesn't accept them
            console.warn('Invoice ID exists but not in database. Treating as new invoice.');
            const { id, createdAt, updatedAt, ...invoiceData } = invoice;
            return this.createInvoice(invoiceData);
          } else {
            // Invoice has createdAt but doesn't exist - likely deleted or ID mismatch
            throw new Error('Invoice not found. It may have been deleted or the ID is incorrect.');
          }
        } else {
          // Other error (permission, etc.)
          throw new Error(`Failed to verify invoice: ${fetchError?.message || 'Unknown error'}`);
        }
      }

      // Update invoice
      const invoiceData = this.transformInvoiceForDB(invoice, user.id);
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update(invoiceData)
        .eq('id', invoice.id)
        .eq('user_id', user.id);

      if (invoiceError) {
        console.error('Invoice update error:', invoiceError);
        throw invoiceError;
      }

      // Delete existing line items
      const { error: deleteError } = await supabase
        .from('line_items')
        .delete()
        .eq('invoice_id', invoice.id);

      if (deleteError) {
        console.error('Delete line items error:', deleteError);
        throw deleteError;
      }

      // Prepare line items data
      const lineItemsJson = invoice.lineItems.map(item => ({
        item_name: item.itemName || '',
        description: item.description || null,
        size: item.size || null,
        quantity: item.quantity || 1,
        unit_cost: item.unitCost || 0,
      }));

      // Try to insert line items using database function first (bypasses RLS)
      let lineItemsInserted = false;
      const { error: functionError } = await supabase.rpc('insert_line_items_for_invoice', {
        p_invoice_id: invoice.id,
        p_line_items: lineItemsJson,
      });

      if (!functionError) {
        lineItemsInserted = true;
        console.log('Line items inserted via function');
      } else {
        console.warn('Function call failed, trying direct insert:', functionError.message);
        
        // Fallback: Try direct insert with retries
        const lineItemsData = invoice.lineItems.map(item => ({
          invoice_id: invoice.id,
          item_name: item.itemName,
          description: item.description || null,
          size: item.size || null,
          quantity: item.quantity,
          unit_cost: item.unitCost,
        }));

        for (let attempt = 0; attempt < 3; attempt++) {
          const { error: lineItemsError } = await supabase
            .from('line_items')
            .insert(lineItemsData);

          if (!lineItemsError) {
            lineItemsInserted = true;
            console.log('Line items inserted via direct insert');
            break;
          }

          if (attempt < 2) {
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)));
          } else {
            throw new Error(`Failed to insert line items: ${lineItemsError.message}`);
          }
        }
      }

      if (!lineItemsInserted) {
        throw new Error('Failed to insert line items after all retry attempts');
      }

      // Fetch the updated invoice
      const result = await this.getInvoiceById(invoice.id);
      return result;
    } catch (error: any) {
      console.error('Update invoice error:', error);
      return { 
        success: false, 
        data: null, 
        error: error.message || 'Failed to update invoice' 
      };
    }
  }

  /**
   * Delete an invoice
   */
  static async deleteInvoice(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Delete invoice error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to delete invoice' 
      };
    }
  }

  /**
   * Generate invoice number in format: YYYYMMDD001
   */
  static async generateInvoiceNumber(): Promise<{ success: boolean; invoiceNumber: string | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, invoiceNumber: null, error: 'User not authenticated' };
      }

      const today = new Date();
      const datePrefix = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

      // Get all invoices for today
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', user.id)
        .like('invoice_number', `${datePrefix}%`);

      if (error) throw error;

      // Get the highest sequence number for today
      const sequenceNumbers = (invoices || []).map(inv => {
        const seqStr = inv.invoice_number.slice(8); // Get last 3 digits
        return parseInt(seqStr) || 0;
      });

      const nextSequence = Math.max(0, ...sequenceNumbers) + 1;
      const sequenceStr = nextSequence.toString().padStart(3, '0');

      return { 
        success: true, 
        invoiceNumber: `${datePrefix}${sequenceStr}`, 
        error: null 
      };
    } catch (error: any) {
      console.error('Generate invoice number error:', error);
      return { 
        success: false, 
        invoiceNumber: null, 
        error: error.message || 'Failed to generate invoice number' 
      };
    }
  }
}

