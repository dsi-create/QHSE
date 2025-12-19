CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  _first_name TEXT;
  _last_name TEXT;
  _role public.user_role;
  _service TEXT;
  _username TEXT;
  _civility public.civility;
  _pin TEXT;
BEGIN
  -- Extract data from raw_user_meta_data, providing defaults if not present
  _first_name := COALESCE(split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1), 'Unknown');
  _last_name := COALESCE(substring(new.raw_user_meta_data ->> 'full_name' from position(' ' in new.raw_user_meta_data ->> 'full_name') + 1), 'User');
  _role := COALESCE((new.raw_user_meta_data ->> 'role')::public.user_role, 'Infirmier'::public.user_role); -- Default role
  _service := COALESCE(new.raw_user_meta_data ->> 'service', 'N/A');
  _username := COALESCE(new.raw_user_meta_data ->> 'username', new.email); -- Fallback to email if username not provided
  _civility := COALESCE((new.raw_user_meta_data ->> 'civility')::public.civility, 'M.'::public.civility); -- Default civility
  _pin := new.raw_user_meta_data ->> 'pin'; -- PIN can be NULL

  INSERT INTO public.profiles (id, first_name, last_name, role, service, username, civility, pin)
  VALUES (
    new.id, 
    _first_name, 
    _last_name, 
    _role, 
    _service, 
    _username,
    _civility,
    _pin
  );
  RETURN new;
END;
$$;

-- Trigger the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();