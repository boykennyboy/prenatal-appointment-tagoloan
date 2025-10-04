import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';
import { toast } from 'sonner';

const useDashboardStore = create(
  persist(
    (set) => ({
      data: [],
      pregnancy_data: [],
      appointment_data: [],

      loading: false,

      // ✅ Fetch unread count from API
      fetchDashboardData: async () => {
        try {
          set({ loading: true });
          const res = await api.get('/api/dashboard');
          const data = res.data;

          set({
            data: data.data,
            pregnancy_data: data.pregnancy_data,
            appointment_data: data.appointment_data,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
          set({ loading: false });
        }
      },

      // ✅ Update count manually if needed

      reset: () =>
        set({
          data: [],
          pregnancy_data: [],
          appointment_data: [],
        }),
    }),
    {
      name: 'dashboard', // persists unreadCount only
      partialize: (state) => ({
        data: state.data,
        pregnancy_data: state.pregnancy_data,
        appointment_data: state.appointment_data,
      }),
    }
  )
);

export default useDashboardStore;
