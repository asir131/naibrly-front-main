import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ungustatory-erringly-ralph.ngrok-free.dev/api';

const customFetchBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: 15000,
  prepareHeaders: (headers) => {
    headers.set('ngrok-skip-browser-warning', 'true');

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const quickChatApi = createApi({
  reducerPath: 'quickChatApi',
  baseQuery: customFetchBaseQuery,
  tagTypes: ['QuickChats'],
  endpoints: (builder) => ({
    // Get all quick chats for current user (includes user's own + admin-created)
    getQuickChats: builder.query({
      query: () => '/quick-chats',
      providesTags: ['QuickChats'],
    }),

    // Create new quick chat
    createQuickChat: builder.mutation({
      query: (content) => ({
        url: '/quick-chats',
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['QuickChats'],
    }),

    // Update quick chat
    updateQuickChat: builder.mutation({
      query: ({ quickChatId, content }) => ({
        url: `/quick-chats/${quickChatId}`,
        method: 'PUT',
        body: { content },
      }),
      invalidatesTags: ['QuickChats'],
    }),

    // Delete quick chat
    deleteQuickChat: builder.mutation({
      query: (quickChatId) => ({
        url: `/quick-chats/${quickChatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['QuickChats'],
    }),

    // Admin endpoints (if needed in future)
    getAdminQuickChats: builder.query({
      query: () => '/quick-chats/admin/all',
      providesTags: ['QuickChats'],
    }),

    createAdminQuickChat: builder.mutation({
      query: (content) => ({
        url: '/quick-chats/admin/create',
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['QuickChats'],
    }),
  }),
});

export const {
  useGetQuickChatsQuery,
  useLazyGetQuickChatsQuery,
  useCreateQuickChatMutation,
  useUpdateQuickChatMutation,
  useDeleteQuickChatMutation,
  useGetAdminQuickChatsQuery,
  useCreateAdminQuickChatMutation,
} = quickChatApi;
