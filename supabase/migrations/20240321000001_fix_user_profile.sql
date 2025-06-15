-- Function to ensure user profile exists
CREATE OR REPLACE FUNCTION ensure_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if profile exists
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = NEW.id
  ) THEN
    -- Create profile with default role
    INSERT INTO profiles (id, role, created_at, updated_at)
    VALUES (
      NEW.id,
      'customer',
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create profile when user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_profile();

-- Fix existing users without profiles
INSERT INTO profiles (id, role, created_at, updated_at)
SELECT 
  id,
  'customer',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING; 