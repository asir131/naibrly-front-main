import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import servicesReducer from './slices/servicesSlice';
import notificationsReducer from './slices/notificationsSlice';
import { servicesApi } from './api/servicesApi';
import { quickChatApi } from './api/quickChatApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    services: servicesReducer,
    notifications: notificationsReducer,
    // Add the RTK Query API reducer
    [servicesApi.reducerPath]: servicesApi.reducer,
    [quickChatApi.reducerPath]: quickChatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(servicesApi.middleware, quickChatApi.middleware), // Add RTK Query middleware
});
