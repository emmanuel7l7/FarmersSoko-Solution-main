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
        console.log('Auth state changed - new user:', userWithRole);
        setUser(userWithRole);
      } else {
        console.log('Auth state changed - no user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in with email:', email);
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
    const { data: farmerData, error: farmerError } = await supabase
      .from('farmers')
      .select('*')
      .eq('email', email)
      .single();

    console.log('Farmer data after sign in:', farmerData);
    console.log('Farmer error after sign in:', farmerError);

    if (data.user) {
      const userWithRole: AuthUser = {
        ...data.user,
        role: email === import.meta.env.VITE_ADMIN_EMAIL 
          ? "admin" 
          : farmerData?.role || "customer"
      };
      console.log('Setting user with role:', userWithRole);
      setUser(userWithRole);
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