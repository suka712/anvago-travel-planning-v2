import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  isPremium: boolean;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
  isLoading: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  loadUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  upgradeToPremium: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isInitialized: false,
      isLoading: false,

      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },

      setUser: (user) => {
        set({ user });
      },

      loadUser: async () => {
        const { accessToken } = get();
        
        if (!accessToken) {
          set({ isInitialized: true });
          return;
        }

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const response = await api.get('/auth/me');
          set({ user: response.data.data, isInitialized: true });
        } catch {
          // Token invalid, clear auth state
          set({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isInitialized: true 
          });
          delete api.defaults.headers.common['Authorization'];
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, tokens } = response.data.data;
          
          set({ 
            user, 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isLoading: false,
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', { email, password, name });
          const { user, tokens } = response.data.data;
          
          set({ 
            user, 
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isLoading: false,
          });
          
          api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null 
        });
        delete api.defaults.headers.common['Authorization'];
      },

      upgradeToPremium: async () => {
        try {
          const response = await api.post('/users/me/upgrade');
          set({ user: { ...get().user!, isPremium: true, ...response.data.data } });
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'anvago-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

