
  # Invoice Creation App

  This is a code bundle for Invoice Creation App. The original project is available at https://www.figma.com/design/N1qbEK5jmK0VvoA0khO7YG/Invoice-Creation-App.

  ## Prerequisites

  - Node.js (version 16 or higher) - Download from [nodejs.org](https://nodejs.org/)
  - npm (comes with Node.js) or yarn/pnpm

  ## Running the code locally

  ### Step 1: Install dependencies

  Open a terminal in the project directory and run:

  ```bash
  npm install
  ```

  This will install all required dependencies including React, Vite, and PDF generation libraries (jspdf, html2canvas).

  ### Step 2: Start the development server

  Run the following command:

  ```bash
  npm run dev
  ```

  The development server will start and you should see output like:
  ```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ```

  ### Step 3: Open in browser

  - The browser should open automatically to `http://localhost:3000`
  - If it doesn't, manually open your browser and navigate to `http://localhost:3000`

  ### Important Notes

  - **Do NOT** open the `index.html` file directly in the browser (file:// protocol) - this will cause CORS errors
  - Always use the development server (`npm run dev`) to run the application
  - The app will automatically reload when you make changes to the code

  ## Building for production

  To create a production build:

  ```bash
  npm run build
  ```

  The built files will be in the `build` directory.
  