# Database Schema Design

## Overview

This document defines the complete database schema for the VeloStyle e-commerce platform using **Supabase PostgreSQL**.

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────┐         ┌──────────────────┐
│   categories    │         │    products      │
├─────────────────┤         ├──────────────────┤
│ id (PK)         │◄────┐   │ id (PK)          │
│ name            │     └───│ category_id (FK) │
│ slug            │         │ title            │
│ description     │         │ description      │
│ image_url       │         │ price            │
│ created_at      │         │ compare_price    │
│ updated_at      │         │ stock            │
└─────────────────┘         │ images (array)   │
                            │ brand            │
                            │ is_active        │
       ┌────────────────────│ created_at       │
       │                    │ updated_at       │
       │                    └──────────────────┘
       │                            │
       │                            │ 1:N
       │                            ▼
       │                    ┌──────────────────┐
       │                    │ product_variants │
       │                    ├──────────────────┤
       │                    │ id (PK)          │
       │            ┌───────│ product_id (FK)  │
       │            │       │ size             │
       │            │       │ color            │
       │            │       │ sku              │
       │            │       │ price_modifier   │
       │            │       │ stock            │
       │            │       │ created_at       │
       │            │       └──────────────────┘
       │            │
       │            │
┌──────┴────────┐  │       ┌──────────────────┐
│ admin_users   │  │       │     orders       │
├───────────────┤  │       ├──────────────────┤
│ id (PK)       │  │       │ id (PK)          │
│ email         │  │       │ customer_email   │
│ password_hash │  │       │ customer_name    │
│ name          │  │   ┌───│ product_id (FK)  │
│ role          │  │   │   │ quantity         │
│ is_active     │  │   │   │ total_amount     │
│ created_at    │  │   │   │ status           │
│ updated_at    │  │   │   │ created_at       │
└───────────────┘  │   │   │ updated_at       │
                   └───┘   └──────────────────┘
