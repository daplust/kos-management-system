import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    supabase.auth.signInWithPassword({ email, password }).then(({ data, error }: { data: any; error: any }) => {
      if (error) {
        console.error("Error signing in:", error);
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  };

  const signOut = async () => {
    setLoading(true);
    supabase.auth.signOut().then(({ error }: { error: any }) => {
      if (error) {
        console.error("Error signing out:", error);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
  };

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}; 