-- Fix search_path security issue in handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, full_name, school_id)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NULL);
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, (NEW.raw_user_meta_data->>'role')::public.app_role);
  
  RETURN NEW;
END;
$$;