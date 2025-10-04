import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import CryptoJS from 'crypto-js';
import { toast } from 'sonner';
import api from '../api/axios';
import useDashboardStore from './dashboardStore.js';
import useNotificationStore from './notificationStore.js';
// Optional: use env or hardcode for dev (not safe for production frontend)
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      fetchUser: async () => {
        const { user } = get();
        if (!user) {
          set({ isLoading: true, error: null });
        }
        try {
          const res = await api.get('/api/user');
          const data = res.data;
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (err) {
          if (err.response) {
            const { status } = err.response;

            if (status === 401) {
              set({ user: null, token: null, isLoading: false });
              localStorage.removeItem('auth-storage');
            }
          }

          set({
            user: null,
            token: null,
            isLoading: false,
            error:
              err.response?.data?.message || err.message || 'An error occurred',
          });
        }
      },

      login: async (formData, navigate, setError) => {
        try {
          const res = await api.post('/api/login', formData);
          const data = res.data;
          set({ user: data.user, token: data.token, isLoading: false });

          const { fetchDashboardData } = useDashboardStore.getState();
          const { fetchUnreadCount } = useNotificationStore.getState();

          fetchDashboardData();
          fetchUnreadCount();

          navigate('/admin/dashboard');
          toast.success(data.message || 'Login successfully');
        } catch (err) {
          if (err.response) {
            const { status, data } = err.response;

            if (status === 422 && data.errors) {
              setError(data.errors);
            }

            if (status === 401) {
              set({ user: null, token: null, isLoading: false });
              localStorage.removeItem('auth-storage');
              localStorage.removeItem('notification-store');
              localStorage.removeItem('dashboard');
            }
          }
        }
      },

      logout: async () => {
        try {
          await api.post('/api/logout');
        } catch (err) {
          console.error('Logout error:', err);
        }

        set({ user: null, token: null, isLoading: false });

        localStorage.removeItem('auth-storage');
        localStorage.removeItem('notification-store');
        localStorage.removeItem('dashboard');
        toast.success('You have been logged out!');
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const stored = localStorage.getItem(name);
          if (!stored) return null;
          try {
            return decrypt(stored);
          } catch (e) {
            console.error('Decryption failed:', e);
            return null;
          }
        },
        setItem: (name, value) => {
          const encrypted = encrypt(value);
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
