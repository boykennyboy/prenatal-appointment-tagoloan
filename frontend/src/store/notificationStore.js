import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';
import { toast } from 'sonner';

const useNotificationStore = create(
  persist(
    (set) => ({
      unread_count: 0,
      read_count: 0,
      loading: false,

      // ✅ Fetch unread count from API
      fetchUnreadCount: async () => {
        try {
          set({ loading: true });
          const res = await api.get('/api/notifications/unread-count');
          const data = res.data;

          set({
            unread_count: data.unread_count,
            read_count: data.read_count || 0,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
          set({ loading: false });
        }
      },

      mark_as_read: async (id) => {
        try {
          set({ loading: true });
          const res = await api.put(`/api/notifications/${id}/mark-read`);
          const data = res.data;

          set({
            unread_count: data.unread_count,
            read_count: data.read_count || 0,
            loading: false,
          });
          toast.success(data.message);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
          set({ loading: false });
          toast.error('Falied to mark as read notification');
        }
      },

      mark_all_read: async () => {
        try {
          set({ loading: true });
          const res = await api.put(`/api/notifications/mark-all-read`);
          const data = res.data;

          set({
            unread_count: data.unread_count,
            read_count: data.read_count || 0,
            loading: false,
          });
          toast.success(data.message);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
          set({ loading: false });
          toast.error('Falied to mark as read all notifications');
        }
      },

      delete_notification: async (id) => {
        try {
          set({ loading: true });
          const res = await api.delete(`/api/notifications/delete/${id}`);
          const data = res.data;

          set({
            unread_count: data.unread_count,
            read_count: data.read_count || 0,
            loading: false,
          });
          toast.success(data.message);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
          set({ loading: false });
          toast.error('Falied delete notification');
        }
      },

      delete_all_read: async () => {
        try {
          set({ loading: true });
          const res = await api.delete(`/api/notifications/delete-all-read`);
          const data = res.data;

          set({
            unread_count: data.unread_count,
            read_count: data.read_count || 0,
            loading: false,
          });
          toast.success(data.message);
        } catch (error) {
          console.error('Failed to fetch unread count:', error);
          set({ loading: false });
          toast.error('Falied delete all read notifications');
        }
      },

      // ✅ Update count manually if needed

      reset: () => set({ unread_ount: 0, read_count: 0 }),
    }),
    {
      name: 'notification-store', // persists unreadCount only
      partialize: (state) => ({
        unread_count: state.unread_count,
        read_count: state.read_count,
      }),
    }
  )
);

export default useNotificationStore;
