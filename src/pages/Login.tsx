import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateLoginForm } from '../utils/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      const result = await login(formData);
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/home');
      }
    } catch (err) {
      // Error is handled by Redux
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            type="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            placeholder="Enter your email"
            fullWidth
            required
          />

          <Input
            type={showPassword ? 'text' : 'password'}
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            placeholder="Enter your password"
            fullWidth
            required
            endIcon={
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            }
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="large"
          >
            Sign In
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
