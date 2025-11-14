import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import servicesReducer from './slices/servicesSlice';
import { servicesApi } from './api/servicesApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    // Add the RTK Query API reducer
    [servicesApi.reducerPath]: servicesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(servicesApi.middleware), // Add RTK Query middleware
});