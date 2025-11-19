-- Migration: Add insert_line_items_for_invoice function
-- This function bypasses RLS timing issues when inserting line items
-- Run this in Supabase SQL Editor if the function doesn't exist

-- Function to insert line items for an invoice (bypasses RLS)
-- This function is used to insert line items immediately after invoice creation
-- when RLS policies might not yet see the newly created invoice
CREATE OR REPLACE FUNCTION public.insert_line_items_for_invoice(
  p_invoice_id UUID,
  p_line_items JSONB
)
RETURNS VOID AS $$
DECLARE
  item JSONB;
BEGIN
  -- Verify the invoice exists and belongs to the current user
  IF NOT EXISTS (
    SELECT 1 FROM public.invoices
    WHERE id = p_invoice_id
    AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Invoice not found or access denied';
  END IF;

  -- Insert each line item
  FOR item IN SELECT * FROM jsonb_array_elements(p_line_items)
  LOOP
    INSERT INTO public.line_items (
      invoice_id,
      item_name,
      description,
      size,
      quantity,
      unit_cost
    ) VALUES (
      p_invoice_id,
      item->>'item_name',
      NULLIF(item->>'description', ''),
      NULLIF(item->>'size', ''),
      (item->>'quantity')::INTEGER,
      (item->>'unit_cost')::DECIMAL(10, 2)
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

