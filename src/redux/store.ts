import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./authSlice";
import popupSlice from "./popupSlice";
import respondentSlice from "./respondentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    popup: popupSlice,
    respondent: respondentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
