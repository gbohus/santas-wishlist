-- Drop existing tables and function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP TABLE IF EXISTS public.wishes CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create tables
CREATE TABLE public.wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'delivered')),
    CONSTRAINT valid_category CHECK (category IN ('toys', 'books', 'electronics', 'clothes', 'other'))
);

CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    username TEXT NOT NULL,
    avatar TEXT,
    nice_score INTEGER DEFAULT 75 CHECK (nice_score >= 0 AND nice_score <= 100),
    achievements JSONB DEFAULT '[]'::jsonb
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_wishes_updated_at
    BEFORE UPDATE ON wishes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Set up RLS
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for wishes table
CREATE POLICY "Users can view their own wishes"
    ON public.wishes
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishes"
    ON public.wishes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishes"
    ON public.wishes
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishes"
    ON public.wishes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for user_profiles table
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX wishes_user_id_idx ON public.wishes(user_id);
CREATE INDEX wishes_status_idx ON public.wishes(status);
CREATE INDEX wishes_category_idx ON public.wishes(category);
CREATE INDEX user_profiles_user_id_idx ON public.user_profiles(user_id); 