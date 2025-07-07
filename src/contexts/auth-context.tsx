"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Session = {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
} | null;

const AuthContext = createContext<{ 
  session: Session; 
  loading: boolean; 
  setSession: React.Dispatch<React.SetStateAction<Session>>; 
}>({
  session: null,
  loading: true,
  setSession: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(async (res) => {
        if (!res.ok) return setSession(null);
        const data = await res.json();
        setSession(data.session);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
