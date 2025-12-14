import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action) {
        const exists = state.items.some((n) => n.id === action.payload.id);
        if (!exists) {
          state.items.unshift(action.payload);
        }
      },
      prepare(notification) {
        return {
          payload: {
            id: notification.id || nanoid(),
            title: notification.title || 'New message',
            body: notification.body || '',
            link: notification.link || '/',
            createdAt: notification.createdAt || new Date().toISOString(),
            isRead: false,
            ...notification,
          },
        };
      },
    },
    markAsRead(state, action) {
      const id = action.payload;
      state.items = state.items.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      );
    },
    markAllAsRead(state) {
      state.items = state.items.map((n) => ({ ...n, isRead: true }));
    },
    clearNotifications(state) {
      state.items = [];
    },
    setNotifications(state, action) {
      state.items = action.payload || [];
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications, setNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
