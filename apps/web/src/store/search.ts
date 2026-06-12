'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchState {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      recentSearches: [],

      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => ({
          recentSearches: [
            trimmed,
            ...state.recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase()),
          ].slice(0, 8),
        }));
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    { name: 'techymart-search' }
  )
);
