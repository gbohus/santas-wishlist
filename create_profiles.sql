-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    username TEXT NOT NULL,
    avatar TEXT,
    nice_score INTEGER DEFAULT 75 CHECK (nice_score >= 0 AND nice_score <= 100),
    achievements JSONB DEFAULT '[]'::jsonb
); 

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles table
CREATE POLICY "Enable insert for service role" ON public.user_profiles
    FOR INSERT
    WITH CHECK (true);  -- Allow inserts from service role

CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX user_profiles_user_id_idx ON public.user_profiles(user_id);