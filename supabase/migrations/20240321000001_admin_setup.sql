-- Create admin_settings table to store admin configuration
CREATE TABLE admin_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on admin_settings
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only admins to view admin settings
CREATE POLICY "Only admins can view admin settings"
    ON admin_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (SELECT auth.uid())
            AND role = 'admin'
        )
    );

-- Create policy to allow only admins to update admin settings
CREATE POLICY "Only admins can update admin settings"
    ON admin_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = (SELECT auth.uid())
            AND role = 'admin'
        )
    );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = (SELECT auth.uid())
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to set up initial admin
CREATE OR REPLACE FUNCTION setup_initial_admin(admin_email TEXT)
RETURNS VOID AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Get the user ID for the admin email
    SELECT id INTO user_id
    FROM auth.users
    WHERE email = admin_email;

    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % does not exist', admin_email;
    END IF;

    -- Update the user's profile to be an admin
    UPDATE profiles
    SET role = 'admin'
    WHERE id = user_id;

    -- Insert admin email into admin_settings
    INSERT INTO admin_settings (admin_email)
    VALUES (admin_email)
    ON CONFLICT (admin_email) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if email is admin
CREATE OR REPLACE FUNCTION is_admin_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_settings
        WHERE admin_email = email
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update admin_settings updated_at
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin email (replace with your desired admin email)
INSERT INTO admin_settings (admin_email)
VALUES ('admin@farmerssoko.com')
ON CONFLICT (admin_email) DO NOTHING; 