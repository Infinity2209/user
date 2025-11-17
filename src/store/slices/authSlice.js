/**
 * Authentication Slice
 *
 * This Redux slice manages the authentication state of the application.
 * It handles login/logout actions and persists auth data to localStorage.
 * The slice tracks user info, JWT token, and authentication status.
 */

import { createSlice } from '@reduxjs/toolkit';

// Helper function to load authentication state from localStorage
const loadAuthState = () => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      return {
        user: parsed.user,
        token: parsed.token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
    localStorage.removeItem('auth');
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

// Helper function to save authentication state to localStorage
const saveAuthState = (state) => {
  try {
    if (state.isAuthenticated) {
      localStorage.setItem('auth', JSON.stringify({
        user: state.user,
        token: state.token,
      }));
    } else {
      localStorage.removeItem('auth');
    }
  } catch (error) {
    console.error('Error saving auth state to localStorage:', error);
  }
};

// Initial state loaded from localStorage
const initialState = loadAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login action - sets user data and token
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      saveAuthState(state);
    },
    // Logout action - clears user data and token
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      saveAuthState(state);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
