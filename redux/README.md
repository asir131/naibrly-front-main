# Redux Integration Guide

This project uses **Redux Toolkit** with **RTK Query** for state management and API integration.

## Structure

```
redux/
├── store.js                 # Redux store configuration
├── slices/
│   ├── authSlice.js        # Authentication state
│   └── servicesSlice.js    # Services state
└── api/
    └── servicesApi.js      # RTK Query API for services
```

## Services API Integration

### Overview
The services API base URL should come from `NEXT_PUBLIC_API_BASE_URL` (e.g., `https://naibrly-backend-main.onrender.com/api`).

The API returns a 3-level hierarchy:
1. **Main Categories**: Interior, Exterior, More Services
2. **Category Types**: Home Repairs & Maintenance, Cleaning & Organization, etc.
3. **Services**: Individual services like Plumbing, HVAC, etc.

### Usage in Components

#### Option 1: Using the custom hook (Recommended)

```javascript
import { useServices } from '@/hooks/useServices';

function MyComponent() {
  const {
    services,           // Array of all services
    organized,          // Organized by hierarchy
    isLoading,          // Loading state
    error,              // Error state
    refetch,            // Refetch function
    getServicesByMainCategory,
    getServicesByCategoryType
  } = useServices();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading services</div>;

  // Get all Interior services
  const interiorServices = getServicesByMainCategory('Interior');

  // Get specific category type services
  const cleaningServices = getServicesByCategoryType('Interior', 'Cleaning & Organization');

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

#### Option 2: Using RTK Query directly

```javascript
import { useGetServicesQuery } from '@/redux/api/servicesApi';

function MyComponent() {
  const { data, isLoading, error } = useGetServicesQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  const { services, organized } = data;

  return (
    <div>
      {/* Access organized.Interior, organized.Exterior, etc. */}
    </div>
  );
}
```

### Data Structure

#### API Response Format
The API returns:
```javascript
{
  success: true,
  data: {
    services: [...]  // Array of services
  }
}
```

#### Raw Response (`data.services`)
Array of service objects:
```javascript
[
  {
    _id: "service_id",
    name: "Plumbing",
    description: "Plumbing services",
    isActive: true,
    order: 0,
    categoryType: {
      _id: "categoryType_id",
      name: "Home Repairs & Maintenance",
      description: "...",
      category: {
        _id: "category_id",
        name: "Interior",
        description: "..."
      }
    }
  }
]
```

#### Organized Response (`data.organized`)
Organized by hierarchy:
```javascript
{
  "Interior": {
    name: "Interior",
    description: "...",
    categoryTypes: {
      "Home Repairs & Maintenance": {
        name: "Home Repairs & Maintenance",
        description: "...",
        services: [
          { id: "...", name: "Plumbing", description: "...", isActive: true, order: 0 }
        ]
      }
    }
  }
}
```

## Features

### Automatic Caching
RTK Query automatically caches API responses. The same data won't be fetched multiple times.

### Loading States
Every query provides `isLoading`, `isFetching`, and `isError` states.

### Refetching
```javascript
const { refetch } = useGetServicesQuery();

// Manually refetch data
refetch();
```

### Background Refetching
RTK Query will automatically refetch data when:
- Window regains focus
- Network connection is restored
- Component remounts (if cache is stale)

## Adding New API Endpoints

To add a new endpoint to the services API:

```javascript
// In redux/api/servicesApi.js
export const servicesApi = createApi({
  // ... existing config
  endpoints: (builder) => ({
    // ... existing endpoints

    // Add new endpoint
    getServicesByCategory: builder.query({
      query: (categoryId) => `/categories/${categoryId}/services`,
      providesTags: ['Services'],
    }),
  }),
});

// Export the hook
export const {
  useGetServicesQuery,
  useGetServicesByCategoryQuery // New hook
} = servicesApi;
```

## Best Practices

1. **Use the custom hook** (`useServices`) for most use cases
2. **Avoid manual state management** - RTK Query handles it
3. **Use tags for cache invalidation** when you add mutations
4. **Handle loading and error states** in your components
5. **Use the organized data structure** for hierarchical displays

## Example: Navbar Integration

The Navbar component demonstrates the full integration:
- Fetches services using `useGetServicesQuery()`
- Transforms data into the required format
- Handles loading and error states
- Renders hierarchical dropdown menus

See [components/Global/Global/Navbar.jsx](../../components/Global/Global/Navbar.jsx) for the complete implementation.
