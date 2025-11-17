/**
 * Users API Slice
 *
 * This RTK Query API slice handles all user-related API operations.
 * It includes CRUD operations for users with authentication headers
 * and optimistic updates for better UX.
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';

// Get base URL from environment or use fallback
const getBaseUrl = () => {
  // For production (Netlify), use Netlify Functions
  if (import.meta.env.PROD) {
    return '';
  }
  // For development, use localhost
  return 'http://localhost:3001';
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
  // Base query with authentication header preparation
  baseQuery: async (args, api, extraOptions) => {
    const baseUrl = getBaseUrl();
    const token = api.getState().auth.token;

    try {
      const response = await axios({
        method: args.method || 'GET',
        url: `${baseUrl}${args}`,
        data: args.body,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { authorization: `Bearer ${token}` }),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      return { data: response.data };
    } catch (error) {
      return {
        error: {
          status: error.response?.status || 500,
          data: error.response?.data || error.message,
        },
      };
    }
  },
  // Tag types for cache invalidation
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['Users'],
    }),
    // Get single user by ID
    getUser: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),
    // Create new user
    createUser: builder.mutation({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user,
      }),
      // Note: invalidatesTags removed to prevent refetch that removes optimistically added items
      transformResponse: (response, meta, arg) => ({
        ...response,
        role: arg.role || 'user', // Preserve the role from the form
        phone: arg.phone, // Preserve the phone from the form
      }),
      // Optimistic update for better UX
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          // Optimistically update the cache for the default query (page 1, limit 10, no search)
          dispatch(
            usersApi.util.updateQueryData('getUsers', { page: 1, limit: 10, search: '' }, (draft) => {
              draft.unshift(data);
            })
          );
        } catch {}
      },
    }),
    // Update existing user
    updateUser: builder.mutation({
      query: ({ id, ...user }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: user,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }, 'Users'],
    }),
    // Delete user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
