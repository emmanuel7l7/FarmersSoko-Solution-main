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

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Check if user is a farmer
        const { data: farmerData } = await supabase
          .from('farmers')
          .select('role')
          .eq('email', session.user.email)
          .single();

        const userWithRole: AuthUser = {
          ...session.user,
          role: session.user.email === import.meta.env.VITE_ADMIN_EMAIL 
            ? "admin" 
            : farmerData?.role || "customer"
        };
        console.log('Initial session user:', userWithRole);
        setUser(userWithRole);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          // Check if user is a farmer
          const { data: farmerData, error: farmerError } = await supabase
            .from('farmers')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          console.log('Auth state change - Farmer data:', farmerData);
          console.log('Auth state change - Farmer error:', farmerError);

          const userWithRole: AuthUser = {
            ...session.user,
            role: session.user.email === import.meta.env.VITE_ADMIN_EMAIL 
              ? "admin" 
              : (farmerData && farmerData.role === 'farmer') ? "farmer" : "customer"
          };
          console.log('Auth state changed - new user with role:', userWithRole);
          setUser(userWithRole);
        } catch (error) {
          console.error('Error in auth state change:', error);
          // If there's an error, set as customer
          setUser({ ...session.user, role: "customer" } as AuthUser);
        }
      } else {
        console.log('Auth state changed - no user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Starting sign in process...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful, user data:', data);
      
      // Check if user is a farmer
      console.log('Checking farmer status...');
      console.log('Querying farmers table for email:', email);
      
      // First, let's check if the farmers table exists and has data
      const { data: allFarmers, error: tableError } = await supabase
        .from('farmers')
        .select('*')
        .limit(5);
      
      console.log('Sample of farmers table data:', allFarmers);
      console.log('Farmers table error:', tableError);

      // Now check for specific farmer
      const { data: farmerData, error: farmerError } = await supabase
        .from('farmers')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log('Raw farmer data:', farmerData);
      console.log('Farmer error:', farmerError);

      if (data.user) {
        const userWithRole: AuthUser = {
          ...data.user,
          role: email === import.meta.env.VITE_ADMIN_EMAIL 
            ? "admin" 
            : (farmerData && farmerData.role === 'farmer') ? "farmer" : "customer"
        };
        console.log('Setting user with role:', userWithRole);
        setUser(userWithRole);
        console.log('User state updated successfully');
      } else {
        console.error('No user data after successful sign in');
        throw new Error('No user data received after sign in');
      }
    } catch (error) {
      console.error('Error in signIn function:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
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