# Backend Services

This directory contains all backend-related code for the InvoiceApp.

## Structure

```
backend/
├── database/
│   └── schema.sql          # PostgreSQL database schema with RLS policies
├── services/
│   ├── auth.service.ts     # Authentication service (login, logout, session management)
│   └── invoice.service.ts  # Invoice CRUD operations service
└── supabase/
    └── config.ts          # Supabase client configuration
```

## Services

### AuthService
Handles all authentication operations:
- `signIn(credentials)` - Sign in with email/password
- `signOut()` - Sign out current user
- `getSession()` - Get current session
- `getCurrentUser()` - Get current user
- `onAuthStateChange(callback)` - Listen to auth state changes

### InvoiceService
Handles all invoice operations:
- `getAllInvoices()` - Get all invoices for current user
- `getInvoiceById(id)` - Get single invoice by ID
- `createInvoice(invoice)` - Create new invoice
- `updateInvoice(invoice)` - Update existing invoice
- `deleteInvoice(id)` - Delete invoice
- `generateInvoiceNumber()` - Generate unique invoice number

## Database Schema

The database uses PostgreSQL with Row Level Security (RLS) to ensure users can only access their own data.

### Tables
- `users` - User profiles (linked to Supabase Auth)
- `invoices` - Invoice records
- `line_items` - Line items for each invoice

### Security
- All tables have RLS enabled
- Policies ensure users can only access their own data
- Foreign key constraints maintain data integrity

### Database Setup

1. **Initial Schema Setup:**
   - Open Supabase Dashboard → SQL Editor
   - Run `backend/database/schema.sql` to create all tables, policies, and functions

2. **If you get foreign key constraint errors:**
   - The `insert_line_items_for_invoice` function must exist in your database
   - Run `backend/database/migration_add_line_items_function.sql` in Supabase SQL Editor
   - This function bypasses RLS timing issues when inserting line items after invoice creation

## Usage

Import services in your components:

```typescript
import { AuthService } from '../backend/services/auth.service';
import { InvoiceService } from '../backend/services/invoice.service';
```

## Environment Variables

Required environment variables (set in `.env`):
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

