// Generic server-side authentication API helpers.
// Adjust endpoint paths if your backend differs.

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

interface AuthResponse<T> { data: T; }

export interface MeUser { id: string; email: string; name?: string; avatarUrl?: string; }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const authApi = {
  signup: (email: string, password: string) =>
    request<{ token: string; user: MeUser }>("/auth/signup", {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  login: (email: string, password: string) =>
    request<{ token: string; user: MeUser }>("/auth/login", {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<MeUser>("/auth/me"),
  logout: () => request<void>("/auth/logout", { method: 'POST' }),
  googleStartUrl: () => {
    const redirectUri = encodeURIComponent(window.location.origin + '/oauth-callback');
    return `${API_BASE}/auth/google/start?redirect_uri=${redirectUri}`;
  }
};
