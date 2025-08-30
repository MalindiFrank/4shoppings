import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { loadUserFromToken } from '../../store/slices/authSlice';
import type { ProtectedRouteProps } from '../../types';

const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, loading, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If we have a token but user is not authenticated, try to load user
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUserFromToken());
    }
  }, [dispatch, token, isAuthenticated, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // If authenticated, redirect to home page
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }

  // If not authenticated, render the public component (login/register)
  return <>{children}</>;
};

export default PublicRoute;
