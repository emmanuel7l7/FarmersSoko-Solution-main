-- Drop existing policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Farmers can manage their own products" ON products;

-- Create optimized policies using subqueries
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    USING (true);  -- Everyone can view products

CREATE POLICY "Farmers can manage their own products"
    ON products FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (SELECT auth.uid())
            AND role = 'farmer'
            AND id = farmer_id
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (SELECT auth.uid())
            AND role = 'farmer'
            AND id = farmer_id
        )
    );

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY; 