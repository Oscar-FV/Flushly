import { create } from 'zustand';
import { SearchItem } from '../types/search-item';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchHistoryState {
  searchHistory: SearchItem[];
  error: string | null;
  hydrateSearchHistory: () => Promise<void>;
  recordSearch: (item: SearchItem) => Promise<void>;
  removeSearch: (id: string) => Promise<void>;
}

const SEARCH_HISTORY_STORAGE_KEY = 'search-history';

export const useSearchHistoryStore = create<SearchHistoryState>((set, get) => ({
  searchHistory: [],
  error: null,

  hydrateSearchHistory: async () => {
    try {
      const storedData = await AsyncStorage.getItem(SEARCH_HISTORY_STORAGE_KEY);
      if (storedData) {
        set({
          searchHistory: JSON.parse(storedData),
        });
      }
    } catch (e) {
      set({
        error: 'unable to load search history',
      });
    }
  },

  recordSearch: async (item) => {
    try {
      const updated = [item, ...get().searchHistory];
      set({ searchHistory: updated });
      await AsyncStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      set({ error: 'Unable to record search' });
    }
  },

  removeSearch: async (id) => {
    try {
      const filtered = get().searchHistory.filter((item) => item.id !== id);
      set({ searchHistory: filtered });
      await AsyncStorage.setItem(SEARCH_HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) {
        set({error: 'unable to remove search'});
    }
  },
}));
