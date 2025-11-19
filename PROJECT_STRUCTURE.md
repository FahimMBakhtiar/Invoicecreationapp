# Project Structure

This document describes the organized folder structure of the InvoiceApp project.

## Root Structure

```
InvoiceApp/
├── frontend/          # Frontend React application
├── backend/           # Backend services and database
├── .git/              # Git repository
├── .gitignore         # Git ignore rules
├── README.md          # Main project documentation
└── PROJECT_STRUCTURE.md  # This file
```

## Frontend Structure

```
frontend/
├── src/                    # Source code
│   ├── components/        # React components
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   ├── InvoiceForm.tsx
│   │   ├── InvoicePreview.tsx
│   │   └── Login.tsx
│   ├── types/             # TypeScript type definitions
│   ├── assets/            # Static assets (images, etc.)
│   ├── styles/            # Global styles
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── index.html             # HTML template
├── vite.config.ts         # Vite configuration
├── package.json           # Frontend dependencies
├── package-lock.json      # Lock file
├── .npmrc                 # npm configuration
└── README.md              # Frontend documentation
```

## Backend Structure

```
backend/
├── database/               # Database schemas and migrations
│   ├── schema.sql         # Main database schema
│   └── migration_add_line_items_function.sql
├── services/              # Business logic services
│   ├── auth.service.ts    # Authentication service
│   └── invoice.service.ts # Invoice CRUD service
├── supabase/              # Supabase configuration
│   └── config.ts          # Supabase client config
└── README.md              # Backend documentation
```

## Key Features

### Import Paths

- Frontend imports backend using `@backend` alias
- Configured in `frontend/vite.config.ts`
- Example: `import { InvoiceService } from '@backend/services/invoice.service';`

### Development Workflow

1. **Frontend Development**: Work in `frontend/` directory
   - Run `npm install` in `frontend/` to install dependencies
   - Run `npm run dev` to start dev server
   - Frontend runs on `http://localhost:3000`

2. **Backend Development**: Work in `backend/` directory
   - Database schemas in `backend/database/`
   - Services in `backend/services/`
   - Run SQL scripts in Supabase Dashboard

### Build Output

- Frontend build output: `frontend/build/`
- Ignored in `.gitignore`

## Benefits of This Structure

1. **Clear Separation**: Frontend and backend are clearly separated
2. **Easy Navigation**: Easy to find frontend vs backend code
3. **Scalability**: Easy to split into separate repositories if needed
4. **Maintainability**: Clear organization makes maintenance easier
5. **Team Collaboration**: Frontend and backend developers can work independently

