import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import shoppingSlice from './slices/shoppingSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    shopping: shoppingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
