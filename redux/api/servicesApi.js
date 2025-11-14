import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API URL
const BASE_URL = 'https://naibrly-backend.onrender.com/api';

// Create the API slice
export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ['Services', 'ServiceRequests'],
  endpoints: (builder) => ({
    // Get all services with categories
    getServices: builder.query({
      query: () => '/categories/services',
      providesTags: ['Services'],
      transformResponse: (response) => {
        // Transform the API response to organize services by hierarchy
        if (!response || !response.success || !response.data) {
          console.error('Invalid API response:', response);
          return { services: [], organized: {} };
        }

        // The API returns data.services, not just data
        const services = response.data.services || response.data;

        // Check if services is an array
        if (!Array.isArray(services)) {
          console.error('Services data is not an array:', typeof services, services);
          return { services: [], organized: {} };
        }

        // Organize services by main category -> category type -> services
        const organized = {};

        services.forEach((service) => {
          const mainCategory = service.categoryType?.category?.name || 'Other';
          const categoryType = service.categoryType?.name || 'Uncategorized';

          // Initialize main category if doesn't exist
          if (!organized[mainCategory]) {
            organized[mainCategory] = {
              name: mainCategory,
              description: service.categoryType?.category?.description || '',
              categoryTypes: {},
            };
          }

          // Initialize category type if doesn't exist
          if (!organized[mainCategory].categoryTypes[categoryType]) {
            organized[mainCategory].categoryTypes[categoryType] = {
              name: categoryType,
              description: service.categoryType?.description || '',
              services: [],
            };
          }

          // Add service to the category type
          organized[mainCategory].categoryTypes[categoryType].services.push({
            id: service._id,
            name: service.name,
            description: service.description,
            isActive: service.isActive,
            order: service.order,
          });
        });

        return { services, organized };
      },
    }),

    // Get services by category
    getServicesByCategory: builder.query({
      query: (categoryId) => `/categories/${categoryId}/services`,
      providesTags: ['Services'],
    }),

    // Get single service details (if needed in future)
    getServiceById: builder.query({
      query: (serviceId) => `/services/${serviceId}`,
      providesTags: ['Services'],
    }),

    // Get customer's service requests
    getMyServiceRequests: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        return `/service-requests/customer/my-requests${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.serviceRequests
          ? [
              ...result.serviceRequests.map(({ _id }) => ({ type: 'ServiceRequests', id: _id })),
              { type: 'ServiceRequests', id: 'LIST' },
            ]
          : [{ type: 'ServiceRequests', id: 'LIST' }],
      transformResponse: (response) => {
        if (!response || !response.success || !response.data) {
          console.error('Invalid service requests response:', response);
          return { serviceRequests: [], pagination: { current: 1, total: 0, pages: 1 } };
        }
        return response.data;
      },
    }),

    // Create a new service request
    createServiceRequest: builder.mutation({
      query: (body) => ({
        url: '/service-requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'ServiceRequests', id: 'LIST' }],
    }),

    // Update service request status (customer cancels, etc.)
    updateServiceRequestStatus: builder.mutation({
      query: ({ requestId, ...body }) => ({
        url: `/service-requests/${requestId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: 'ServiceRequests', id: requestId },
        { type: 'ServiceRequests', id: 'LIST' },
      ],
    }),

    // Cancel service request
    cancelServiceRequest: builder.mutation({
      query: ({ requestId, ...body }) => ({
        url: `/service-requests/${requestId}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (result, error, { requestId }) => [
        { type: 'ServiceRequests', id: requestId },
        { type: 'ServiceRequests', id: 'LIST' },
      ],
    }),

    // Create a new bundle
    createBundle: builder.mutation({
      query: (body) => ({
        url: '/bundles/create',
        method: 'POST',
        body,
      }),
      // You might want to invalidate a 'Bundles' tag here if you have one
      // invalidatesTags: [{ type: 'Bundles', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetServicesQuery,
  useGetServicesByCategoryQuery,
  useGetServiceByIdQuery,
  useGetMyServiceRequestsQuery,
  useCreateServiceRequestMutation,
  useUpdateServiceRequestStatusMutation,
  useCancelServiceRequestMutation,
  useCreateBundleMutation,
} = servicesApi;
