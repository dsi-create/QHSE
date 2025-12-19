import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { showError, showSuccess } from '@/utils/toast';
import { User, Users } from '@/types';

interface UseAuthProps {
  initialUsers: Users; // Still needed for initial setup, but will be replaced by DB fetch
}

export const useAuth = ({ initialUsers }: UseAuthProps) => {
  const [currentUser, setCurrentUser] = useState<{ username: string; details: User } | null>(null);
  const [users, setUsers] = useState<Users>(initialUsers); // Will be populated from DB

  // Function to fetch all profiles from Supabase
  const fetchAllProfiles = async () => {
    try {
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      const fetchedUsers: Users = {};
      profilesData?.forEach((profile: any) => {
        fetchedUsers[profile.username] = {
          id: profile.id,
          username: profile.username,
          first_name: profile.first_name,
          last_name: profile.last_name,
          name: `${profile.civility || ''} ${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
          civility: profile.civility,
          email: profile.email,
          position: profile.service,
          role: profile.role,
          pin: profile.pin,
          added_permissions: Array.isArray(profile.added_permissions) ? profile.added_permissions : (profile.added_permissions ? JSON.parse(profile.added_permissions) : []),
          removed_permissions: Array.isArray(profile.removed_permissions) ? profile.removed_permissions : (profile.removed_permissions ? JSON.parse(profile.removed_permissions) : []),
        };
      });
      setUsers(fetchedUsers);
      return fetchedUsers;
    } catch (error: any) {
      console.error("Error fetching all profiles:", error.message);
      return {};
    }
  };

  // Effect to handle initial load and auth state changes
  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          const fullUser: User = {
            id: profile.id,
            username: profile.username,
            first_name: profile.first_name,
            last_name: profile.last_name,
            name: `${profile.civility || ''} ${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
            civility: profile.civility,
            email: profile.email,
            position: profile.service,
            role: profile.role,
            pin: profile.pin,
            added_permissions: Array.isArray(profile.added_permissions) ? profile.added_permissions : (profile.added_permissions ? JSON.parse(profile.added_permissions) : []),
            removed_permissions: Array.isArray(profile.removed_permissions) ? profile.removed_permissions : (profile.removed_permissions ? JSON.parse(profile.removed_permissions) : []),
          };
          setCurrentUser({ username: profile.username, details: fullUser });
          await fetchAllProfiles();
        } catch (error) {
          console.error("Error fetching profile on init:", error);
          setCurrentUser(null);
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) throw error;

          const fullUser: User = {
            id: profile.id,
            username: profile.username,
            first_name: profile.first_name,
            last_name: profile.last_name,
            name: `${profile.civility || ''} ${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
            civility: profile.civility,
            email: profile.email,
            position: profile.service,
            role: profile.role,
            pin: profile.pin,
            added_permissions: Array.isArray(profile.added_permissions) ? profile.added_permissions : (profile.added_permissions ? JSON.parse(profile.added_permissions) : []),
            removed_permissions: Array.isArray(profile.removed_permissions) ? profile.removed_permissions : (profile.removed_permissions ? JSON.parse(profile.removed_permissions) : []),
          };
          setCurrentUser({ username: profile.username, details: fullUser });
          await fetchAllProfiles();
        } catch (error) {
          console.error("Error fetching profile on auth change:", error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Aucun utilisateur retourné");

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      const fullUser: User = {
        id: profile.id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        name: `${profile.civility || ''} ${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        civility: profile.civility,
        email: profile.email,
        position: profile.service,
        role: profile.role,
        pin: profile.pin,
        added_permissions: Array.isArray(profile.added_permissions) ? profile.added_permissions : (profile.added_permissions ? JSON.parse(profile.added_permissions) : []),
        removed_permissions: Array.isArray(profile.removed_permissions) ? profile.removed_permissions : (profile.removed_permissions ? JSON.parse(profile.removed_permissions) : []),
      };
      setCurrentUser({ username: profile.username, details: fullUser });
      setUsers(prev => ({ ...prev, [profile.username]: fullUser }));
      showSuccess("Connexion réussie !");
      await fetchAllProfiles();
      return true;
    } catch (error: any) {
      showError(error.message || "Erreur lors de la connexion.");
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCurrentUser(null);
      showSuccess("Déconnexion réussie.");
    } catch (error: any) {
      showError(error.message || "Erreur lors de la déconnexion.");
      // Déconnexion locale même en cas d'erreur
      setCurrentUser(null);
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      showSuccess("Mot de passe mis à jour avec succès.");
      return true;
    } catch (error: any) {
      showError(error.message || "Erreur lors de la mise à jour du mot de passe.");
      return false;
    }
  };

  return {
    currentUser,
    users,
    setUsers,
    handleLogin,
    handleLogout,
    setCurrentUser,
    updatePassword,
    fetchAllProfiles, // Expose fetchAllProfiles for other components if needed
  };
};