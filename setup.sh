#!/bin/bash

# VeloStyle Quick Setup Script
# This script helps set up the development environment quickly

echo "╔════════════════════════════════════════════════════╗"
echo "║  VeloStyle E-Commerce - Quick Setup                ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env with your Supabase credentials!"
    echo ""
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd frontend

if [ ! -f ".env" ]; then
    echo "Creating frontend .env..."
    echo "VITE_API_URL=http://localhost:3000/api" > .env
fi

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Summary
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║  ✅ Setup Complete!                                ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Setup Supabase:"
echo "   - Create project at https://supabase.com"
echo "   - Run SQL from docs/DATABASE_SCHEMA.md"
echo "   - Create storage bucket named 'products'"
echo "   - Update backend/.env with your credentials"
echo ""
echo "2. Start Backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start Frontend (in new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Create Admin User:"
echo "   curl -X POST http://localhost:3000/api/auth/register \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"email\":\"admin@velostyle.com\",\"password\":\"admin123\",\"name\":\"Admin\",\"role\":\"super_admin\"}'"
echo ""
echo "5. Access Admin Panel:"
echo "   http://localhost:5173/admin/login"
echo ""
echo "📖 See TESTING_GUIDE.md for detailed instructions"
echo ""
