/**
 * Products API Slice
 *
 * This RTK Query API slice handles all product-related API operations.
 * It includes CRUD operations for products with authentication headers
 * and automatic cache invalidation.
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

export const productsApi = createApi({
  reducerPath: 'productsApi',
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
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    // Get all products
    getProducts: builder.query({
      query: () => (import.meta.env.PROD ? '/api/products' : '/products'),
      providesTags: ['Products'],
    }),
    // Get single product by ID
    getProduct: builder.query({
      query: (id) => (import.meta.env.PROD ? `/api/products/${id}` : `/products/${id}`),
      providesTags: (result, error, id) => [{ type: 'Products', id }],
    }),
    // Create new product
    createProduct: builder.mutation({
      query: (product) => ({
        url: import.meta.env.PROD ? '/api/products' : '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),
    // Update existing product
    updateProduct: builder.mutation({
      query: ({ id, ...product }) => ({
        url: import.meta.env.PROD ? `/api/products/${id}` : `/products/${id}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Products', id }, 'Products'],
    }),
    // Delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: import.meta.env.PROD ? `/api/products/${id}` : `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
