import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

// Basic user shape returned from server.
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>; // triggers OAuth start
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const TOKEN_KEY = "auth_token";

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const navigate = useNavigate();
  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const data = await api<AuthUser>("/auth/me");
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
    // refreshUser intentionally excluded from deps to avoid redef issues.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const signIn = async (email: string, password: string) => {
    // const data = await api<{ token: string; user: AuthUser }>(
    //   '/auth/login',
    //   { method: 'POST', body: JSON.stringify({ email, password }) }
    // );
    // localStorage.setItem(TOKEN_KEY, data.token);
    // setToken(data.token);
    // setUser(data.user);
    navigate("/dashboard");
  };

  const signUp = async (email: string, password: string) => {
    const data = await api<{ token: string; user: AuthUser }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const signInWithGoogle = async () => {
    // Redirect flow: server should start OAuth and redirect back with ?token=...
    const redirectUri = encodeURIComponent(
      window.location.origin + "/oauth-callback"
    );
    window.location.href = `${API_BASE}/auth/google/start?redirect_uri=${redirectUri}`;
  };

  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    refreshUser,
    token,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
