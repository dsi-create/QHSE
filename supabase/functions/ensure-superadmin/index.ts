// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Edge Function: ensure-superadmin started.");
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const superadminEmail = 'yohann.olympio@centre-diagnostic.com';
    const superadminPassword = '27111975Oy$';
    const superadminUsername = 'Yohann';
    const superadminFirstName = 'Yohann';
    const superadminLastName = 'Olympio';
    const superadminCivility = 'M.';
    const superadminPosition = 'Administrateur Système';
    const superadminRole = 'superadmin';

    console.log("Edge Function: Checking for existing Superadmin auth user with email:", superadminEmail);
    const { data: { users }, error: listUsersError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
      page: 1,
    });

    if (listUsersError) {
      console.error("Edge Function: Error listing auth users:", listUsersError.message);
      return new Response(JSON.stringify({ success: false, message: `Error listing auth users: ${listUsersError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const existingAuthUser = users.find((u: { email?: string }) => u.email === superadminEmail);
    let superadminAuthId: string | undefined;

    if (!existingAuthUser) {
      console.log("Edge Function: No Superadmin auth user found. Attempting to create one...");
      const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: superadminEmail,
        password: superadminPassword,
        email_confirm: true,
        user_metadata: {
          first_name: superadminFirstName,
          last_name: superadminLastName,
          role: superadminRole,
          service: superadminPosition,
          username: superadminUsername,
          civility: superadminCivility,
          pin: null, // Explicitly set pin to null in metadata for superadmin
          email: superadminEmail, // Add email to metadata for trigger
        }
      });

      if (createAuthError) {
        console.error("Edge Function: Error creating Superadmin auth user:", createAuthError.message);
        return new Response(JSON.stringify({ success: false, message: `Error creating Superadmin auth user: ${createAuthError.message}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      superadminAuthId = newAuthUser?.user?.id;
      console.log(`Edge Function: Superadmin auth user created with ID: ${superadminAuthId}. Profile creation expected via trigger.`);
    } else {
      console.log(`Edge Function: Superadmin auth user already exists with ID: ${existingAuthUser.id}. Ensuring password and profile are up-to-date.`);
      superadminAuthId = existingAuthUser.id;

      console.log("Edge Function: Attempting to update Superadmin auth user password...");
      const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
        superadminAuthId,
        { password: superadminPassword }
      );
      if (updateAuthError) {
        console.error("Edge Function: Error updating Superadmin auth user password:", updateAuthError.message);
        // Don't fail the whole process for password update, just log
      } else {
        console.log("Edge Function: Superadmin auth user password ensured.");
      }

      console.log("Edge Function: Attempting to update Superadmin profile in public.profiles...");
      const { error: updateProfileError } = await supabaseAdmin
        .from('profiles')
        .update({
          first_name: superadminFirstName,
          last_name: superadminLastName,
          username: superadminUsername,
          civility: superadminCivility,
          service: superadminPosition,
          role: superadminRole,
          pin: null, // Explicitly set pin to null for superadmin
        })
        .eq('id', superadminAuthId);

      if (updateProfileError) {
        console.error("Edge Function: Error updating Superadmin profile:", updateProfileError.message);
        return new Response(JSON.stringify({ success: false, message: `Error updating Superadmin profile: ${updateProfileError.message}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        });
      }
      console.log("Edge Function: Superadmin profile updated successfully.");
    }

    console.log("Edge Function: ensure-superadmin completed successfully.");
    return new Response(JSON.stringify({ success: true, message: 'Superadmin user and profile ensured.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Edge Function: Unexpected error caught in try-catch block:', error.message);
    return new Response(JSON.stringify({ success: false, message: `Unexpected error: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});