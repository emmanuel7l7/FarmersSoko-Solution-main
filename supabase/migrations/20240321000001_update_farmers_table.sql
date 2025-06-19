-- Drop existing farmers table if it exists
DROP TABLE IF EXISTS farmers CASCADE;

-- Create farmers table with updated schema
CREATE TABLE farmers (
    id UUID REFERENCES profiles(id) PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    farm_name TEXT,
    location TEXT,
    description TEXT,
    role TEXT DEFAULT 'farmer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Drop and recreate the handle_new_user function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Get role from metadata or default to 'customer'
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');
    
    -- Insert into profiles
    INSERT INTO public.profiles (id, role)
    VALUES (NEW.id, user_role);
    
    -- Insert into role-specific table
    IF user_role = 'farmer' THEN
        INSERT INTO public.farmers (
            id, 
            first_name, 
            last_name,
            email,
            phone,
            farm_name,
            location,
            description,
            role
        )
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'phone', ''),
            COALESCE(NEW.raw_user_meta_data->>'farm_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'location', ''),
            COALESCE(NEW.raw_user_meta_data->>'description', ''),
            'farmer'
        );
    ELSIF user_role = 'customer' THEN
        INSERT INTO public.customers (id, first_name, last_name)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'last_name', '')
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Farmers can view their own data"
    ON farmers FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Farmers can update their own data"
    ON farmers FOR UPDATE
    USING (auth.uid() = id); 