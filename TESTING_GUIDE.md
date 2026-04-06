# VeloStyle E-Commerce Platform - Complete Testing Guide

## 🚀 Quick Start

This guide will help you test the complete dynamic e-commerce system.

---

## Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Terminal/Command line access

---

## Step 1: Setup Supabase (5 minutes)

### 1.1 Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Name it: `velostyle-ecommerce`
4. Set a database password (save it!)
5. Choose region closest to you
6. Click "Create new project" (wait 2-3 minutes)

### 1.2 Get API Keys

1. Go to Project Settings (⚙️ icon) → API
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) ⚠️ Keep this secret!

### 1.3 Create Database Tables

1. Go to SQL Editor (left sidebar)
2. Click "New Query"
3. Open `/docs/DATABASE_SCHEMA.md` file
4. Copy ALL SQL from sections 1-4 (categories, products, product_variants, admin_users)
5. Paste into SQL Editor
6. Click "Run" (bottom right)
7. ✅ Verify: Go to Table Editor, you should see `categories`, `products`, etc.

### 1.4 Setup Storage Bucket

1. Go to Storage (left sidebar)
2. Click "New Bucket"
3. Name: `products`
4. Make it **Public**: Toggle "Public bucket" to ON
5. Click "Create bucket"

### 1.5 Disable Row Level Security (For Simplicity)

In SQL Editor, run:

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

---

## Step 2: Configure Backend (2 minutes)

### 2.1 Edit Backend .env File

Open `/backend/.env` and replace with your Supabase values:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=my-super-secret-jwt-key-2024-change-in-production
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important**: Use YOUR actual values from Step 1.2!

### 2.2 Install Backend Dependencies

```bash
cd backend
npm install
```

---

## Step 3: Start Backend Server (1 minute)

```bash
cd backend
npm run dev
```

You should see:

```
╔═══════════════════════════════════════════════════╗
║   VeloStyle E-Commerce Backend API               ║
║   🚀 Server running on port 3000                  ║
╚═══════════════════════════════════════════════════╝
```

✅ Test it: Open http://localhost:3000/health in browser
You should see: `{"status":"ok","message":"VeloStyle API is running"}`

**Leave this terminal running!**

---

## Step 4: Configure Frontend (1 minute)

Open a **NEW terminal** (keep backend running in first terminal)

Frontend `.env` is already created. Verify it has:

```env
VITE_API_URL=http://localhost:3000/api
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## Step 5: Start Frontend (1 minute)

```bash
cd frontend
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

✅ Open http://localhost:5173 in browser

**Leave this terminal running too!**

---

## Step 6: Create First Admin User (2 minutes)

Use one of these methods:

### Method 1: Using cURL (Terminal)

Open a **third terminal** and run:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@velostyle.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "super_admin"
  }'
```

### Method 2: Using Supabase Dashboard

1. Go to Supabase → Table Editor → `admin_users`
2. Click "Insert" → "Insert row"
3. Fill:
   - email: `admin@velostyle.com`
   - password_hash: `$2b$10$YourHashedPasswordHere` (use bcrypt online)
   - name: `Admin User`
   - role: `super_admin`
   - is_active: `true`

### Method 3: Using Postman/Insomnia

- Method: POST
- URL: `http://localhost:3000/api/auth/register`
- Body (JSON):

```json
{
  "email": "admin@velostyle.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "super_admin"
}
```

---

## Step 7: Test Admin Panel (5 minutes)

### 7.1 Login to Admin

1. Go to: http://localhost:5173/admin/login
2. Enter:
   - Email: `admin@velostyle.com`
   - Password: `admin123`
3. Click "Sign in"
4. ✅ You should be redirected to Admin Dashboard

### 7.2 Add Your First Product

1. Click "Add Product" button
2. Fill the form:
   - **Title**: Mountain Bike Pro X1
   - **Description**: High-performance mountain bike with carbon frame
   - **Price**: 1299.99
   - **Stock**: 15
   - **Category**: Select "Mountain Bikes"
   - **Brand**: VeloTech
3. Upload an image (use any bike image from your computer)
4. Click "Create Product"

✅ Product should appear in the Products list!

### 7.3 Add More Products

Add 2-3 more products with different categories:

- Road bike
- Accessories (helmet, lights)
- Parts

---

## Step 8: Test Customer Website (3 minutes)

### 8.1 View Products on Homepage

1. Go to: http://localhost:5173
2. ✅ You should see your newly added products!
3. Notice: **No code changes needed** - products appear automatically

### 8.2 Test Product Detail Page

1. Click on any product
2. ✅ You should see full product details
3. All data fetched from API dynamically

### 8.3 Test Shop Page

1. Go to: http://localhost:5173/shop
2. ✅ All products should be listed
3. Try filters if available

---

