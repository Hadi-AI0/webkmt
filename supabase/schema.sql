-- Supabase Schema for WebKMT Platform

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE user_plan AS ENUM ('free', 'premium');

-- 2. Create Profiles Table (extends auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role user_role DEFAULT 'user'::user_role NOT NULL,
    plan user_plan DEFAULT 'free'::user_plan NOT NULL,
    photo_url TEXT,
    preferences JSONB DEFAULT '{"theme": "light", "language": "en", "notifications": true}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_sign_in TIMESTAMP WITH TIME ZONE,
    last_seen_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create Blogs Table
CREATE TABLE public.blogs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_email TEXT,
    published BOOLEAN DEFAULT false NOT NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    tags TEXT[] DEFAULT '{}'::text[] NOT NULL,
    meta_description TEXT,
    featured_image TEXT,
    thumbnail_image TEXT,
    read_time TEXT DEFAULT '5 min read' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create KMT Link Profiles Table
CREATE TABLE public.kmtlink_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    bio TEXT,
    profile_image TEXT,
    links JSONB DEFAULT '[]'::jsonb NOT NULL,
    customization JSONB DEFAULT '{"theme": "default"}'::jsonb NOT NULL,
    analytics JSONB DEFAULT '{"views": 0, "clicks": 0}'::jsonb NOT NULL,
    is_public BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Contacts Table
CREATE TABLE public.contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    source TEXT DEFAULT 'website' NOT NULL,
    source_details TEXT,
    read BOOLEAN DEFAULT false NOT NULL,
    replied BOOLEAN DEFAULT false NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Newsletter Table
CREATE TABLE public.newsletter (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    source TEXT
);

-- 7. Create Mini-App Sessions Table
CREATE TABLE public.mini_app_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    app_type TEXT NOT NULL CHECK (app_type IN ('kmtlink', 'seo-analyzer', 'roi-calculator', 'color-palette')),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    data JSONB DEFAULT '{}'::jsonb NOT NULL,
    results JSONB DEFAULT '{}'::jsonb NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kmtlink_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mini_app_sessions ENABLE ROW LEVEL SECURITY;

-- Helper Check Function for Admin Role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql;

-- 8. Profiles Table Policies
CREATE POLICY "Allow public read-access to profiles" ON public.profiles
    FOR SELECT USING (true);
CREATE POLICY "Users can manage their own profiles" ON public.profiles
    FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admins have full access to profiles" ON public.profiles
    FOR ALL USING (public.is_admin());

-- 9. Blog Table Policies
CREATE POLICY "Anyone can view published blogs" ON public.blogs
    FOR SELECT USING (published = true);
CREATE POLICY "Admins have full access to blogs" ON public.blogs
    FOR ALL USING (public.is_admin());

-- 10. KMT Link Profiles Table Policies
CREATE POLICY "Anyone can read public link profiles" ON public.kmtlink_profiles
    FOR SELECT USING (is_public = true);
CREATE POLICY "Users can manage their own link profiles" ON public.kmtlink_profiles
    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to link profiles" ON public.kmtlink_profiles
    FOR ALL USING (public.is_admin());

-- 11. Contact Table Policies
CREATE POLICY "Anyone can submit contact form" ON public.contacts
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can read/manage contact submissions" ON public.contacts
    FOR ALL USING (public.is_admin());

-- 12. Newsletter Table Policies
CREATE POLICY "Anyone can sign up for newsletter" ON public.newsletter
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view/manage newsletter registrations" ON public.newsletter
    FOR ALL USING (public.is_admin());

-- 13. Mini-App Sessions Table Policies
CREATE POLICY "Anyone can insert sessions" ON public.mini_app_sessions
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own sessions" ON public.mini_app_sessions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to sessions" ON public.mini_app_sessions
    FOR ALL USING (public.is_admin());

-- 14. Trigger Function: Automatically create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role, plan)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', 'User'),
    CASE WHEN new.email = 'info@webkmt.com' THEN 'admin'::user_role ELSE 'user'::user_role END,
    CASE WHEN new.email = 'info@webkmt.com' THEN 'premium'::user_plan ELSE 'free'::user_plan END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger Creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Analytics Events Table (replaces Firestore 'analytics' collection)
CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL,         -- 'pageview', 'event', 'performance'
    event_name TEXT,            -- custom event name
    page TEXT,                  -- page URL
    referrer TEXT,
    category TEXT,
    label TEXT,
    value NUMERIC,
    lcp NUMERIC,
    fid NUMERIC,
    cls NUMERIC,
    ttfb NUMERIC,
    fcp NUMERIC,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on analytics
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics Policies
CREATE POLICY "Anyone can insert analytics events" ON public.analytics_events
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all analytics events" ON public.analytics_events
    FOR SELECT USING (public.is_admin());