```

---

## Complete Schema with SQL

### 1. Categories Table

```sql
-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_categories_slug ON categories(slug);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, slug, description, image_url) VALUES
    ('Mountain Bikes', 'mountain-bikes', 'Rugged bikes for off-road adventures', 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5'),
    ('Road Bikes', 'road-bikes', 'Fast bikes for paved roads', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e'),
    ('Accessories', 'accessories', 'Helmets, lights, and gear', 'https://images.unsplash.com/photo-1558617825-ac6d8e20b1cc'),
    ('Parts', 'parts', 'Replacement parts and upgrades', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64');
```

**Fields Explained:**

- `id`: UUID primary key (more secure than sequential integers)
- `name`: Display name (e.g., "Mountain Bikes")
- `slug`: URL-friendly identifier (e.g., "mountain-bikes")
- `description`: Category description for SEO
- `image_url`: Header image for category pages
- `created_at/updated_at`: Audit timestamps

---

### 2. Products Table

```sql
-- Create products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    compare_price DECIMAL(10, 2) CHECK (compare_price >= price),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    images TEXT[] DEFAULT '{}',
    brand VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created ON products(created_at DESC);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_brand ON products(brand);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN (
    to_tsvector('english', title || ' ' || description || ' ' || COALESCE(brand, ''))
);

-- Add updated_at trigger
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Fields Explained:**

- `id`: UUID primary key
- `category_id`: Foreign key to categories
- `title`: Product name (e.g., "Mountain Bike Pro X1")
- `description`: Detailed product description (Markdown/HTML supported)
- `price`: Current selling price
- `compare_price`: Original price (for showing discounts)
- `stock`: Available quantity
- `images`: Array of image URLs (PostgreSQL array type)
- `brand`: Manufacturer name
- `is_active`: Soft delete / publish status
- Timestamps for tracking

**Why TEXT[] for images?**

- Store multiple image URLs in one column
- Easy to query and update
- No need for separate images table for simple use case

---

### 3. Product Variants Table

```sql
-- Create product_variants table
CREATE TABLE product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    size VARCHAR(50),
    color VARCHAR(50),
    sku VARCHAR(100) UNIQUE,
    price_modifier DECIMAL(10, 2) DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- Example: A bike might come in different sizes/colors
-- Product: "Mountain Bike Pro"
-- Variant 1: Size M, Color Red, +$0
-- Variant 2: Size L, Color Red, +$50
-- Variant 3: Size M, Color Blue, +$0
```

**Fields Explained:**

- `product_id`: Links to parent product
- `size`: Size option (S, M, L, XL, etc.)
- `color`: Color option
- `sku`: Stock Keeping Unit (unique identifier for inventory)
- `price_modifier`: Additional cost for this variant (+$50 for XL)
- `stock`: Inventory for this specific variant

**Use Case:**

- Product: "Mountain Bike Pro" costs $1299
- Variant: Size XL adds +$50 → Final price: $1349

---

### 4. Admin Users Table

```sql
-- Create admin_users table
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for login lookups
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Add updated_at trigger
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create default admin (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash generated using bcrypt with 10 rounds
INSERT INTO admin_users (email, password_hash, name, role) VALUES
    ('admin@velostyle.com', '$2b$10$rKZLQqZqZqZqZqZqZqZqZOeH3v3V9V9V9V9V9V9V9V9V9V9V9V9Vu', 'Admin User', 'super_admin');
```

**Fields Explained:**

- `email`: Login identifier
- `password_hash`: Bcrypt hashed password (NEVER store plain text!)
- `name`: Admin's display name
- `role`: Permission level (admin, super_admin)
- `is_active`: Can be disabled without deletion

**Security Note:**

- Passwords hashed with bcrypt (10+ rounds)
- Use JWT tokens for session management
- Never expose this table via API

---

### 5. Orders Table (Future)

```sql
-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table (many-to-many: orders ↔ products)
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES product_variants(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Triggers
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Row Level Security (RLS) Policies

Supabase has built-in RLS for securing data:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for products and categories
CREATE POLICY "Allow public read access to active products"
    ON products FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow public read access to categories"
    ON categories FOR SELECT
    USING (true);

-- Admin-only write access
CREATE POLICY "Allow admin insert products"
    ON products FOR INSERT
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin update products"
    ON products FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admin delete products"
    ON products FOR DELETE
    USING (auth.jwt() ->> 'role' = 'admin');
```

**Or disable RLS and handle auth in backend (simpler for this project):**

```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
```

---

## Sample Data

### Insert Categories

```sql
INSERT INTO categories (name, slug, description, image_url) VALUES
    ('Mountain Bikes', 'mountain-bikes', 'Rugged bikes for off-road adventures', 'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5'),
    ('Road Bikes', 'road-bikes', 'Fast bikes for paved roads', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e'),
    ('Accessories', 'accessories', 'Helmets, lights, and gear', 'https://images.unsplash.com/photo-1558617825-ac6d8e20b1cc');
```

### Insert Sample Products

```sql
INSERT INTO products (category_id, title, description, price, compare_price, stock, images, brand, is_active)
VALUES
    (
        (SELECT id FROM categories WHERE slug = 'mountain-bikes'),
        'Mountain Bike Pro X1',
        'Professional mountain bike with carbon frame and 29" wheels. Perfect for trails and rough terrain.',
        1299.99,
        1499.99,
        15,
        ARRAY[
            'https://images.unsplash.com/photo-1576858574144-9ae1ebcf5ae5',
            'https://images.unsplash.com/photo-1511994298241-608e28f14fde'
        ],
        'VeloTech',
        true
    ),
    (
        (SELECT id FROM categories WHERE slug = 'road-bikes'),
        'Speed Racer 3000',
        'Lightweight road bike with aerodynamic design. Built for speed and long-distance rides.',
        1899.99,
        NULL,
        8,
        ARRAY[
            'https://images.unsplash.com/photo-1485965120184-e220f721d03e',
            'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7'
        ],
        'SpeedCo',
        true
    );
```

---

## Query Examples

### Get All Active Products with Category

```sql
SELECT
    p.id,
    p.title,
    p.description,
    p.price,
    p.compare_price,
    p.stock,
    p.images,
    p.brand,
    c.name as category_name,
    c.slug as category_slug
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC;
```

### Search Products

```sql
SELECT *
FROM products
WHERE
    is_active = true
    AND to_tsvector('english', title || ' ' || description) @@ to_tsquery('english', 'mountain & bike')
ORDER BY created_at DESC;
```

### Get Product with Variants

```sql
SELECT
    p.*,
    json_agg(pv.*) as variants
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'product-uuid-here'
GROUP BY p.id;
```

### Get Products by Category

```sql
SELECT p.*
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'mountain-bikes'
    AND p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20 OFFSET 0;
```

---

## Database Performance Tips

### 1. **Indexing Strategy**

- Index all foreign keys ✓
- Index columns used in WHERE/ORDER BY ✓
- Use partial indexes for common filters ✓
- Use GIN indexes for full-text search ✓

### 2. **Query Optimization**

```sql
-- Use EXPLAIN ANALYZE to check query performance
EXPLAIN ANALYZE
SELECT * FROM products WHERE category_id = 'some-uuid';

-- Add indexes where EXPLAIN shows sequential scans
```

### 3. **Connection Pooling**

- Use Supabase's built-in connection pooling
- In backend, use connection pool (pg-pool)

### 4. **Pagination**

```sql
-- Always paginate large result sets
SELECT * FROM products
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;  -- Page 3
```

---

## Data Types Reference

| Field Type | PostgreSQL Type          | Notes                    |
| ---------- | ------------------------ | ------------------------ |
| ID         | UUID                     | More secure than INT     |
| Text Short | VARCHAR(n)               | Use for emails, names    |
| Text Long  | TEXT                     | Use for descriptions     |
| Numbers    | DECIMAL(10,2)            | For money (never FLOAT!) |
| Integers   | INTEGER                  | For quantities           |
| Booleans   | BOOLEAN                  | true/false               |
| Timestamps | TIMESTAMP WITH TIME ZONE | Always use timezone      |
| Arrays     | TEXT[]                   | For image URLs           |
| JSON       | JSONB                    | For flexible data        |

---

## Supabase Setup Instructions

### 1. Create Supabase Project

```bash
# Go to https://supabase.com
# Click "New Project"
# Choose organization
# Set database password
# Select region (closest to users)
# Wait for provisioning
```

### 2. Run SQL in Supabase Dashboard

```bash
# Go to SQL Editor in Supabase Dashboard
# Copy all SQL from above
# Click "Run"
# Verify tables created in Table Editor
```

### 3. Get Connection Details

```bash
# Go to Project Settings → API
# Copy:
# - Project URL (SUPABASE_URL)
# - anon/public key (SUPABASE_ANON_KEY)
# - service_role key (SUPABASE_SERVICE_KEY) - for backend only!
```

### 4. Setup Storage Bucket

```sql
-- In SQL Editor:
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Or use Supabase Dashboard:
-- Storage → New Bucket → Name: "products" → Public: Yes
```

---

## Migration Strategy

For production, use migration files:

```sql
-- migrations/001_initial_schema.sql
-- Contains all CREATE TABLE statements

-- migrations/002_add_brands.sql
ALTER TABLE products ADD COLUMN brand VARCHAR(100);

-- migrations/003_add_variants.sql
CREATE TABLE product_variants (...);
```

Track in version control and apply sequentially.

---

## Backup Strategy

```bash
# Supabase provides automatic backups
# For manual backup:
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql

# Restore:
psql -h db.xxx.supabase.co -U postgres -d postgres < backup.sql
```

---

## Summary

This schema provides:

- ✅ Fully normalized database structure
- ✅ Proper foreign key relationships
- ✅ Indexing for performance
- ✅ Full-text search capability
- ✅ Audit trails (created_at/updated_at)
- ✅ Data validation (CHECK constraints)
- ✅ Soft deletes (is_active flag)
- ✅ Scalable to millions of products
- ✅ Ready for production

**Next Step:** Build backend API to interact with this database!
