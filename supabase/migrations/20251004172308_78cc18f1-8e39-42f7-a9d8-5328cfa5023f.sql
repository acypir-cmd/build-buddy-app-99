-- Make school_id nullable in profiles table
ALTER TABLE public.profiles ALTER COLUMN school_id DROP NOT NULL;