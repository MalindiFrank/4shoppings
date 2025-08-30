import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserRegistration, UserLogin, UserUpdate } from '../../types';
import { userApi } from '../../utils/api';
import {
  getTokenFromStorage,
  setTokenInStorage,
  removeTokenFromStorage,
  getCurrentUserId,
  hashPassword
} from '../../utils/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  token: getTokenFromStorage(),
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: UserRegistration, { rejectWithValue }) => {
    try {
      // Hash password before sending to API
      const hashedPassword = await hashPassword(userData.password);
      const userWithHashedPassword = { ...userData, password: hashedPassword };
      
      await userApi.register(userWithHashedPassword);
      
      // Auto-login after registration
      const loginResult = await userApi.login({
        email: userData.email,
        password: userData.password,
      });
      
      setTokenInStorage(loginResult.token);
      return loginResult;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: UserLogin, { rejectWithValue }) => {
    try {
      const result = await userApi.login(credentials);
      setTokenInStorage(result.token);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const loadUserFromToken = createAsyncThunk(
  'auth/loadFromToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = getTokenFromStorage();
      if (!token) {
        throw new Error('No token found');
      }
      
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('Invalid token');
      }
      
      const user = await userApi.getProfile(userId);
      return { user, token };
    } catch (error: any) {
      removeTokenFromStorage();
      return rejectWithValue(error.message || 'Failed to load user');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: UserUpdate, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // If password is being updated, hash it
      let updatesWithHashedPassword = updates;
      if (updates.password) {
        const hashedPassword = await hashPassword(updates.password);
        updatesWithHashedPassword = { ...updates, password: hashedPassword };
      }
      
      const updatedUser = await userApi.updateProfile(userId, updatesWithHashedPassword);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Profile update failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    removeTokenFromStorage();
    return null;
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // Load user from token
    builder
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout user
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
