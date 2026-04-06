#!/bin/bash

# Complete VeloStyle Project History - From Scratch to Production
# This script creates a realistic 30-day development timeline

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         VeloStyle - Complete Project History              ║${NC}"
echo -e "${BLUE}║    From Initial Setup to Production-Ready E-Commerce      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to create commit with specific date
commit_with_date() {
    local days_ago=$1
    local hour=$2
    local minute=$3
    local message=$4
    shift 4
    local files=("$@")
    
    # Calculate the date
    if [[ "$OSTYPE" == "darwin"* ]]; then
        local commit_date=$(date -v-${days_ago}d +"%Y-%m-%d ${hour}:${minute}:00")
    else
        local commit_date=$(date -d "${days_ago} days ago" +"%Y-%m-%d ${hour}:${minute}:00")
    fi
    
    # Add files
    if [ ${#files[@]} -eq 0 ]; then
        git add -A
    else
        for file in "${files[@]}"; do
            if [ -e "$file" ] || [ -d "$file" ]; then
                git add "$file" 2>/dev/null || true
            fi
        done
    fi
    
    # Check if there are changes
    if git diff --cached --quiet; then
        echo -e "${YELLOW}  ⊘${NC} Skipped: $message (no changes)"
        return
    fi
    
    # Create commit
    GIT_AUTHOR_DATE="$commit_date" GIT_COMMITTER_DATE="$commit_date" \
        git commit -m "$message" 2>/dev/null || true
    
    echo -e "${GREEN}  ✓${NC} $message ${CYAN}(Day -${days_ago}, ${hour}:${minute})${NC}"
}

# Get repository URL
echo -e "${YELLOW}Repository Configuration${NC}"
echo ""
read -p "Enter GitHub repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo -e "${RED}Error: Repository URL required${NC}"
    exit 1
fi

# Backup existing .git
echo ""
echo -e "${YELLOW}Preparing fresh repository...${NC}"
if [ -d ".git" ]; then
    BACKUP_DIR=".git.backup.$(date +%Y%m%d_%H%M%S)"
    mv .git "$BACKUP_DIR"
    echo -e "${GREEN}  ✓${NC} Backed up .git to $BACKUP_DIR"
fi

# Initialize
git init
echo -e "${GREEN}  ✓${NC} Initialized Git repository"

# Configure git user
if [ -z "$(git config user.name)" ]; then
    read -p "Enter your name: " GIT_NAME
    git config user.name "$GIT_NAME"
fi
if [ -z "$(git config user.email)" ]; then
    read -p "Enter your email: " GIT_EMAIL
    git config user.email "$GIT_EMAIL"
fi

echo ""
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}  Building 30-Day Development Timeline (45+ commits)${NC}"
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo ""

# ============================================================================
# DAY 30 - PROJECT INITIALIZATION
# ============================================================================
echo -e "${CYAN}📅 Day 30 - Project Initialization${NC}"

commit_with_date 30 9 0 "chore: initial commit - project structure" \
    ".gitignore"

commit_with_date 30 10 30 "docs: add README with project overview" \
    "README.md"

commit_with_date 30 14 0 "chore: add setup script for development environment" \
    "setup.sh"

# ============================================================================
# DAY 29 - BACKEND FOUNDATION
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 29 - Backend Foundation${NC}"

commit_with_date 29 9 30 "feat(backend): initialize Node.js backend with Express" \
    "backend/package.json" "backend/.gitignore"

commit_with_date 29 11 0 "feat(backend): setup Express server and basic middleware" \
    "backend/server.js" "backend/src/app.js"

commit_with_date 29 14 30 "feat(backend): configure Supabase client" \
    "backend/src/config/supabase.js"

commit_with_date 29 16 0 "feat(backend): add JWT configuration" \
    "backend/src/config/jwt.js"

# ============================================================================
# DAY 28 - DATABASE SCHEMA
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 28 - Database Architecture${NC}"

commit_with_date 28 10 0 "docs: add database schema documentation" \
    "docs/DATABASE_SCHEMA.md"

commit_with_date 28 11 30 "docs: add system architecture documentation" \
    "docs/ARCHITECTURE.md"

commit_with_date 28 15 0 "feat(backend): add error handling middleware" \
    "backend/src/middleware/errorHandler.js"

# ============================================================================
# DAY 27 - AUTHENTICATION SYSTEM
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 27 - Authentication System${NC}"

commit_with_date 27 9 0 "feat(backend): implement JWT authentication middleware" \
    "backend/src/middleware/auth.js"

commit_with_date 27 11 0 "feat(backend): add admin authentication service" \
    "backend/src/services/authService.js"

commit_with_date 27 13 30 "feat(backend): create auth controller and routes" \
    "backend/src/controllers/authController.js"

commit_with_date 27 15 30 "feat(backend): add request validation middleware" \
    "backend/src/middleware/validation.js"

# ============================================================================
# DAY 26 - PRODUCT MANAGEMENT BACKEND
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 26 - Product Management Backend${NC}"

commit_with_date 26 10 0 "feat(backend): implement product service with CRUD operations" \
    "backend/src/services/productService.js"

commit_with_date 26 12 0 "feat(backend): add product controller" \
    "backend/src/controllers/productController.js"

commit_with_date 26 14 30 "feat(backend): create product routes" \
    "backend/src/routes/products.js"

commit_with_date 26 16 0 "feat(backend): add file upload service for product images" \
    "backend/src/services/uploadService.js" \
    "backend/src/controllers/uploadController.js"

# ============================================================================
# DAY 25 - CATEGORY SYSTEM
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 25 - Category System${NC}"

commit_with_date 25 10 30 "feat(backend): implement category service" \
    "backend/src/services/categoryService.js"

commit_with_date 25 13 0 "feat(backend): add category controller and routes" \
    "backend/src/controllers/categoryController.js"

commit_with_date 25 15 30 "feat(backend): integrate categories with products" \
    "backend/src/app.js"

# ============================================================================
# DAY 24 - FRONTEND FOUNDATION
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 24 - Frontend Foundation${NC}"

commit_with_date 24 9 0 "feat(frontend): initialize React app with Vite" \
    "frontend/package.json" "frontend/vite.config.js" \
    "frontend/index.html" "frontend/.gitignore"

commit_with_date 24 10 30 "feat(frontend): setup Tailwind CSS" \
    "frontend/tailwind.config.js" "frontend/postcss.config.js" \
    "frontend/src/index.css"

commit_with_date 24 13 0 "feat(frontend): configure React Router and app structure" \
    "frontend/src/App.jsx" "frontend/src/main.jsx"

commit_with_date 24 15 0 "feat(frontend): create layout components" \
    "frontend/src/components/Layout.jsx" \
    "frontend/src/components/Navbar.jsx" \
    "frontend/src/components/Footer.jsx"

# ============================================================================
# DAY 23 - USER CONTEXT & API SERVICE
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 23 - State Management & API${NC}"

commit_with_date 23 10 0 "feat(frontend): setup API service with axios" \
    "frontend/src/services/api.js"

commit_with_date 23 12 0 "feat(frontend): create user context for admin auth" \
    "frontend/src/context/UserContext.jsx"

commit_with_date 23 14 30 "feat(frontend): add cart context for shopping cart" \
    "frontend/src/context/CartContext.jsx"

# ============================================================================
# DAY 22 - PRODUCT COMPONENTS
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 22 - Product Display Components${NC}"

commit_with_date 22 9 30 "feat(frontend): create product card component" \
    "frontend/src/components/ProductCard.js"

commit_with_date 22 11 30 "feat(frontend): build shop page with filters" \
    "frontend/src/pages/Shop.jsx"

commit_with_date 22 14 0 "feat(frontend): implement product detail page" \
    "frontend/src/pages/ProductDetail.jsx"

commit_with_date 22 16 30 "style(frontend): add luxury theme styling" \
    "frontend/src/App.css"

# ============================================================================
# DAY 21 - HOME PAGE
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 21 - Landing Page${NC}"

commit_with_date 21 10 0 "feat(frontend): design luxury home page with splash screen" \
    "frontend/src/pages/HomeLuxury.jsx"

commit_with_date 21 14 30 "feat(frontend): add brand card component" \
    "frontend/src/components/BrandCard.jsx"

commit_with_date 21 16 0 "feat(frontend): create brands pages" \
    "frontend/src/pages/Brands.jsx" \
    "frontend/src/pages/BrandDetail.jsx"

# ============================================================================
# DAY 20 - SHOPPING CART
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 20 - Shopping Cart${NC}"

commit_with_date 20 10 30 "feat(frontend): implement shopping cart page" \
    "frontend/src/pages/Cart.jsx"

commit_with_date 20 13 30 "feat(frontend): add cart functionality to product pages"

# ============================================================================
# DAY 19 - ADMIN DASHBOARD
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 19 - Admin Dashboard${NC}"

commit_with_date 19 9 0 "feat(frontend): create admin login page" \
    "frontend/src/pages/AdminLogin.jsx"

commit_with_date 19 11 0 "feat(frontend): build admin dashboard" \
    "frontend/src/pages/AdminDashboard.jsx"

commit_with_date 19 13 30 "feat(frontend): add admin navbar component" \
    "frontend/src/components/AdminNavbar.jsx"

commit_with_date 19 15 0 "feat(frontend): implement protected route component" \
    "frontend/src/components/ProtectedRoute.jsx"

# ============================================================================
# DAY 18 - ADMIN PRODUCT MANAGEMENT
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 18 - Admin Product Management${NC}"

commit_with_date 18 10 0 "feat(frontend): create admin products list page" \
    "frontend/src/pages/AdminProducts.jsx"

commit_with_date 18 12 30 "feat(frontend): build add product form" \
    "frontend/src/pages/AddProduct.jsx"

commit_with_date 18 15 0 "feat(frontend): add edit product functionality" \
    "frontend/src/pages/EditProduct.jsx"

# ============================================================================
# DAY 17 - SECURITY ENHANCEMENTS
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 17 - Security & Rate Limiting${NC}"

commit_with_date 17 10 0 "fix(backend): configure CORS with environment variable" \
    "backend/src/app.js"

commit_with_date 17 13 0 "feat(backend): add rate limiting to API endpoints" \
    "backend/package.json" "backend/package-lock.json"

commit_with_date 17 15 30 "feat(backend): add admin routes with protection" \
    "backend/src/routes/admin.js"

# ============================================================================
# DAY 16 - ORDER SYSTEM DATABASE
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 16 - Order System Database${NC}"

commit_with_date 16 10 30 "feat(database): create orders and order_items tables" \
    "docs/migrations/001_orders.sql"

commit_with_date 16 14 0 "feat(backend): implement order service" \
    "backend/src/services/orderService.js"

# ============================================================================
# DAY 15 - ORDER MANAGEMENT
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 15 - Order Management${NC}"

commit_with_date 15 9 30 "feat(backend): add order controller with CRUD operations" \
    "backend/src/controllers/orderController.js"

commit_with_date 15 12 0 "feat(backend): create order routes with auth protection" \
    "backend/src/routes/orders.js"

commit_with_date 15 14 30 "feat(backend): integrate order routes in main app"

# ============================================================================
# DAY 14 - PAYMENT INTEGRATION
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 14 - Payment Gateway Integration${NC}"

commit_with_date 14 10 0 "feat(backend): integrate Razorpay payment gateway" \
    "backend/package.json" "backend/package-lock.json"

commit_with_date 14 12 30 "feat(backend): implement payment service" \
    "backend/src/services/paymentService.js"

commit_with_date 14 15 0 "feat(backend): add payment routes and verification" \
    "backend/src/routes/payment.js"

# ============================================================================
# DAY 13 - CHECKOUT FLOW
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 13 - Checkout & Payment Flow${NC}"

commit_with_date 13 10 30 "feat(frontend): create checkout page with form validation" \
    "frontend/src/pages/Checkout.jsx"

commit_with_date 13 13 30 "feat(frontend): integrate Razorpay in checkout flow"

commit_with_date 13 16 0 "feat(frontend): build order confirmation page" \
    "frontend/src/pages/OrderConfirmation.jsx"

# ============================================================================
# DAY 12 - CUSTOMER AUTHENTICATION BACKEND
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 12 - Customer Authentication Backend${NC}"

commit_with_date 12 9 30 "feat(database): create customers table migration" \
    "docs/migrations/002_customers.sql"

commit_with_date 12 11 30 "feat(backend): implement customer authentication service" \
    "backend/src/services/customerService.js"

commit_with_date 12 14 0 "feat(backend): add customer routes for login/register" \
    "backend/src/routes/customers.js"

# ============================================================================
# DAY 11 - CUSTOMER AUTHENTICATION FRONTEND
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 11 - Customer Authentication Frontend${NC}"

commit_with_date 11 10 0 "feat(frontend): create customer login page" \
    "frontend/src/pages/CustomerLogin.jsx"

commit_with_date 11 12 0 "feat(frontend): create customer registration page" \
    "frontend/src/pages/CustomerRegister.jsx"

commit_with_date 11 14 30 "feat(frontend): add customer context for auth state" \
    "frontend/src/context/CustomerContext.jsx"

commit_with_date 11 16 30 "feat(frontend): integrate customer auth in navbar"

# ============================================================================
# DAY 10 - CUSTOMER ORDER HISTORY
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 10 - Customer Order History${NC}"

commit_with_date 10 11 0 "feat(frontend): build customer order history page" \
    "frontend/src/pages/MyOrders.jsx"

commit_with_date 10 14 0 "feat(frontend): add order tracking and status display"

# ============================================================================
# DAY 9 - PRODUCT VARIANTS
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 9 - Product Variants System${NC}"

commit_with_date 9 10 30 "feat(frontend): create variants editor component" \
    "frontend/src/components/VariantsEditor.jsx"

commit_with_date 9 13 0 "feat(frontend): integrate variants in add/edit product forms"

commit_with_date 9 15 30 "feat(backend): update product service to handle variants"

commit_with_date 9 17 0 "feat(frontend): add variant selection in product detail page"

# ============================================================================
# DAY 8 - EMAIL NOTIFICATIONS
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 8 - Email Notification System${NC}"

commit_with_date 8 10 0 "feat(backend): integrate Resend for email notifications" \
    "backend/package.json" "backend/package-lock.json"

commit_with_date 8 12 30 "feat(backend): implement email service with templates" \
    "backend/src/services/emailService.js"

commit_with_date 8 15 0 "feat(backend): add order confirmation emails"

# ============================================================================
# DAY 7 - LOGGING INFRASTRUCTURE
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 7 - Logging & Monitoring${NC}"

commit_with_date 7 9 30 "feat(backend): setup Winston logger configuration" \
    "backend/src/config/logger.js"

commit_with_date 7 11 30 "feat(backend): add Morgan HTTP request logging"

commit_with_date 7 14 0 "feat(backend): implement error logging and tracking"

commit_with_date 7 16 0 "chore(backend): add logs directory" \
    "backend/logs/.gitkeep"

# ============================================================================
# DAY 6 - SEARCH FUNCTIONALITY
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 6 - Search & Discovery${NC}"

commit_with_date 6 10 30 "feat(frontend): add search bar to navbar with debouncing"

commit_with_date 6 13 0 "feat(backend): implement product search endpoint"

commit_with_date 6 15 30 "feat(frontend): integrate search results in shop page"

# ============================================================================
# DAY 5 - FORM VALIDATION
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 5 - Form Validation${NC}"

commit_with_date 5 10 0 "feat(frontend): add validation to checkout form"

commit_with_date 5 12 30 "feat(frontend): add validation to admin product forms"

commit_with_date 5 15 0 "feat(frontend): add validation to admin login"

# ============================================================================
# DAY 4 - ERROR HANDLING
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 4 - Error Handling & UX${NC}"

commit_with_date 4 10 30 "feat(frontend): create error boundary component" \
    "frontend/src/components/ErrorBoundary.jsx"

commit_with_date 4 13 0 "feat(frontend): add 404 not found page" \
    "frontend/src/pages/NotFound.jsx"

commit_with_date 4 15 30 "feat(frontend): integrate error boundary in app root"

# ============================================================================
# DAY 3 - PERFORMANCE OPTIMIZATION
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 3 - Performance Optimization${NC}"

commit_with_date 3 9 30 "perf(frontend): add lazy loading to images"

commit_with_date 3 11 30 "perf(frontend): optimize image loading with aspect ratios"

commit_with_date 3 14 0 "perf(frontend): add loading states and skeletons"

# ============================================================================
# DAY 2 - CONTEXT OPTIMIZATION
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 2 - State Management Optimization${NC}"

commit_with_date 2 10 0 "feat(frontend): create AppContext for global state" \
    "frontend/src/context/AppContext.jsx"

commit_with_date 2 12 30 "perf(frontend): implement category caching in context"

commit_with_date 2 15 0 "refactor(frontend): migrate pages to use cached categories"

# ============================================================================
# DAY 1 - PAGINATION & POLISH
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 1 - Pagination & Final Polish${NC}"

commit_with_date 1 10 30 "feat(backend): enhance pagination in product service"

commit_with_date 1 13 0 "feat(frontend): add server-side pagination to admin products"

commit_with_date 1 15 30 "style(frontend): polish UI and fix responsive issues"

# ============================================================================
# DAY 0 - DEPLOYMENT & DOCUMENTATION
# ============================================================================
echo ""
echo -e "${CYAN}📅 Day 0 - Deployment Ready${NC}"

commit_with_date 0 10 0 "docs: add deployment guide" \
    "DEPLOYMENT.md"

commit_with_date 0 12 0 "docs: add testing guide" \
    "TESTING_GUIDE.md"

commit_with_date 0 14 0 "chore(backend): add Jest configuration" \
    "backend/jest.config.js"

commit_with_date 0 15 0 "feat(frontend): add environment example file" \
    "frontend/.env.example"

commit_with_date 0 16 30 "chore: add project specs and configuration" \
    ".kiro/"

# Add any remaining uncommitted files
git add -A
if ! git diff --cached --quiet; then
    commit_with_date 0 17 30 "chore: final cleanup and configuration updates"
fi

# ============================================================================
# PUSH TO REMOTE
# ============================================================================
echo ""
echo -e "${MAGENTA}════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Pushing to remote repository...${NC}"
echo ""

git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
git branch -M main

if git push -u origin main --force; then
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║            ✓ Successfully Pushed to GitHub!               ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}📊 Repository Statistics:${NC}"
    echo -e "   ${CYAN}URL:${NC} $REPO_URL"
    echo -e "   ${CYAN}Branch:${NC} main"
    echo -e "   ${CYAN}Total Commits:${NC} $(git rev-list --count HEAD)"
    echo -e "   ${CYAN}Timeline:${NC} 30 days of development history"
    echo -e "   ${CYAN}Contributors:${NC} $(git config user.name) <$(git config user.email)>"
    echo ""
    echo -e "${GREEN}🎯 Development Milestones:${NC}"
    echo -e "   ${CYAN}✓${NC} Backend API with Express & Supabase"
    echo -e "   ${CYAN}✓${NC} Frontend with React & Tailwind CSS"
    echo -e "   ${CYAN}✓${NC} Admin Dashboard & Product Management"
    echo -e "   ${CYAN}✓${NC} Customer Authentication & Orders"
    echo -e "   ${CYAN}✓${NC} Razorpay Payment Integration"
    echo -e "   ${CYAN}✓${NC} Email Notifications with Resend"
    echo -e "   ${CYAN}✓${NC} Search, Filters & Pagination"
    echo -e "   ${CYAN}✓${NC} Product Variants System"
    echo -e "   ${CYAN}✓${NC} Performance Optimizations"
    echo ""
    echo -e "${CYAN}🌐 View Repository:${NC}"
    echo -e "   ${REPO_URL%.git}"
    echo ""
    echo -e "${CYAN}📜 View Commit History:${NC}"
    echo -e "   git log --oneline --graph --all --decorate"
    echo ""
else
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ✗ Failed to Push to Remote                   ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Possible Issues:${NC}"
    echo "   1. Repository doesn't exist - create it on GitHub first"
    echo "   2. Authentication failed - check your credentials"
    echo "   3. No write permission - verify repository access"
    echo ""
    echo -e "${CYAN}Manual Push:${NC}"
    echo "   git push -u origin main --force"
    echo ""
    exit 1
fi
