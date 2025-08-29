import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile,
  clearError,
} from '../store/slices/authSlice';
import type { UserLogin, UserRegistration, UserUpdate } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (credentials: UserLogin) => {
      const result = await dispatch(loginUser(credentials));
      return result;
    },
    [dispatch]
  );

  const register = useCallback(
    async (userData: UserRegistration) => {
      const result = await dispatch(registerUser(userData));
      return result;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const updateProfile = useCallback(
    async (updates: UserUpdate) => {
      const result = await dispatch(updateUserProfile(updates));
      return result;
    },
    [dispatch]
  );

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    clearError: clearAuthError,
  };
};
