# Invoice Creation App

A full-stack invoice creation application with React frontend and Supabase backend.

## Project Structure

```
InvoiceApp/
├── frontend/          # Frontend React application
│   ├── src/           # Source code
│   ├── index.html     # HTML entry point
│   ├── vite.config.ts # Vite configuration
│   └── package.json   # Frontend dependencies
│
├── backend/           # Backend services and database
│   ├── database/      # Database schemas and migrations
│   ├── services/      # Business logic services
│   └── supabase/      # Supabase configuration
│
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Set up your Supabase project:
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key from Settings → API

2. Run the database schema:
   - Open Supabase Dashboard → SQL Editor
   - Run `backend/database/schema.sql` to create tables, policies, and functions

3. If you encounter foreign key constraint errors:
   - Run `backend/database/migration_add_line_items_function.sql` in Supabase SQL Editor
   - This creates the required database functions

See `backend/README.md` for detailed backend documentation.

## Building for Production

### Frontend

```bash
cd frontend
npm run build
```

The build output will be in `frontend/build/`

## Features

- ✅ User authentication (Supabase Auth)
- ✅ Invoice creation and management
- ✅ Line items management
- ✅ Invoice preview and printing
- ✅ Row Level Security (RLS) for data isolation
- ✅ Responsive design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- Sonner (toast notifications)

### Backend
- Supabase (PostgreSQL + Auth)
- Row Level Security (RLS)
- TypeScript services

## Project Organization

- **Frontend**: All React components, UI, and client-side logic
- **Backend**: Database schemas, services, and Supabase configuration
- **Services**: Reusable business logic (auth, invoices)
- **Database**: SQL schemas and migration scripts

## Development

- Frontend code is in `frontend/src/`
- Backend services are in `backend/services/`
- Database schemas are in `backend/database/`
- Frontend imports backend using `@backend` alias (configured in `vite.config.ts`)

## License

Private project
