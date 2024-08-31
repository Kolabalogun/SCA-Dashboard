"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

// Create the auth slice using createSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer to set user credentials
    setCredentials: (state, action) => {
      state.user = action.payload;
    },

    // Reducer to set authentication status and update localStorage
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(state.isAuthenticated)
      );
    },

    // Reducer to log out user and update authentication status in localStorage
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.setItem(
        "isAuthenticated",
        JSON.stringify(state.isAuthenticated)
      );
    },
  },
});

// Export action creators for the setCredentials, setIsAuthenticated, and logout reducers
export const { setCredentials, setIsAuthenticated, logout } = authSlice.actions;

// Export the reducer for use in the Redux store
export default authSlice.reducer;
