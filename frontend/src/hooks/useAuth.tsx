import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { streamifyClient } from "../api/streamify-client";
import type { Id, Profile } from "../model/streamify.model";

type User = Id<Omit<Profile, "password">>;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (profile: Profile) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error("AuthProvider not initialized");
  },
  register: async () => {
    throw new Error("AuthProvider not initialized");
  },
  logout: () => {
    throw new Error("AuthProvider not initialized");
  },
  checkAuth: async () => {
    throw new Error("AuthProvider not initialized");
  },
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      if (!streamifyClient.hasToken()) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const currentUser = await streamifyClient.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      streamifyClient.clearToken();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    await streamifyClient.authenticate({ email, password });
    const currentUser = await streamifyClient.getCurrentUser();
    setUser(currentUser);
  }, []);

  const register = useCallback(async (profile: Profile) => {
    await streamifyClient.register(profile);
  }, []);

  const logout = useCallback(() => {
    streamifyClient.clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      checkAuth,
    }),
    [user, isLoading, login, register, logout, checkAuth]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

