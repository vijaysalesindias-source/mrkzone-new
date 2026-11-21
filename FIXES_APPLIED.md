# MRK ZONE project fixes

## Changes in this package

- Corrected the frontend API fallback URL to `https://amazone-8urb.onrender.com/api` (plain URL, not Markdown link text).
- Improved API response parsing so an HTML page returned in place of JSON produces a useful API configuration/deployment error instead of a confusing JSON parse failure.
- URL-encoded delivery PIN and subtotal query parameters.
- Tightened Indian PIN validation to exactly six digits with a non-zero first digit and reset stale delivery results when the PIN changes or the modal opens.
- Updated the secondary navigation so **Mobiles** is the only category item that navigates; Prime, Today's Deals, Coupons, Flights, Fresh, Amazon Pay, Electronics, Grocery and New Releases remain visible but are labels only.
- Added an idempotent backend starter-catalog seeder that fills the Smartphones category to at least 100 products on backend startup. Existing products are not overwritten. These are editable starter listings; verify current model variants, regional prices, warranty and stock in Admin before taking real orders.

## Deployment notes

1. Deploy the frontend source/build to the existing frontend host.
2. Deploy the backend source to the existing Render backend. The 100-item starter catalogue is inserted by the backend initializer at startup; a frontend-only deployment will not insert those records.
3. Set `VITE_API_URL` to the plain URL `https://amazone-8urb.onrender.com/api` (no Markdown brackets, parentheses, or quotes) if using an environment variable.
4. Sign in with an account whose server-side role is `ROLE_ADMIN`. Admin endpoints remain protected by the backend; this change does not add a client-side admin bypass.

## Verification limitation

JavaScript/JSX source parsing passed. A full Vite build could not be completed in this Linux environment because the uploaded `node_modules` contains only the macOS Rollup native binary; npm dependency installation timed out. Maven is not installed in this environment, so the Spring Boot package could not be compiled here. Reinstall dependencies on the deployment machine and run the normal frontend/backend build before publishing.
