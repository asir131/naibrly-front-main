import { createSlice } from '@reduxjs/toolkit';

// Helper function to get initial state from localStorage (client-side only)
const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      user: null,
      userType: null,
      isLoading: false,
    };
  }

  try {
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      return {
        isAuthenticated: true,
        user: userData,
        userType: storedUserType || userData.userType || null,
        isLoading: false,
      };
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
  }

  return {
    isAuthenticated: false,
    user: null,
    userType: null, // 'user' or 'provider'
    isLoading: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user || action.payload;
      state.userType = action.payload.userType || action.payload.user?.userType || 'user';
      state.isAuthenticated = true;
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('userType', state.userType);
      }
    },
    logout: (state) => {
      state.user = null;
      state.userType = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('authToken'); // Clear auth token
        // Redirect to home page
        window.location.href = '/';
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    checkAuth: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem('user');
          const storedUserType = localStorage.getItem('userType');
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            state.user = userData;
            state.userType = storedUserType || userData.userType || 'user';
            state.isAuthenticated = true;
          }
        } catch (error) {
          console.error('Error checking auth:', error);
        }
        state.isLoading = false;
      }
    },
  },
});

export const { login, logout, updateUser, setLoading, checkAuth } = authSlice.actions;
export default authSlice.reducer;