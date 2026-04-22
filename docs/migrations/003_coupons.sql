-- Create coupons table
CREATE TABLE coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('flat', 'percent')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order DECIMAL(10, 2) DEFAULT 0 CHECK (min_order >= 0),
    expiry_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- Add updated_at trigger
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order, expiry_date, is_active) VALUES
    ('SAVE10', 'percent', 10, 500, NOW() + INTERVAL '30 days', true),
    ('FLAT100', 'flat', 100, 1000, NOW() + INTERVAL '30 days', true),
    ('WELCOME20', 'percent', 20, 0, NOW() + INTERVAL '60 days', true);
