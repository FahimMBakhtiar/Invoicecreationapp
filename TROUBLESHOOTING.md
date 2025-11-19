# PDF Generation Troubleshooting

## Issue: "Failed to load PDF document" after deployment

### Common Causes:

1. **Serverless Function Timeout**
   - Vercel Hobby: 10 seconds
   - Vercel Pro: 60 seconds
   - Solution: Check Vercel function logs for timeout errors

2. **Invalid PDF Buffer**
   - The PDF might not be generated correctly
   - Solution: Check server logs for errors

3. **Response Format Issues**
   - The response might not be properly formatted
   - Solution: Verify Content-Type headers

### Debugging Steps:

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Your Project → Functions
   - Check the logs for `/api/pdf` function
   - Look for errors or timeout messages

2. **Test the API Directly:**
   ```bash
   curl -X POST https://your-app.vercel.app/api/generate-pdf \
     -H "Content-Type: application/json" \
     -d '{"html":"<html><body>Test</body></html>","filename":"test.pdf"}' \
     --output test.pdf
   ```

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Check Network tab when downloading PDF
   - Look at the response from `/api/generate-pdf`
   - Check if response is actually a PDF or an error

4. **Verify PDF Header:**
   - The PDF should start with `%PDF`
   - If you see JSON or HTML, the function is returning an error

### Quick Fixes:

1. **Redeploy with latest changes:**
   ```bash
   vercel --prod
   ```

2. **Check if dependencies are installed:**
   - Make sure `@sparticuz/chromium` and `puppeteer-core` are in `package.json`

3. **Verify function timeout:**
   - Check `vercel.json` has `maxDuration: 60` for the function

4. **Check environment:**
   - Make sure `VERCEL_ENV` is set to `production` in production

### Alternative: Use Separate Backend

If serverless functions continue to have issues, deploy the backend separately:

1. Deploy `server.js` to Railway/Render
2. Update frontend API URL to point to your backend
3. This avoids timeout and cold start issues