## Step 9: Verify Dynamic Behavior (THE KEY TEST!)

This proves it works like Amazon:

### 9.1 Add Product Without Changing Code

1. Open Admin Panel: http://localhost:5173/admin/products/new
2. Add a NEW product: "Electric Scooter X5"
3. Save it

### 9.2 See It Appear Instantly

1. **WITHOUT restarting anything**
2. **WITHOUT changing any code**
3. Go to: http://localhost:5173
4. ✅ **New product appears automatically!**

**This is exactly how Amazon works!** 🎉

---

## Testing with API Endpoints

### Get All Products (Public)

```bash
curl http://localhost:3000/api/products
```

### Get Categories (Public)

```bash
curl http://localhost:3000/api/categories
```

### Login (Get Token)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@velostyle.com","password":"admin123"}'
```

Save the token from response!

### Create Product with API (Protected)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New Product via API",
    "description": "Added directly via API",
    "price": 999.99,
    "stock": 10,
    "category_id": "CATEGORY_UUID_FROM_DB",
    "brand": "TestBrand",
    "images": ["https://via.placeholder.com/400"],
    "is_active": true
  }'
```

### Upload Image (Protected)

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/your/image.jpg"
```

---

## Common Issues & Solutions

### Issue 1: "Missing Supabase environment variables"

**Solution**: Check `/backend/.env` file exists and has correct values

### Issue 2: "Cannot connect to database"

**Solution**:

- Verify Supabase project is running (not paused)
- Check SUPABASE_URL is correct
- Ensure RLS is disabled (Step 1.5)

### Issue 3: "Login failed"

**Solution**:

- Make sure admin user was created (Step 6)
- Password is correct: `admin123`

### Issue 4: "Images not uploading"

**Solution**:

- Verify Storage bucket named `products` exists
- Bucket must be PUBLIC
- Check file size < 5MB

### Issue 5: Port already in use

**Solution**:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue 6: "Network Error" in frontend

**Solution**:

- Backend must be running on port 3000
- Check VITE_API_URL in `/frontend/.env`
- CORS is configured correctly

---

## Verification Checklist

Before considering it "working", verify:

- ✅ Backend starts without errors
- ✅ Frontend starts without errors
- ✅ Can login to admin panel
- ✅ Can create products in admin
- ✅ Can upload images
- ✅ Products appear on customer website
- ✅ Product detail pages load
- ✅ Adding new product shows instantly (no code change needed)
- ✅ Can edit products
- ✅ Can delete products
- ✅ All data persisted in Supabase

---

## Architecture Verification

### How It Works (Amazon Model)

```
1. Admin adds product via dashboard
   ↓
2. Frontend sends POST to backend API
   ↓
3. Backend saves to Supabase database
   ↓
4. Customer visits website
   ↓
5. Frontend fetches products from API
   ↓
6. Products render dynamically
   ↓
NEW PRODUCT APPEARS - NO CODE CHANGE! ✨
```

### What Makes It Dynamic?

**OLD WAY (Hardcoded):**

```jsx
const products = [
  { id: 1, title: "Bike" }, // ❌ Hardcoded
];
```

**NEW WAY (Database-Driven):**

```jsx
useEffect(() => {
  fetch("/api/products") // ✅ From database
    .then((res) => res.json())
    .then((data) => setProducts(data));
}, []);
```

---

## Next Steps

### 1. Update Existing Shop Page to Use API

Currently `Shop.jsx` might use mock data. Update it to:

```jsx
import { useState, useEffect } from "react";
import { apiService } from "../services/api";

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiService.getProducts().then((res) => {
      setProducts(res.data.products);
    });
  }, []);

  // Rest of component...
};
```

### 2. Update Home Page

Make sure `Home.jsx` fetches from API instead of mock data.

### 3. Add More Features

- Search functionality
- Category filtering
- Pagination
- Product reviews
- Order management

---

## Production Deployment

When ready for production:

1. **Deploy Backend**: Railway, Render, or Heroku
2. **Deploy Frontend**: Vercel, Netlify, or Cloudflare Pages
3. **Update Environment Variables**:
   - Change JWT_SECRET to a secure random string
   - Update FRONTEND_URL to production URL
   - Update VITE_API_URL to production backend URL

---

## Summary

You now have a **fully dynamic e-commerce system** where:

- ✅ Products stored in database (Supabase)
- ✅ Admin panel to manage products
- ✅ Backend API for all operations
- ✅ Frontend fetches data dynamically
- ✅ **NO CODE CHANGES** needed to add products

**This is exactly how Amazon, Flipkart, and all major e-commerce sites work!**

---

## Questions?

Check the docs:

- `/docs/ARCHITECTURE.md` - System design
- `/docs/DATABASE_SCHEMA.md` - Database structure
- `/backend/README.md` - Backend API docs

Happy testing! 🚀
