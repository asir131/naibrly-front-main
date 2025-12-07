import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '@/redux/slices/authSlice';

// Define the base API URL - use environment variable or fallback to production
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://naibrly-backend.onrender.com/api';

// Custom fetchBaseQuery with timeout and automatic logout on 401
const customFetchBaseQuery = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    timeout: 15000, // 15 second timeout
    prepareHeaders: (headers, { endpoint }) => {
      // Get token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        const userType = localStorage.getItem('userType');
        console.log('[RTK Query] Auth Debug:', {
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
          userType,
          endpoint
        });
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

  const result = await baseQuery(args, api, extraOptions);

  // Auto-logout on 401 Unauthorized
  if (result.error && result.error.status === 401) {
    console.warn('[RTK Query] 401 Unauthorized - Token expired or invalid. Logging out...');
    api.dispatch(logout());
  }

  return result;
};

// Create the API slice
export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: customFetchBaseQuery,
  // Enable aggressive caching
  keepUnusedDataFor: 300, // Keep cached data for 5 minutes
  refetchOnMountOrArgChange: 60, // Only refetch if data is older than 60 seconds
  refetchOnFocus: false, // Disable refetch on window focus
  refetchOnReconnect: true, // Refetch on network reconnect
  tagTypes: ['Services', 'ServiceRequests', 'Bundles', 'Provider', 'MoneyRequests'],
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
      transformErrorResponse: (response, meta) => {
        console.error('Submit verify information error response:', {
          status: meta?.response?.status,
          statusText: meta?.response?.statusText,
          data: response?.data || response,
          headers: meta?.response?.headers,
        });

        // Handle different error types
        if (!response || Object.keys(response).length === 0) {
          return {
            status: meta?.response?.status || 'UNKNOWN_ERROR',
            data: {
              message: 'Network error or server did not respond. Please check your connection and try again.',
              errors: []
            }
          };
        }

        // Return structured error
        return {
          status: response.status || meta?.response?.status,
          data: response.data || response
        };
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
        return `/service-requests/customer/my-all-requests${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result?.serviceRequests?.items
          ? [
              ...result.serviceRequests.items.map(({ _id }) => ({ type: 'ServiceRequests', id: _id })),
              { type: 'ServiceRequests', id: 'LIST' },
            ]
          : [{ type: 'ServiceRequests', id: 'LIST' }],
      transformResponse: (response) => {
        if (!response || !response.success || !response.data) {
          console.error('Invalid service requests response:', response);
          return {
            serviceRequests: { items: [], pagination: { current: 1, total: 0, pages: 1 } },
            bundles: { items: [], pagination: { current: 1, total: 0, pages: 1 } }
          };
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
        'Provider',
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

    // Update bundle status (provider accepts/declines)
    updateBundleStatus: builder.mutation({
      query: ({ bundleId, ...body }) => ({
        url: `/bundles/${bundleId}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { bundleId }) => [
        { type: 'Bundles', id: bundleId },
        { type: 'Bundles', id: 'LIST' },
        'Provider',
        'ServiceRequests',
        { type: 'ServiceRequests', id: 'LIST' },
      ],
    }),

    // Create money request (provider -> customer) for service request or bundle
    createMoneyRequest: builder.mutation({
      query: (body) => ({
        url: '/money-requests/create',
        method: 'POST',
        body,
      }),
      // Invalidate both service requests and bundles lists so UI refreshes
      invalidatesTags: ['ServiceRequests', 'Bundles', 'Provider'],
      transformResponse: (response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to create money request');
        }
        return response.data;
      },
    }),

    // Get customer money requests (optionally filtered by serviceRequestId or bundleId)
    getCustomerMoneyRequests: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.status) queryParams.append('status', params.status);
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.serviceRequestId) queryParams.append('serviceRequestId', params.serviceRequestId);
        if (params?.bundleId) queryParams.append('bundleId', params.bundleId);

        const queryString = queryParams.toString();
        return `/money-requests/customer${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['MoneyRequests'],
      transformResponse: (response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to fetch money requests');
        }
        return response.data;
      },
    }),

    // Customer accepts money request
    acceptMoneyRequest: builder.mutation({
      query: ({ moneyRequestId, tipAmount = 0 }) => ({
        url: `/money-requests/${moneyRequestId}/accept`,
        method: 'PATCH',
        body: { tipAmount },
      }),
      invalidatesTags: ['MoneyRequests'],
      transformResponse: (response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to accept money request');
        }
        return response.data;
      },
    }),

    // Customer cancels money request
    cancelMoneyRequest: builder.mutation({
      query: ({ moneyRequestId }) => ({
        url: `/money-requests/${moneyRequestId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['MoneyRequests'],
      transformResponse: (response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to cancel money request');
        }
        return response.data;
      },
    }),

    // Customer pay money request (Stripe checkout)
    payMoneyRequest: builder.mutation({
      query: ({ moneyRequestId }) => ({
        url: `/money-requests/${moneyRequestId}/pay`,
        method: 'POST',
      }),
      invalidatesTags: ['MoneyRequests'],
      transformResponse: (response) => {
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to create payment session');
        }
        return response.data;
      },
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

    // Get bundle details by share token (view only, doesn't join)
    getBundleByToken: builder.query({
      query: (shareToken) => `/bundles/share/${shareToken}`,
      providesTags: (result, error, shareToken) => [
        { type: 'Bundles', id: shareToken },
      ],
      transformResponse: (response) => {
        console.log('Get bundle by token API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Bundle not found or expired');
        }
        return response;
      },
      // Don't refetch automatically
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),

    // Join a bundle via share token
    joinBundleByToken: builder.mutation({
      query: (shareToken) => ({
        url: `/bundles/share/${shareToken}`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, shareToken) => [
        { type: 'Bundles', id: shareToken },
        { type: 'Bundles', id: 'LIST' },
        { type: 'Bundles', id: 'NEARBY' },
      ],
      transformResponse: (response) => {
        console.log('Join bundle by token API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to join bundle');
        }
        return response;
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

    // Provider services (self)
    getProviderServicesList: builder.query({
      query: () => '/providers/services/my-services',
      providesTags: ['Provider'],
      transformResponse: (response) => {
        if (!response || !response.success) return { services: [] };
        return response.data || { services: [] };
      },
    }),

    addProviderService: builder.mutation({
      query: ({ serviceName, hourlyRate }) => ({
        url: '/providers/services/my-services',
        method: 'POST',
        body: { serviceName, hourlyRate },
      }),
      invalidatesTags: ['Provider'],
    }),

    deleteProviderService: builder.mutation({
      query: (serviceName) => ({
        url: '/providers/services/my-services',
        method: 'DELETE',
        body: { serviceName },
      }),
      invalidatesTags: ['Provider'],
    }),

    // Get nearby bundle requests for provider
    getProviderNearbyBundles: builder.query({
      query: () => '/zip/provider/nearby-bundles',
      providesTags: [{ type: 'Bundles', id: 'NEARBY' }, { type: 'Bundles', id: 'LIST' }],
      transformResponse: (response) => {
        console.log('Get provider nearby bundles API response:', response);
        if (!response || !response.success || !response.data) {
          return { bundles: [], pagination: { current: 1, total: 0, pages: 1 } };
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

    // Submit payout information
    submitPayoutInformation: builder.mutation({
      query: (data) => ({
        url: '/payout/information',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Submit payout information API response:', response);
        if (!response || !response.success) {
          throw new Error(response?.message || 'Failed to submit payout information');
        }
        return response.data;
      },
      transformErrorResponse: (response, meta) => {
        console.error('Submit payout information error response:', {
          status: meta?.response?.status,
          statusText: meta?.response?.statusText,
          data: response?.data || response,
          headers: meta?.response?.headers,
        });

        if (!response || Object.keys(response).length === 0) {
          return {
            status: meta?.response?.status || 'UNKNOWN_ERROR',
            data: {
              message: 'Network error or server did not respond. Please check your connection and try again.',
              errors: []
            }
          };
        }

        return {
          status: response.status || meta?.response?.status,
          data: response.data || response
        };
      },
    }),

    // Update provider profile (multipart form-data)
    updateProviderProfile: builder.mutation({
      query: (payload) => {
        // Build FormData from payload
        const formData = new FormData();

        const appendIfValue = (key, value) => {
          if (value !== undefined && value !== null && value !== '') {
            formData.append(key, value);
          }
        };

        appendIfValue('firstName', payload.firstName);
        appendIfValue('lastName', payload.lastName);
        appendIfValue('phone', payload.phone);
        appendIfValue('businessNameRegistered', payload.businessNameRegistered);
        appendIfValue('description', payload.description);
        appendIfValue('experience', payload.experience);
        appendIfValue('maxBundleCapacity', payload.maxBundleCapacity);

        // Services payloads (expects JSON strings)
        if (payload.servicesToAdd) {
          appendIfValue('servicesToAdd', JSON.stringify(payload.servicesToAdd));
        }
        if (payload.servicesToUpdate) {
          appendIfValue('servicesToUpdate', JSON.stringify(payload.servicesToUpdate));
        }
        if (payload.servicesToRemove) {
          appendIfValue('servicesToRemove', JSON.stringify(payload.servicesToRemove));
        }

        // Business days / hours
        if (payload.businessServiceDays) {
          appendIfValue('businessServiceDays', JSON.stringify(payload.businessServiceDays));
        }
        if (payload.businessHours) {
          appendIfValue('businessHours', JSON.stringify(payload.businessHours));
        }

        // Optional files
        if (payload.businessLogo instanceof File) {
          formData.append('businessLogo', payload.businessLogo);
        }
        if (payload.profileImage instanceof File) {
          formData.append('profileImage', payload.profileImage);
        }

        return {
          url: '/users/provider/update-profile',
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Update provider profile response:', response);
        return response?.data || response;
      },
      transformErrorResponse: (response) => {
        console.error('Update provider profile error:', response);
        return response;
      },
    }),

    // Get provider analytics
    getProviderAnalytics: builder.query({
      query: () => '/providers/analytics/my',
      providesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Get provider analytics API response:', response);
        console.log('Analytics data structure:', JSON.stringify(response, null, 2));
        if (!response || !response.success) {
          return {
            today: { orders: 0, earnings: 0 },
            month: { orders: 0, earnings: 0 }
          };
        }
        console.log('Returning analytics data:', response.data);
        return response.data;
      },
    }),

    // Get provider balance
    getProviderBalance: builder.query({
      query: () => '/providers/balance/my',
      providesTags: ['Provider'],
      transformResponse: (response) => {
        if (!response || !response.success || !response.data) {
          return {
            availableBalance: 0,
            pendingPayout: 0,
            totalEarnings: 0,
            totalPayout: 0,
          };
        }
        return response.data;
      },
    }),

    // Get provider reviews (authenticated)
    getProviderReviews: builder.query({
      query: () => '/providers/reviews/my',
      providesTags: ['Provider'],
      transformResponse: (response) => {
        console.log('Get provider reviews API response:', response);
        if (!response || !response.success || !response.data) {
          return {
            provider: null,
            statistics: {
              averageRating: 0,
              totalReviews: 0,
              ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            },
            list: [],
            pagination: { current: 1, total: 0, pages: 1, limit: 10 },
          };
        }

        const provider = response.data.provider || null;
        const reviews = response.data.reviews || {};
        const statistics = reviews.statistics || {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        };
        const pagination = reviews.pagination || {
          current: 1,
          total: 0,
          pages: 1,
          limit: 10,
        };
        const list = Array.isArray(reviews.list)
          ? reviews.list.map((item) => ({
            id: item.id || item._id,
            rating: item.rating || 0,
            comment: item.comment || '',
            createdAt: item.createdAt,
            serviceName: item.serviceName,
            serviceDate: item.serviceDate,
            customerName: `${item.customer?.firstName || ''} ${item.customer?.lastName || ''}`.trim() || 'Anonymous',
            customerAvatar: item.customer?.profileImage?.url || '',
          }))
          : [];

        return { provider, statistics, list, pagination };
      },
    }),

    // Get single service request by id
    getServiceRequestById: builder.query({
      query: (requestId) => `/service-requests/${requestId}`,
      providesTags: (result, error, requestId) => [
        { type: 'ServiceRequests', id: requestId },
      ],
      transformResponse: (response) => {
        console.log('Get service request by id response:', response);
        return response || { data: null };
      },
    }),

    // Get single bundle by id
    getBundleById: builder.query({
      query: (bundleId) => `/bundles/${bundleId}`,
      providesTags: (result, error, bundleId) => [
        { type: 'Bundles', id: bundleId },
      ],
      transformResponse: (response) => {
        console.log('Get bundle by id response:', response);
        return response || { data: null };
      },
    }),

    // Get provider's service requests
    getProviderServiceRequests: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        return `/service-requests/provider/my-requests${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) => [
        { type: 'ServiceRequests', id: 'LIST' },
        { type: 'Bundles', id: 'LIST' },
        'Provider',
      ],
      transformResponse: (response) => {
        console.log('Get provider service requests API response:', response);
        console.log('Service requests data structure:', JSON.stringify(response, null, 2));
        if (!response || !response.success) {
          return {
            serviceRequests: [],
            bundles: { requests: [], total: 0 },
            pagination: { current: 1, total: 0, pages: 1 }
          };
        }
        const data = response.data || {};

        // Normalize bundles to mirror customer bundle structure (address, pricing, participants, etc.)
        const bundles = data.bundles?.items || [];
        const normalizedBundles = bundles.map((bundle) => ({
          ...bundle,
          // Ensure address exists for UI compatibility
          address: bundle.address || {
            street: bundle.locationInfo?.customerAddress?.street,
            city: bundle.locationInfo?.customerAddress?.city,
            state: bundle.locationInfo?.customerAddress?.state,
            aptSuite: bundle.locationInfo?.customerAddress?.aptSuite,
          },
          // Ensure pricing object exists
          pricing: bundle.pricing || {
            originalPrice: bundle.price || bundle.finalPrice || 0,
            discountAmount: bundle.discountAmount || 0,
            finalPrice: bundle.finalPrice || bundle.price || 0,
            discountPercent: bundle.discountPercent || 0,
          },
          // Normalize participants array
          participants: Array.isArray(bundle.participants) ? bundle.participants : [],
          // Preserve services list
          services: Array.isArray(bundle.services) ? bundle.services : [],
        }));

        console.log('Returning service requests data:', {
          ...data,
          bundles: {
            ...data.bundles,
            items: normalizedBundles,
          },
        });

        return {
          ...data,
          bundles: {
            ...(data.bundles || {}),
            items: normalizedBundles,
          },
        };
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
  useSubmitPayoutInformationMutation,
  // Service hooks
  useGetServicesQuery,
  useGetServicesByCategoryQuery,
  useGetServiceByIdQuery,
  useGetMyServiceRequestsQuery,
  useCreateServiceRequestMutation,
  useUpdateServiceRequestStatusMutation,
  useCancelServiceRequestMutation,
  useCreateBundleMutation,
  useUpdateBundleStatusMutation,
  useCreateMoneyRequestMutation,
  useGetCustomerMoneyRequestsQuery,
  useAcceptMoneyRequestMutation,
  useCancelMoneyRequestMutation,
  usePayMoneyRequestMutation,
  useGetMyBundlesQuery,
  useGetAllBundlesQuery,
  useGetNearbyBundlesQuery,
  useJoinBundleMutation,
  useGetBundleByTokenQuery,
  useGetBundleByIdQuery,
  useJoinBundleByTokenMutation,
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
  useGetProviderAnalyticsQuery,
  useGetProviderBalanceQuery,
  useGetProviderReviewsQuery,
  useGetProviderNearbyBundlesQuery,
  useGetServiceRequestByIdQuery,
  useGetProviderServiceRequestsQuery,
  useUpdateProviderProfileMutation,
  useGetProviderServicesListQuery,
  useAddProviderServiceMutation,
  useDeleteProviderServiceMutation,
} = servicesApi;
