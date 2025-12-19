CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  first_name_val TEXT;
  last_name_val TEXT;
BEGIN
  -- Try to get first_name and last_name directly from metadata
  first_name_val := new.raw_user_meta_data ->> 'first_name';
  last_name_val := new.raw_user_meta_data ->> 'last_name';

  -- If not found, try to split from full_name
  IF first_name_val IS NULL OR last_name_val IS NULL THEN
    first_name_val := split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1);
    last_name_val := substring(new.raw_user_meta_data ->> 'full_name' from position(' ' in new.raw_user_meta_data ->> 'full_name') + 1);
  END IF;

  INSERT INTO public.profiles (id, first_name, last_name, role, service, username, pin, civility)
  VALUES (
    new.id,
    first_name_val,
    last_name_val,
    (new.raw_user_meta_data ->> 'role')::user_role,
    new.raw_user_meta_data ->> 'service',
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'pin',
    new.raw_user_meta_data ->> 'civility'
  );
  RETURN new;
END;
$$;