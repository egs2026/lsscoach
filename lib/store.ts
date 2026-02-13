import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  currentProject: string | null;
  setCurrentProject: (projectId: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  currentProject: null,
  setCurrentProject: (projectId) => set({ currentProject: projectId }),
}));
