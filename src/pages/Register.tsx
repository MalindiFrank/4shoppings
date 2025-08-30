import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validateRegistrationForm } from '../utils/auth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import './Auth.css';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    cellPhone: '',
  });
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const result = await register(registrationData);
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us to start managing your shopping lists</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <Input
              type="text"
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              error={formErrors.firstName}
              placeholder="Enter your first name"
              fullWidth
              required
            />

            <Input
              type="text"
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              error={formErrors.lastName}
              placeholder="Enter your last name"
              fullWidth
              required
            />
          </div>

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
            type="tel"
            name="cellPhone"
            label="Cell Phone Number"
            value={formData.cellPhone}
            onChange={handleInputChange}
            error={formErrors.cellPhone}
            placeholder="Enter your phone number"
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
            placeholder="Create a password"
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

          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={formErrors.confirmPassword}
            placeholder="Confirm your password"
            fullWidth
            required
            endIcon={
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="password-toggle"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
