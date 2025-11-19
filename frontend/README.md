# Frontend - Invoice Creation App

React-based frontend application for invoice management.

## Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Reusable UI components (shadcn/ui)
│   │   └── ...        # Feature components
│   ├── types/         # TypeScript type definitions
│   ├── assets/        # Static assets (images, etc.)
│   ├── styles/        # Global styles
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── index.html         # HTML template
├── vite.config.ts     # Vite configuration
└── package.json       # Dependencies
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file in the `frontend/` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   **Important**: The `.env` file must be in the `frontend/` directory (not the root) for Vite to read it.

3. Start development server:
   ```bash
   npm run dev
   ```
   
   **Note**: If you see "Missing Supabase environment variables" error:
   - Make sure the `.env` file is in `frontend/` directory
   - Restart the dev server after creating/updating `.env` file
   - Check that variable names start with `VITE_` prefix

## Building

```bash
npm run build
```

Output will be in `build/` directory.

## Importing Backend Services

Backend services can be imported using the `@backend` alias:

```typescript
import { InvoiceService } from '@backend/services/invoice.service';
import { AuthService } from '@backend/services/auth.service';
```

This alias is configured in `vite.config.ts` and points to `../backend`.

