import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  organized: {}, // Organized services by category hierarchy
  services: [], // Flat array of all services
  selectedCategory: null,
  selectedCategoryType: null,
  selectedService: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setOrganizedServices: (state, action) => {
      state.organized = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedCategoryType: (state, action) => {
      state.selectedCategoryType = action.payload;
    },
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
    clearSelection: (state) => {
      state.selectedCategory = null;
      state.selectedCategoryType = null;
      state.selectedService = null;
    },
  },
});

export const {
  setOrganizedServices,
  setServices,
  setSelectedCategory,
  setSelectedCategoryType,
  setSelectedService,
  clearSelection,
} = servicesSlice.actions;

export default servicesSlice.reducer;
