import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base API URL
const BASE_URL = 'https://naibrly-backend.onrender.com/api';

// Custom fetchBaseQuery with timeout
const customFetchBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  timeout: 15000, // 15 second timeout
  prepareHeaders: (headers, { endpoint }) => {
    // Get token from localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // Only set Content-Type for non-FormData requests
    // FormData requests should not have Content-Type set manually
    if (!headers.has('Content-Type')) {
      headers.set('Accept', 'application/json');
      // Only set Content-Type if not already set (FormData will set it)
      if (endpoint && !endpoint.includes('register') && !endpoint.includes('verify')) {
        headers.set('Content-Type', 'application/json');
      }
    }
    return headers;
  },
});

// Create the API slice
export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: customFetchBaseQuery,
  // Enable aggressive caching
  keepUnusedDataFor: 300, // Keep cached data for 5 minutes
  refetchOnMountOrArgChange: 60, // Only refetch if data is older than 60 seconds
  refetchOnFocus: false, // Disable refetch on window focus
  refetchOnReconnect: true, // Refetch on network reconnect
  tagTypes: ['Services', 'ServiceRequests', 'Bundles', 'Provider'],
  endpoints: (builder) => ({
    // Provider Registration Endpoints
    registerProvider: builder.mutation({
      query: (data) => {
        const isFormData = data instanceof FormData;

        if (isFormData) {
          console.log('Sending FormData to API:');
          for (let pair of data.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }
        } else {
          console.log('Sending JSON to API:', data);
        }

        return {
          url: '/auth/register/provider',
          method: 'POST',
          body: data,
          // Let RTK Query handle Content-Type automatically
          // FormData will get multipart/form-data
          // JSON object will get application/json
        };
      },
      invalidatesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Register provider API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to register provider');
        }
        return response.data;
      },
      transformErrorResponse: (response) => {
        console.error('Register provider error response:', response);
        return response;
      },
    }),

    submitVerifyInformation: builder.mutation({
      query: (formData) => {
        console.log('Sending verify info FormData to API:');
        for (let pair of formData.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        return {
          url: '/verify-information/submit',
          method: 'POST',
          body: formData,
          // Let browser set Content-Type with boundary for multipart/form-data
        };
      },
      invalidatesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Submit verify information API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to submit verification information');
        }
        return response.data;
      },
      transformErrorResponse: (response) => {
        console.error('Submit verify information error response:', response);
        return response;
      },
    }),

    updateProviderZipCode: builder.mutation({
      query: (zipCodeData) => ({
        url: '/zip/provider/service-areas/add',
        method: 'POST',
        body: zipCodeData,
      }),
      invalidatesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Update provider zip code API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to update zip code');
        }
        return response.data;
      },
    }),

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
      invalidatesTags: [{ type: 'Bundles', id: 'LIST' }],
    }),

    // Get customer's bundles
    getMyBundles: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        return `/bundles/customer/my-bundles${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.bundles
          ? [
              ...result.bundles.map(({ _id }) => ({ type: 'Bundles', id: _id })),
              { type: 'Bundles', id: 'LIST' },
            ]
          : [{ type: 'Bundles', id: 'LIST' }],
      transformResponse: (response) => {
        console.log('Raw API response:', response);

        if (!response) {
          console.error('No response received');
          return { bundles: [], pagination: { current: 1, total: 0, pages: 1 } };
        }

        // Handle both success and non-success responses
        // The API returns data even when success is false
        if (response.data) {
          return response.data;
        }

        console.error('Invalid bundles response structure:', response);
        return { bundles: [], pagination: { current: 1, total: 0, pages: 1 } };
      },
    }),

    // Get all available bundles (for browsing)
    getAllBundles: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.category) queryParams.append('category', params.category);
        if (params?.zipCode) queryParams.append('zipCode', params.zipCode);

        const queryString = queryParams.toString();
        return `/bundles${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.bundles
          ? [
              ...result.bundles.map(({ _id }) => ({ type: 'Bundles', id: _id })),
              { type: 'Bundles', id: 'LIST' },
            ]
          : [{ type: 'Bundles', id: 'LIST' }],
      transformResponse: (response) => {
        if (!response || !response.data) {
          console.error('Invalid bundles response:', response);
          return { bundles: [], pagination: { current: 1, total: 0, pages: 1 } };
        }
        return response.data;
      },
    }),

    // Get nearby bundles based on customer's location
    getNearbyBundles: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);

        const queryString = queryParams.toString();
        return `/bundles/customer/nearby${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.bundles
          ? [
              ...result.bundles.map(({ _id }) => ({ type: 'Bundles', id: _id })),
              { type: 'Bundles', id: 'NEARBY' },
            ]
          : [{ type: 'Bundles', id: 'NEARBY' }],
      transformResponse: (response) => {
        console.log('Nearby bundles API response:', response);

        if (!response || !response.success || !response.data) {
          console.error('Invalid nearby bundles response:', response);
          return {
            bundles: [],
            zipCode: null,
            pagination: { current: 1, total: 0, pages: 1 }
          };
        }
        return response.data;
      },
    }),

    // Join a bundle
    joinBundle: builder.mutation({
      query: (bundleId) => ({
        url: `/bundles/${bundleId}/join`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, bundleId) => [
        { type: 'Bundles', id: bundleId },
        { type: 'Bundles', id: 'LIST' },
        { type: 'Bundles', id: 'NEARBY' },
      ],
      transformResponse: (response) => {
        console.log('Join bundle API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to join bundle');
        }
        return response.data;
      },
    }),

    // Get nearby services based on customer's location
    getNearbyServices: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);

        const queryString = queryParams.toString();
        return `/service-requests/customer/nearby-services${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Services'],
      transformResponse: (response) => {
        console.log('Nearby services API response:', response);

        if (!response || !response.success || !response.data) {
          console.error('Invalid nearby services response:', response);
          return {
            services: [],
            zipCode: null,
            pagination: { current: 1, total: 0, pages: 1 }
          };
        }
        return response.data;
      },
    }),

    // Password Reset Endpoints
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/password-reset/forgot-password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
        console.log('Forgot password API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to send reset code');
        }
        return response.data;
      },
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/password-reset/verify-otp',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
        console.log('Verify OTP API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Invalid OTP');
        }
        return response.data;
      },
    }),

    resendOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/password-reset/resend-otp',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
        console.log('Resend OTP API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to resend OTP');
        }
        return response.data;
      },
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/password-reset/reset-password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
        console.log('Reset password API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to reset password');
        }
        return response.data;
      },
    }),

    // Search Providers by service and zip code (POST)
    searchProviders: builder.mutation({
      query: (data) => ({
        url: '/search/providers',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response) => {
        console.log('Search providers API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to search providers');
        }
        return response.data;
      },
    }),

    // Get Provider Services by provider ID and service name
    getProviderServices: builder.query({
      query: ({ providerId, serviceName }) => {
        return `/providers/${providerId}/services/${encodeURIComponent(serviceName)}`;
      },
      providesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Get provider services API response:', response);
        if (!response || !response.success) {
          return {
            provider: null,
            selectedService: null,
            otherServices: [],
            feedback: { list: [], pagination: {}, aggregates: {} }
          };
        }
        return response.data;
      },
    }),

    // Search Providers by service type and zip code (GET)
    searchProvidersByService: builder.query({
      query: ({ serviceType, zipCode, minRating, maxHourlyRate, sortBy, page, limit }) => {
        const queryParams = new URLSearchParams();
        if (serviceType) queryParams.append('serviceType', serviceType);
        if (zipCode) queryParams.append('zipCode', zipCode);
        if (minRating) queryParams.append('minRating', minRating);
        if (maxHourlyRate) queryParams.append('maxHourlyRate', maxHourlyRate);
        if (sortBy) queryParams.append('sortBy', sortBy);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);

        const queryString = queryParams.toString();
        return `/service-requests/search-providers${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Services'],
      transformResponse: (response) => {
        console.log('Search providers by service API response:', response);
        if (!response || !response.success) {
          return {
            providers: [],
            searchCriteria: {},
            pagination: { current: 1, total: 0, pages: 1 },
            summary: {}
          };
        }
        return response.data;
      },
    }),

    // Search Bundles by query and zip code (GET)
    searchBundles: builder.query({
      query: ({ searchQuery, zipCode, category, page, limit }) => {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('searchQuery', searchQuery);
        if (zipCode) queryParams.append('zipCode', zipCode);
        if (category) queryParams.append('category', category);
        if (page) queryParams.append('page', page);
        if (limit) queryParams.append('limit', limit);

        const queryString = queryParams.toString();
        return `/bundles/search${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Bundles'],
      transformResponse: (response) => {
        console.log('Search bundles API response:', response);
        if (!response || !response.success) {
          return {
            bundles: [],
            searchSummary: {},
            customerLocation: {},
            pagination: { current: 1, total: 0, pages: 1 }
          };
        }
        return response.data;
      },
    }),

    // Get user profile
    getUserProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Get user profile API response:', response);
        if (!response || !response.success) {
          return { user: null };
        }
        return response.data;
      },
    }),

    // Get verification information status
    getVerifyInfoStatus: builder.query({
      query: () => '/verify-information/status',
      providesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Get verify info status API response:', response);
        if (!response || !response.success) {
          return { status: null, verificationInfo: null };
        }
        return response.data;
      },
    }),

    // Get provider zip/service areas
    getProviderZip: builder.query({
      query: () => '/zip/provider/zip',
      providesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Get provider zip API response:', response);
        if (!response || !response.success) {
          return { provider: null };
        }
        return response.data;
      },
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Provider registration hooks
  useRegisterProviderMutation,
  useSubmitVerifyInformationMutation,
  useUpdateProviderZipCodeMutation,
  // Service hooks
  useGetServicesQuery,
  useGetServicesByCategoryQuery,
  useGetServiceByIdQuery,
  useGetMyServiceRequestsQuery,
  useCreateServiceRequestMutation,
  useUpdateServiceRequestStatusMutation,
  useCancelServiceRequestMutation,
  useCreateBundleMutation,
  useGetMyBundlesQuery,
  useGetAllBundlesQuery,
  useGetNearbyBundlesQuery,
  useJoinBundleMutation,
  useGetNearbyServicesQuery,
  // Password reset hooks
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  // Search hooks
  useSearchProvidersMutation,
  useSearchProvidersByServiceQuery,
  useSearchBundlesQuery,
  useLazySearchBundlesQuery,
  // Provider hooks
  useGetProviderServicesQuery,
  useGetUserProfileQuery,
  useGetVerifyInfoStatusQuery,
  useGetProviderZipQuery,
} = servicesApi;
