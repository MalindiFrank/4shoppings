import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppDispatch } from './hooks/redux';
import { loadUserFromToken } from './store/slices/authSlice';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';

import './App.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Try to load user from stored token on app start
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes (login/register) */}
        <Route path="/login" element={
          <PublicRoute>
            <Layout showHeader={false}>
              <Login />
            </Layout>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Layout showHeader={false}>
              <Register />
            </Layout>
          </PublicRoute>
        } />

        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
