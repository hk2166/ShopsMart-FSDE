# VeloStyle - Dynamic E-Commerce Platform

A fully dynamic e-commerce platform built with React, Express.js, and Supabase - works exactly like Amazon where products can be added through an admin panel without changing any code.

## 🌟 Key Features

- ✅ **Fully Dynamic Product System** - Add products via admin panel, they appear on website instantly
- ✅ **Database-Driven Architecture** - All data stored in Supabase PostgreSQL
- ✅ **Admin Dashboard** - Complete product management (Create, Read, Update, Delete)
- ✅ **Image Upload** - Upload product images to Supabase Storage
- ✅ **REST API** - Clean API ready for mobile apps
- ✅ **JWT Authentication** - Secure admin authentication
- ✅ **Production Ready** - Scalable architecture, proper error handling

## 🎯 How It Works (Amazon Model)

```
Admin adds "Mountain Bike Pro" via dashboard
        ↓
Product saved to Supabase database
        ↓
Customer visits website
        ↓
Website fetches products from API
        ↓
Mountain Bike Pro appears automatically!
NO CODE CHANGE NEEDED! ✨
```

## 📁 Project Structure

```
velostyle-main/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, validation
│   │   └── config/       # Configuration
│   ├── .env              # Environment variables
│   └── server.js         # Entry point
│
├── frontend/             # React website
│   ├── src/
│   │   ├── pages/        # Customer & Admin pages
│   │   ├── components/   # Reusable components
│   │   └── services/     # API calls
│   └── .env              # Frontend config
│
└── docs/                 # Documentation
    ├── ARCHITECTURE.md   # System design
    └── DATABASE_SCHEMA.md # Database structure
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account (free tier works)

### 1. Setup Supabase (5 minutes)

1. Create project at https://supabase.com
2. Run SQL from `/docs/DATABASE_SCHEMA.md` in SQL Editor
3. Create storage bucket named `products` (make it public)
4. Get API keys from Project Settings → API

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your Supabase credentials
npm install
npm run dev
```

Backend runs on: http://localhost:3000

### 3. Configure Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

### 4. Create Admin User

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

### 5. Test It!

1. **Admin Login**: a
2. **Add Products**: Use admin dashboard
3. **View Website**: http://localhost:5173
4. **See Magic**: Products appear automatically!

📖 **Detailed instructions**: See `TESTING_GUIDE.md`

## 📚 Documentation

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete step-by-step testing guide
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture & design decisions
- **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Complete database schema
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🔌 API Endpoints

### Public Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/categories` - Get all categories
- `POST /api/auth/login` - Admin login

### Protected Endpoints (Admin Only)

- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/upload` - Upload image
- `GET /api/auth/me` - Get current user

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT
- **Validation**: Express Validator

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS

## 🎨 Key Differences from Hardcoded Approach

### ❌ Old Way (Static)

```jsx
// Products hardcoded in code
const products = [{ id: 1, title: "Bike A", price: 999 }];
// To add product → Change code → Deploy
```

### ✅ New Way (Dynamic)

```jsx
// Products fetched from database
useEffect(() => {
  fetch("/api/products")
    .then((res) => res.json())
    .then(setProducts);
}, []);
// To add product → Use admin panel → No deployment!
```

## 📸 Screenshots

### Admin Dashboard

- View all products with stats
- Add/Edit/Delete products
- Upload images
- Manage categories

### Customer Website

- Dynamic product listings
- Product detail pages
- Shopping cart
- Checkout process

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected admin routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ SQL injection prevention

## 🚢 Deployment

### Backend

- **Recommended**: Railway, Render, or Heroku
- Add environment variables
- Set NODE_ENV=production

### Frontend

- **Recommended**: Vercel, Netlify, or Cloudflare Pages
- Update VITE_API_URL to production backend
- Build command: `npm run build`

### Database

- Supabase (already cloud-hosted)
- No additional setup needed

## 🐛 Troubleshooting

### Backend won't start

- Check `.env` file exists with correct Supabase credentials
- Run `npm install` again

### Frontend shows "Network Error"

- Ensure backend is running on port 3000
- Check VITE_API_URL in frontend `.env`

### Can't login to admin

- Verify admin user was created (Step 4)
- Check password is correct

### Images not uploading

- Verify storage bucket named `products` exists
- Ensure bucket is public
- Check file size < 5MB

## 📈 Future Enhancements

- [ ] Product search with Elasticsearch
- [ ] Payment integration (Stripe)
- [ ] Order management system
- [ ] Customer accounts
- [ ] Product reviews & ratings
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a portfolio project demonstrating modern e-commerce architecture. Feel free to fork and customize!

## 📄 License

MIT License - Feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

Built to demonstrate how major e-commerce platforms like Amazon work under the hood.

## 🎓 Learning Outcomes

After completing this project, you'll understand:

- ✅ How to build database-driven web applications
- ✅ REST API design and implementation
- ✅ JWT authentication flows
- ✅ File upload handling
- ✅ React state management
- ✅ Admin panel development
- ✅ Production-ready architecture
- ✅ **Most importantly**: How real e-commerce sites manage millions of products without changing code!

---

**Ready to test?** 👉 See [TESTING_GUIDE.md](TESTING_GUIDE.md) for step-by-step instructions!
