# Database Migrations

This directory contains SQL migration files for the VeloStyle database.

## How to Apply Migrations

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the migration file you want to run
4. Copy the SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute

### Migration Files

- `001_orders.sql` - Orders and order items tables
- `002_customers.sql` - Customer authentication tables
- `003_coupons.sql` - Coupon/discount system tables

### Running the Coupons Migration

To enable the coupon system, run the `003_coupons.sql` migration:

```sql
-- This will create:
-- 1. coupons table with all required fields
-- 2. Indexes for performance
-- 3. Updated_at trigger
-- 4. Sample coupon data (SAVE10, FLAT100, WELCOME20)
```

After running the migration, the coupon system will be fully functional:
- Customers can apply coupons at checkout
- Admins can manage coupons at `/admin/coupons`
- API endpoint `/api/coupons/validate` validates coupon codes

## Verification

After running a migration, verify it was successful:

```sql
-- Check if coupons table exists
SELECT * FROM coupons;

-- Check sample data
SELECT code, discount_type, discount_value FROM coupons WHERE is_active = true;
```
