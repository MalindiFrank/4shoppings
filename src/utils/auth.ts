import bcrypt from 'bcryptjs';

// Password encryption utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Token utilities
export const generateToken = (userId: string): string => {
  return `token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setTokenInStorage = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeTokenFromStorage = (): void => {
  localStorage.removeItem('authToken');
};

// User ID utilities
export const getUserIdFromToken = (token: string): string | null => {
  try {
    const parts = token.split('_');
    return parts[1] || null;
  } catch {
    return null;
  }
};

export const getCurrentUserId = (): string | null => {
  const token = getTokenFromStorage();
  return token ? getUserIdFromToken(token) : null;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Form validation
export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export const validateRegistrationForm = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  cellPhone: string;
}): ValidationResult => {
  const errors: { [key: string]: string } = {};
  
  // Email validation
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  // Password validation
  if (!data.password) {
    errors.password = 'Password is required';
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }
  }
  
  // Confirm password validation
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  // First name validation
  if (!data.firstName) {
    errors.firstName = 'First name is required';
  } else if (!validateName(data.firstName)) {
    errors.firstName = 'First name must be at least 2 characters long';
  }
  
  // Last name validation
  if (!data.lastName) {
    errors.lastName = 'Last name is required';
  } else if (!validateName(data.lastName)) {
    errors.lastName = 'Last name must be at least 2 characters long';
  }
  
  // Phone validation
  if (!data.cellPhone) {
    errors.cellPhone = 'Cell phone number is required';
  } else if (!validatePhoneNumber(data.cellPhone)) {
    errors.cellPhone = 'Please enter a valid phone number';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: { [key: string]: string } = {};
  
  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (!data.password) {
    errors.password = 'Password is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
