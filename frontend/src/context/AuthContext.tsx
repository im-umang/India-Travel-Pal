import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { config } from '@/config';

// ── API Configuration ──
const API_BASE = config.apiBase;
const ADMIN_EMAIL = config.adminEmail;

// Types for our auth context
interface AuthResponse {
  access_token: string;
  token_type: string;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  role?: string;
  is_active?: boolean;
  last_active?: string;
  stats?: {
    total_trips: number;
    total_searches: number;
    fav_dest: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Decode JWT payload without verifying signature (frontend-only use) */
function decodeJwtRole(token: string): string | null {
  try {
    if (!token || !token.includes('.')) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const payload = JSON.parse(jsonPayload);
    return payload.role || null;
  } catch (err) {
    console.error('[Auth] JWT decode error:', err);
    return null;
  }
}

/** Merge user data with admin override based on email */
function mergeUserWithRole(userData: User, jwtToken?: string): User {
  const email = (userData.email || '').toLowerCase();
  // Admin email always gets admin role
  if (email === ADMIN_EMAIL.toLowerCase()) {
    return { ...userData, role: 'admin' };
  }
  // Try to get role from JWT token
  if (jwtToken) {
    const tokenRole = decodeJwtRole(jwtToken);
    if (tokenRole) {
      return { ...userData, role: tokenRole };
    }
  }
  return userData;
}

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          // Validate token by fetching profile
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });

          if (res.ok) {
            const response = await res.json();
            const userData = response.user || response; // Handle both nested and flat responses
            const enriched = mergeUserWithRole(userData, storedToken);
            setUser(enriched);
            setToken(storedToken);
            localStorage.setItem('user', JSON.stringify(enriched));
          } else {
            throw new Error('Token invalid');
          }
        } catch (err) {
          console.warn('[Auth] Session expired or invalid token');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Form data for OAuth2
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        return { success: false, error: err.detail || 'Login failed' };
      }

      const data: AuthResponse = await response.json();

      // Store token
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);

      // Fetch user profile
      const userRes = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` }
      });

      if (userRes.ok) {
        const response = await userRes.json();
        const userData = response.user || response;
        const enriched = mergeUserWithRole(userData, data.access_token);
        setUser(enriched);
        localStorage.setItem('user', JSON.stringify(enriched));
        return { success: true };
      }

      return { success: false, error: 'Failed to fetch user profile' };
    } catch (err) {
      console.error('[Auth] Login network error:', err);
      return { success: false, error: 'Connection error' };
    }
  };

  // Register function with Auto-Login
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name, email, password }),
      });

      if (!response.ok) {
        const err = await response.json();
        return { success: false, error: err.detail || 'Registration failed' };
      }

      // Auto-login after successful registration
      return await login(email, password);

    } catch (err) {
      console.error('[Auth] Registration error:', err);
      return { success: false, error: 'Connection error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };
  
  // Update User Profile
  const updateUser = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!token) return { success: false, error: 'Not authenticated' };
    
    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        return { success: false, error: err.detail || 'Update failed' };
      }

      const updatedUser = await response.json();
      const enriched = mergeUserWithRole(updatedUser, token);
      setUser(enriched);
      localStorage.setItem('user', JSON.stringify(enriched));
      return { success: true };
    } catch (err) {
      console.error('[Auth] Update error:', err);
      return { success: false, error: 'Connection error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
