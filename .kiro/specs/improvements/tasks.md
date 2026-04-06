# VeloStyle — Implementation Tasks

Tasks are ordered by priority. Each task is self-contained and can be worked on independently unless a dependency is noted.

---

## Phase 1 — Critical Blockers

- [x] 1. Fix CORS configuration to use `FRONTEND_URL` env variable instead of `origin: true`
  - Edit `backend/src/app.js`
  - Read `FRONTEND_URL` from `process.env` and use as the allowed origin
  - Fall back to `http://localhost:5173` in development

- [x] 2. Add `express-rate-limit` to auth and upload routes
  - Install `express-rate-limit` in backend
  - Apply 10 req/min limit to `POST /api/auth/login` and `POST /api/auth/register`
  - Apply 100 req/min general limit to all `/api/*` routes

- [x] 3. Create `orders` and `order_items` tables in Supabase
  - Write SQL migration for `orders` (id, customer_name, customer_email, customer_phone, address, total, status, payment_id, created_at)
  - Write SQL migration for `order_items` (id, order_id, product_id, quantity, price, size)
  - Add foreign key constraints

- [x] 4. Build order backend — service, controller, and routes
  - Create `backend/src/services/orderService.js` with `createOrder`, `getAllOrders`, `getOrderById`, `updateOrderStatus`
  - Create `backend/src/controllers/orderController.js`
  - Create `backend/src/routes/orders.js` and register in `app.js`
  - Protect admin-only routes (list all orders, update status) with auth middleware

- [x] 5. Integrate Razorpay payment on checkout
  - Install `razorpay` in backend
  - Add `POST /api/orders/create-payment` endpoint that creates a Razorpay order
  - Add `POST /api/orders/verify-payment` endpoint that verifies signature and saves order to DB
  - Update `frontend/src/pages/Checkout.jsx` to call these endpoints and load Razorpay checkout script
  - Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `backend/.env`

- [x] 6. Update `OrderConfirmation.jsx` to show real order data
  - Fetch order by ID from `GET /api/orders/:id`
  - Display order items, total, payment ID, and estimated delivery

---

## Phase 2 — Core E-Commerce Features

- [x] 7. Add edit and delete to admin products list
  - Add Edit button to each row in `frontend/src/pages/AdminProducts.jsx`
  - Create `frontend/src/pages/EditProduct.jsx` (pre-filled form, reuse AddProduct logic)
  - Add route `/admin/products/:id/edit` in `App.jsx`
  - Add Delete button with a confirmation modal that calls `DELETE /api/products/:id`

- [x] 8. Wire search bar to backend search endpoint
  - Add a search input to `frontend/src/components/Navbar.jsx`
  - On input change (debounced 300ms), call `GET /api/products/search?q=...`
  - Show results in a dropdown or navigate to `/shop?q=...`
  - Update `Shop.jsx` to read `q` from URL params and filter accordingly

- [x] 9. Build customer authentication
  - Create `frontend/src/pages/CustomerLogin.jsx` and `CustomerRegister.jsx`
  - Add routes `/login` and `/register` in `App.jsx`
  - Add `POST /api/customers/register` and `POST /api/customers/login` backend endpoints
  - Create `customers` table in Supabase (id, name, email, password_hash, phone, created_at)
  - Store customer JWT in localStorage, expose via a `CustomerContext`
  - Add "My Account" / "Login" link in `Navbar.jsx`

- [x] 10. Build customer order history page
  - Depends on task 9 (customer auth)
  - Create `frontend/src/pages/MyOrders.jsx`
  - Add route `/my-orders` protected by customer auth
  - Fetch orders by customer email from `GET /api/orders?email=...`
  - Display order list with status badges and item details

- [x] 11. Add product variants to admin form and product detail page
  - Update `AddProduct.jsx` and `EditProduct.jsx` to include a variants section (add/remove rows for size, color, SKU, stock, price modifier)
  - Update `productService.js` to upsert into `product_variants` table on create/update
  - Update `ProductDetail.jsx` size selector to use real variant data from the API response

- [x] 12. Integrate email notifications with Resend (or SendGrid)
  - Install `resend` (or `@sendgrid/mail`) in backend
  - Add `RESEND_API_KEY` (or `SENDGRID_API_KEY`) to `.env`
  - Create `backend/src/services/emailService.js` with `sendOrderConfirmation(order)` and `sendAdminNewOrderAlert(order)`
  - Call `sendOrderConfirmation` after successful payment verification in order controller
  - Create simple HTML email templates for both

