import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FavoriteItinerary {
  id: string;
  name: string;
  description: string;
  destination: string;
  duration: number;
  estimatedCost: number;
  image: string;
  highlights: string[];
  savedAt: string;
}

interface FavoritesState {
  favorites: FavoriteItinerary[];

  // Actions
  addFavorite: (itinerary: Omit<FavoriteItinerary, 'savedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (itinerary: Omit<FavoriteItinerary, 'savedAt'>) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (itinerary) => {
        const { favorites } = get();
        if (favorites.some(f => f.id === itinerary.id)) return;

        set({
          favorites: [
            ...favorites,
            { ...itinerary, savedAt: new Date().toISOString() },
          ],
        });
      },

      removeFavorite: (id) => {
        set({
          favorites: get().favorites.filter(f => f.id !== id),
        });
      },

      isFavorite: (id) => {
        return get().favorites.some(f => f.id === id);
      },

      toggleFavorite: (itinerary) => {
        const { favorites, addFavorite, removeFavorite } = get();
        const exists = favorites.some(f => f.id === itinerary.id);

        if (exists) {
          removeFavorite(itinerary.id);
          return false;
        } else {
          addFavorite(itinerary);
          return true;
        }
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'anvago-favorites',
    }
  )
);
