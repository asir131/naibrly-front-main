import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const normalizeNotificationBody = (body) => {
  if (!body) return body;
  const text = String(body);
  if (text.includes('__TASK_COMPLETED__SERVICE') || text.includes('__TASK_COMPLETED__')) {
    return 'Service task completed';
  }
  if (text.includes('__TASK_COMPLETED__BUNDLE')) {
    return 'Bundle task completed';
  }
  return text;
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
            link: notification.link || '/',
            createdAt: notification.createdAt || new Date().toISOString(),
            isRead: false,
            ...notification,
            body: normalizeNotificationBody(notification.body || ''),
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
      state.items = (action.payload || []).map((notification) => ({
        ...notification,
        body: normalizeNotificationBody(notification.body || ''),
      }));
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearNotifications, setNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
