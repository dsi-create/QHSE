-- Add a 'pin' column to the profiles table to store the doctor's PIN
ALTER TABLE public.profiles ADD COLUMN pin TEXT;

-- Drop the existing trigger and function to update them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Update the function to include the new PIN field during user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = 'public'
AS $$
DECLARE
  first_name_val TEXT;
  last_name_val TEXT;
BEGIN
  -- Split the full name into first and last names
  first_name_val := split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1);
  last_name_val := substring(new.raw_user_meta_data ->> 'full_name' from position(' ' in new.raw_user_meta_data ->> 'full_name') + 1);

  INSERT INTO public.profiles (id, first_name, last_name, role, service, username, pin)
  VALUES (
    new.id,
    first_name_val,
    last_name_val,
    (new.raw_user_meta_data ->> 'role')::user_role,
    new.raw_user_meta_data ->> 'service',
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'pin' -- Add the PIN from metadata
  );
  RETURN new;
END;
$$;

-- Recreate the trigger to call the updated function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();