import React, { forwardRef } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      startIcon,
      endIcon,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = Boolean(error);

    const inputClasses = [
      'input-field',
      fullWidth ? 'input-full-width' : '',
      hasError ? 'input-error' : '',
      startIcon ? 'input-with-start-icon' : '',
      endIcon ? 'input-with-end-icon' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="input-container">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          {startIcon && <span className="input-icon input-start-icon">{startIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            {...props}
          />
          {endIcon && <span className="input-icon input-end-icon">{endIcon}</span>}
        </div>
        {(error || helperText) && (
          <div className={`input-helper ${hasError ? 'input-helper-error' : ''}`}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
