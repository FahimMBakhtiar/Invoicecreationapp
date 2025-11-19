# Deployment Guide

This guide explains how to deploy the Invoice Generator app to Vercel or Netlify.

## Important Note

Puppeteer is **heavy** for serverless functions. For production, consider:
1. **Option A**: Use a separate backend service (Railway, Render, Fly.io) for Puppeteer
2. **Option B**: Use serverless functions (Vercel/Netlify) - may have timeout/cold start issues
3. **Option C**: Switch to client-side PDF generation (simpler but less features)

## Option 1: Deploy to Vercel

### Prerequisites
- Vercel account
- Vercel CLI installed: `npm i -g vercel`

### Steps

1. **Install serverless dependencies:**
   ```bash
   npm install @sparticuz/chromium puppeteer-core --save
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **For production:**
   ```bash
   vercel --prod
   ```

The `api/pdf.js` file will automatically be deployed as a serverless function.

### Vercel Configuration
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

## Option 2: Deploy to Netlify

### Prerequisites
- Netlify account
- Netlify CLI installed: `npm i -g netlify-cli`

### Steps

1. **Install serverless dependencies:**
   ```bash
   npm install @sparticuz/chromium puppeteer-core --save
   ```

2. **Deploy:**
   ```bash
   netlify deploy
   ```

3. **For production:**
   ```bash
   netlify deploy --prod
   ```

The `netlify/functions/generate-pdf.js` will automatically be deployed as a serverless function.

### Netlify Configuration
- Build command: `npm run build`
- Publish directory: `build`
- Node version: 18

## Option 3: Separate Backend Service (Recommended for Production)

For better performance and reliability, deploy the Puppeteer server separately:

### Using Railway

1. Create a `railway.json`:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "node server.js",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

2. Push to GitHub and connect to Railway
3. Update frontend API URL to your Railway URL

### Using Render

1. Create a `render.yaml`:
   ```yaml
   services:
     - type: web
       name: pdf-server
       env: node
       buildCommand: npm install
       startCommand: node server.js
       envVars:
         - key: NODE_ENV
           value: production
   ```

2. Connect your GitHub repo to Render
3. Update frontend API URL

### Update Frontend API URL

After deploying the backend, update `src/components/InvoicePreview.tsx`:

```typescript
const apiUrl = import.meta.env.PROD 
  ? 'https://your-backend-url.railway.app/api/generate-pdf'  // Your deployed backend
  : 'http://localhost:3001/api/generate-pdf';
```

## Environment Variables

For serverless functions, you may need to set:
- `NODE_ENV=production`
- `CHROMIUM_PATH` (if using custom Chromium)

## Troubleshooting

### Serverless Function Timeouts
- Vercel: 10s (Hobby), 60s (Pro)
- Netlify: 10s (Free), 26s (Pro)

If PDFs are large, consider:
- Using a separate backend service
- Optimizing HTML size
- Using client-side PDF generation

### Cold Starts
Serverless functions have cold starts. First request may be slow.

### Memory Limits
- Vercel: 1024 MB (Hobby), 3008 MB (Pro)
- Netlify: 1024 MB (Free), 3008 MB (Pro)

Puppeteer needs ~200-300 MB, so you should be fine.

## Alternative: Client-Side PDF (Easier Deployment)

If serverless functions are problematic, consider switching back to client-side PDF generation using `jspdf` and `html2canvas` (but you'll need to handle the oklch color issue).

