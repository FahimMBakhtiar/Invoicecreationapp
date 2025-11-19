# Quick Deployment Guide

## 🚀 Deploy to Vercel (Easiest)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Install serverless dependencies:**
   ```bash
   npm install @sparticuz/chromium puppeteer-core --save
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **For production:**
   ```bash
   vercel --prod
   ```

That's it! The `api/pdf.js` will automatically work as a serverless function.

---

## 🌐 Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Install serverless dependencies:**
   ```bash
   npm install @sparticuz/chromium puppeteer-core --save
   ```

3. **Deploy:**
   ```bash
   netlify deploy
   ```

4. **For production:**
   ```bash
   netlify deploy --prod
   ```

---

## ⚠️ Important Notes

- **Serverless functions have timeouts**: Vercel (10-60s), Netlify (10-26s)
- **Cold starts**: First request may be slow (~5-10 seconds)
- **For better performance**: Consider deploying the backend separately (Railway, Render)

---

## 🔧 Alternative: Separate Backend (Recommended)

For production, deploy the Puppeteer server separately:

1. **Deploy `server.js` to Railway/Render**
2. **Update API URL in `InvoicePreview.tsx`**:
   ```typescript
   const apiUrl = import.meta.env.PROD 
     ? 'https://your-backend.railway.app/api/generate-pdf'
     : 'http://localhost:3001/api/generate-pdf';
   ```
3. **Deploy frontend to Vercel/Netlify**

This gives you:
- ✅ No timeout limits
- ✅ Faster responses
- ✅ More reliable

---

## 📝 Environment Variables

No environment variables needed for basic deployment!

