# VeloStyle Backend API

A fully dynamic e-commerce backend API built with Node.js, Express, and Supabase.

## Features

- 🔐 JWT-based authentication
- 📦 Complete product management (CRUD)
- 🗂️ Category management
- 📸 Image upload to Supabase Storage
- 🔍 Product search and filtering
- 🛡️ Protected admin routes
- ✅ Input validation
- 🚀 Production-ready architecture

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT
- **Validation**: Express Validator

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=your-super-secret-key
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to SQL Editor
4. Run the SQL from `/docs/DATABASE_SCHEMA.md`
5. Create a storage bucket named "products" (make it public)

### 4. Create First Admin User

Run the server and use the register endpoint:

```bash
npm run dev
```

Then make a POST request:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@velostyle.com",
    "password": "your-secure-password",
    "name": "Admin User",
    "role": "super_admin"
  }'
```

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ostyle.com",
    "password": "VElOPASS",
    "name": "Admin User",
    "role": "super_admin"
  }'

### 5. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Public Endpoints (No Auth Required)

#### Products

- `GET /api/products` - Get all products
  - Query params: `category`, `minPrice`, `maxPrice`, `brand`, `page`, `limit`
- `GET /api/products/:id` - Get single product
- `GET /api/products/search?q=mountain` - Search products

#### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category

#### Auth

- `POST /api/auth/login` - Login (returns JWT token)
  ```json
  {
    "email": "admin@velostyle.com",
    "password": "your-password"
  }
  ```

### Protected Endpoints (Requires Auth Token)

Add header: `Authorization: Bearer <your-jwt-token>`

#### Products

- `POST /api/products` - Create new product
  ```json
  {
    "title": "Mountain Bike Pro",
    "description": "High-quality mountain bike",
    "price": 1299.99,
    "compare_price": 1499.99,
    "stock": 15,
    "category_id": "uuid-here",
    "images": ["url1", "url2"],
    "brand": "VeloTech",
    "is_active": true
  }
  ```
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product (soft delete)

#### Categories

- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category

#### Upload

- `POST /api/upload` - Upload single image
  - Form data: `image` (file)
  - Returns: `{ url, path }`
- `POST /api/upload/multiple` - Upload multiple images
  - Form data: `images` (multiple files)

#### Auth

- `GET /api/auth/me` - Get current user info

## Testing with cURL

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@velostyle.com","password":"your-password"}'
```

### Get Products

```bash
curl http://localhost:3000/api/products
```

### Create Product (with auth)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "New Mountain Bike",
    "description": "Amazing bike",
    "price": 1299.99,
    "stock": 10,
    "category_id": "CATEGORY_UUID",
    "images": ["https://example.com/image.jpg"],
    "brand": "VeloTech"
  }'
```

### Upload Image

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/image.jpg"
```

## Folder Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── supabase.js      # Supabase client
│   │   └── jwt.js           # JWT utilities
│   ├── controllers/         # Request handlers
│   │   ├── productController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── uploadController.js
│   ├── services/            # Business logic
│   │   ├── productService.js
│   │   ├── authService.js
│   │   ├── categoryService.js
│   │   └── uploadService.js
│   ├── middleware/          # Express middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── routes/              # API routes
│   │   ├── products.js
│   │   ├── auth.js
│   │   ├── categories.js
│   │   └── upload.js
│   └── app.js               # Express app setup
├── server.js                # Entry point
├── .env                     # Environment variables
├── .env.example             # Example env file
└── package.json
```

## Deployment

### Deploy to Railway

1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. New Project → Deploy from GitHub
4. Add environment variables
5. Deploy!

### Deploy to Render

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. New Web Service → Connect GitHub
4. Add environment variables
5. Deploy!

## Security Best Practices

- ✅ JWT tokens for authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configured
- ✅ Input validation
- ✅ SQL injection prevention (Supabase client handles this)
- ✅ File upload restrictions
- ⚠️ **Change JWT_SECRET in production!**
- ⚠️ **Use HTTPS in production!**

## Common Issues

### "Missing Supabase environment variables"

- Make sure `.env` file exists with correct values

### "Invalid token"

- Token might be expired (7 days default)
- Login again to get new token

### "Cannot find module"

- Run `npm install` again
- Check Node.js version (18+ required)

## License

MIT
