import { createSlice } from "@reduxjs/toolkit";
import {
  getInitialDetails,
  getInitialDetailsWithToken,
  login,
  logout,
} from "src/calls/auth";

interface AuthState {
  token: string;
  isAuthenticated: boolean;
  initialDataLoading: boolean;
  authLoading: boolean;
  internalDataLoaded: boolean;
  user: User;
}

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  initialDataLoading: true,
  authLoading: false,
  internalDataLoaded: false,
  user: {},
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    performLogout(state) {
      localStorage.removeItem("token");
      state.token = "";
      state.initialDataLoading = false;
      state.isAuthenticated = false;
    },
  },
  extraReducers(builder) {
    /* ---------------------------login---------------------------------------- */
    builder.addCase(login.pending, (state) => {
      state.authLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.authLoading = false;
    });
    builder.addCase(login.rejected, (state) => {
      console.error("Could not login");
      state.authLoading = false;
    });
    /* ---------------------------getInitialDetails------------------------------- */
    builder.addCase(getInitialDetails.pending, (state) => {
      state.initialDataLoading = true;
    });
    builder.addCase(getInitialDetails.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.initialDataLoading = false;
    });
    builder.addCase(getInitialDetails.rejected, (state) => {
      console.error("Could not get initial data");
      state.user = {} as User;
      state.isAuthenticated = false;
      state.initialDataLoading = false;
    });
    /* ---------------------------getInitialDetailsWithToken---------------------- */
    builder.addCase(getInitialDetailsWithToken.pending, (state) => {
      state.isAuthenticated = false;
    });
    builder.addCase(getInitialDetailsWithToken.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.internalDataLoaded = true;
    });
    builder.addCase(getInitialDetailsWithToken.rejected, (state) => {
      console.error("Could not get initial data with token");
      state.user = {} as User;
      state.isAuthenticated = false;
      state.token = "";
    });
    /* ---------------------------logout----------------------------------------- */
    builder.addCase(logout.pending, (state) => {
      state.authLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      localStorage.removeItem("token");
      state.token = "";
      state.initialDataLoading = false;
      state.isAuthenticated = false;
      state.authLoading = false;
    });
    builder.addCase(logout.rejected, (state) => {
      localStorage.removeItem("token");
      state.token = "";
      state.initialDataLoading = false;
      state.isAuthenticated = false;
      state.authLoading = false;
    });
  },
});

export const { performLogout } = authSlice.actions;
export default authSlice.reducer;
