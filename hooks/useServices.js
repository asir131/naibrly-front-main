/**
 * useServices Hook
 * Custom hook for accessing services data from the API
 */

import { useGetServicesQuery } from '@/redux/api/servicesApi';

export const useServices = () => {
  const { data, isLoading, error, refetch } = useGetServicesQuery();

  return {
    // Raw data
    services: data?.services || [],
    organized: data?.organized || {},

    // Loading and error states
    isLoading,
    error,

    // Refetch function
    refetch,

    // Helper functions
    getServicesByMainCategory: (mainCategory) => {
      if (!data?.organized?.[mainCategory]) return [];
      const category = data.organized[mainCategory];
      const result = [];

      Object.values(category.categoryTypes).forEach((categoryType) => {
        result.push(...categoryType.services);
      });

      return result;
    },

    getServicesByCategoryType: (mainCategory, categoryTypeName) => {
      if (!data?.organized?.[mainCategory]?.categoryTypes?.[categoryTypeName]) return [];
      return data.organized[mainCategory].categoryTypes[categoryTypeName].services;
    },

    getAllMainCategories: () => {
      if (!data?.organized) return [];
      return Object.keys(data.organized);
    },

    getCategoryTypes: (mainCategory) => {
      if (!data?.organized?.[mainCategory]) return [];
      return Object.keys(data.organized[mainCategory].categoryTypes);
    },
  };
};

export default useServices;
