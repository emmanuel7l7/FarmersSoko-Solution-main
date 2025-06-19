-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS ensure_user_profile();

-- Create updated function to handle user registration
CREATE OR REPLACE FUNCTION ensure_user_profile()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Default role is customer
    user_role := 'customer';

    -- Check if this is a farmer registration (you can add more conditions here)
    IF EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = NEW.id
        AND raw_user_meta_data->>'role' = 'farmer'
    ) THEN
        user_role := 'farmer';
    END IF;

    -- Create profile
    INSERT INTO profiles (id, role, created_at, updated_at)
    VALUES (
        NEW.id,
        user_role,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

    -- Create role-specific profile
    IF user_role = 'farmer' THEN
        INSERT INTO farmers (id, first_name, last_name, created_at, updated_at)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
            COALESCE(NEW.raw_user_meta_data->>'last_name', 'Farmer'),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    ELSE
        INSERT INTO customers (id, first_name, last_name, created_at, updated_at)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', 'New'),
            COALESCE(NEW.raw_user_meta_data->>'last_name', 'Customer'),
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_user_profile();

-- Fix any existing users without profiles
INSERT INTO profiles (id, role, created_at, updated_at)
SELECT 
    id,
    COALESCE(
        (SELECT role FROM profiles WHERE id = auth.users.id),
        'customer'
    ),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Fix any existing users without customer/farmer profiles
INSERT INTO customers (id, first_name, last_name, created_at, updated_at)
SELECT 
    id,
    'New',
    'Customer',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM auth.users
WHERE id NOT IN (SELECT id FROM customers)
AND id IN (SELECT id FROM profiles WHERE role = 'customer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO farmers (id, first_name, last_name, created_at, updated_at)
SELECT 
    id,
    'New',
    'Farmer',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM auth.users
WHERE id NOT IN (SELECT id FROM farmers)
AND id IN (SELECT id FROM profiles WHERE role = 'farmer')
ON CONFLICT (id) DO NOTHING; 