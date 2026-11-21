Homepage mobile product grid + admin product visibility fix

Changes:
- Homepage now loads the newest active products from GET /api/products?page=0&size=100&sortBy=newest.
  This includes normal products created in Admin even when Featured/Best Seller/Trending flags are off.
- Product grid shows 2 columns on phones and 4 columns on large desktop screens.
- Product cards use smaller mobile image, spacing, title, price, rating and action-button sizing.
- Existing five hero banners, backend, Admin, cart, checkout and payment code are unchanged.

Install/run:
1. Open frontend folder in Terminal.
2. npm install
3. npm run dev

No node_modules folder is included; npm install recreates dependencies for the target computer.
