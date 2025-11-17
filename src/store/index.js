/**
 * Redux Store Configuration
 *
 * This file configures the Redux store with Redux Toolkit.
 * It combines the auth slice and RTK Query APIs for users and products.
 * The store is the central state management for the application.
 */

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import { usersApi } from './apis/usersApi';
import { productsApi } from './apis/productsApi';

// Configure the Redux store with reducers and middleware
export const store = configureStore({
  reducer: {
    // Authentication state slice
    auth: authSlice,
    // RTK Query API reducers
    [usersApi.reducerPath]: usersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  // Add RTK Query middleware for caching and invalidation
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware, productsApi.middleware),
});
