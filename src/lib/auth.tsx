import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { User } from "@supabase/supabase-js";

interface AuthUser extends User {
  role?: "admin" | "farmer" | "customer";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // First check if the user exists in the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Profile fetch result:', { profile, profileError });

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        
        // If profile doesn't exist, create one with default role
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, creating new profile...');
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userId,
                role: 'customer',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();
          
          console.log('Profile creation result:', { newProfile, insertError });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
            return 'customer';
          }
          
          return newProfile?.role || 'customer';
        }
        
        return 'customer';
      }

      console.log('User role fetched:', profile?.role);
      return profile?.role || 'customer';
    } catch (error) {
      console.error('Error in getUserRole:', error);
      return 'customer';
    }
  };

  const updateUserWithRole = async (user: User) => {
    try {
      const role = await getUserRole(user.id);
      console.log('Updating user with role:', role);
      setUser({
        ...user,
        role
      });
      setLoading(false);
    } catch (error) {
      console.error('Error updating user with role:', error);
      setUser({
        ...user,
        role: 'customer'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log('Session found, fetching role...');
          await updateUserWithRole(session.user);
        } else {
          console.log('No session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in, updating with role...');
        await updateUserWithRole(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting sign in...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data received after sign in');
      }

      console.log('Sign in successful, updating with role...');
      await updateUserWithRole(data.user);
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 