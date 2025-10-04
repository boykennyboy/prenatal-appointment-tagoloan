import { create } from 'zustand';

const useErrorStore = create((set) => ({
  error: {},

  setError: (errors) => set({ error: errors }),
}));

export default useErrorStore;
