-- Create a new migration for Clerk JWT configuration
CREATE OR REPLACE FUNCTION auth.clerk_user() RETURNS text AS $$
  SELECT COALESCE(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE sql;

-- Update RLS policies to use clerk_user() instead of auth.uid()
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Recreate policies with explicit type casting
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.clerk_user()::text = user_id::text);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.clerk_user()::text = user_id::text);

-- Add explicit type check constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS user_id_text_check;
ALTER TABLE profiles ADD CONSTRAINT user_id_text_check CHECK (user_id ~ '^user_[a-zA-Z0-9]+$');