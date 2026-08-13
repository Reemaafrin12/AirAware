/*
useState is best for one screen's short-lived UI state, like form text or a toast.
Context API is useful for app data several nearby screens need without prop drilling.
Redux Toolkit fits broader global state that benefits from predictable actions.
This lab keeps Context and Redux side by side so the patterns are easy to compare.
*/
import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { initialFavoriteLocations } from '../data/sampleAQIData';
import type { FavoriteLocation } from '../types/airQuality';

type UserState = {
  name: string;
  email: string;
  isLoggedIn: boolean;
};

type LocationState = {
  favoriteLocations: FavoriteLocation[];
};

const initialUserState: UserState = {
  name: 'Aarav Mehta',
  email: 'aarav.mehta@example.com',
  isLoggedIn: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    updateBasicUserInfo: (
      state,
      action: PayloadAction<Partial<Pick<UserState, 'name' | 'email'>>>,
    ) => {
      Object.assign(state, action.payload);
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    favoriteLocations: initialFavoriteLocations,
  } satisfies LocationState,
  reducers: {
    addFavoriteLocation: (state, action: PayloadAction<FavoriteLocation>) => {
      if (
        state.favoriteLocations.some(
          (location) => location.id === action.payload.id,
        )
      ) {
        return;
      }

      state.favoriteLocations.push(action.payload);
    },
    removeFavoriteLocation: (state, action: PayloadAction<string>) => {
      state.favoriteLocations = state.favoriteLocations.filter(
        (location) => location.id !== action.payload,
      );
    },
  },
});

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    location: locationSlice.reducer,
  },
});

export const { setLoggedIn, updateBasicUserInfo } = userSlice.actions;
export const { addFavoriteLocation, removeFavoriteLocation } =
  locationSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