---

## Phase 3 — Security & Stability

- [x] 13. Add structured logging with Morgan and Winston
  - Install `morgan` and `winston` in backend
  - Configure Winston with console + file transports (info level for requests, error level for exceptions)
  - Add Morgan middleware in `app.js` using Winston as the stream
  - Log unhandled promise rejections and uncaught exceptions in `server.js`

- [x] 14. Add frontend form validation
  - Add validation to `Checkout.jsx`: required name, email, phone (10 digits), address fields
  - Add validation to `AddProduct.jsx` / `EditProduct.jsx`: title required, price > 0, stock >= 0
  - Add validation to `AdminLogin.jsx`: valid email format, password min 6 chars
  - Show inline error messages below each field

- [x] 15. Add a global 404 page and React error boundary
  - Create `frontend/src/pages/NotFound.jsx` with a "Page not found" message and home link
  - Add a catch-all `<Route path="*" element={<NotFound />} />` in `App.jsx`
  - Create `frontend/src/components/ErrorBoundary.jsx` and wrap the app root in `main.jsx`

---

## Phase 4 — Performance & UX Polish

- [x] 16. Add lazy loading and image optimization
  - Add `loading="lazy"` attribute to all `<img>` tags in `ProductCard.jsx`, `HomeLuxury.jsx`, `Shop.jsx`, `ProductDetail.jsx`
  - Use Supabase image transform URL params (`?width=400&quality=80`) for product thumbnails
  - Add `aspect-ratio` CSS to image containers to prevent layout shift

- [x] 17. Cache categories in context to avoid repeated fetches
  - Update `frontend/src/context/UserContext.jsx` (or create a new `AppContext`) to fetch and store categories once on app load
  - Consume cached categories in `Shop.jsx`, `HomeLuxury.jsx`, and `Navbar.jsx` instead of fetching per page

- [x] 18. Add server-side pagination to admin products list
  - Update `AdminProducts.jsx` to track `page` state and pass it to `apiService.getProducts({ page, limit: 20 })`
  - Add Previous / Next pagination controls at the bottom of the list
  - Show "Showing X–Y of Z products" count

- [ ] 19. Add `Cache-Control` headers to GET product and category endpoints
  - In `backend/src/controllers/productController.js` and `categoryController.js`, set `res.set('Cache-Control', 'public, max-age=60')` on list responses
  - This allows CDN/browser to cache responses for 60 seconds

---

## Phase 5 — Analytics & Operations

- [ ] 20. Build real admin analytics dashboard
  - Add `GET /api/admin/stats` backend endpoint returning: total products, total orders, total revenue, orders today, low-stock products (stock < 5)
  - Update `AdminDashboard.jsx` to fetch and display these stats
  - Add a simple bar chart for orders per day using `recharts`

- [ ] 21. Build discount/coupon system
  - Create `coupons` table in Supabase (id, code, discount_type: flat|percent, discount_value, min_order, expiry_date, is_active)
  - Add `POST /api/coupons/validate` endpoint (public) that checks code validity and returns discount
  - Add coupon input field in `Checkout.jsx` that calls the validate endpoint and applies discount to total
  - Add coupon management page in admin (`/admin/coupons`)

- [ ] 22. Complete or remove Brands pages
  - Decision: if brands are not a planned feature, remove `Brands` and `BrandDetail` routes from `App.jsx` and the Navbar link
  - If keeping: wire `Brands.jsx` to fetch unique brands from `GET /api/products?groupBy=brand` and display as cards; wire `BrandDetail.jsx` to filter products by brand

---

## Tech Debt

- [ ] 23. Move magic numbers to a constants file
  - Create `frontend/src/constants.js` with `DELIVERY_FEE`, `SPLASH_TIMEOUT`, `DEFAULT_PAGE_SIZE`, etc.
  - Replace all hardcoded values in components

- [ ] 24. Add `PropTypes` to all components
  - Add `PropTypes` validation to `ProductCard`, `BrandCard`, `Layout`, `ProtectedRoute`, and all page components that receive props

- [ ] 25. Add a `frontend/.env.example` file
  - Document all required frontend env variables with placeholder values
  - Ensure `.env` is in `.gitignore` (already is, but verify)
