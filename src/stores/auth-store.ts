import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProfileRow as User } from '@/types/database';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      clearUser: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'vinyl-crate-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
