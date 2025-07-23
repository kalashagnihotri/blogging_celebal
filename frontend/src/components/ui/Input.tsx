import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined' | 'search';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  className,
  disabled,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  };

  const variantClasses = {
    default: [
      'border border-gray-300',
      'bg-white',
      'focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
    ],
    filled: [
      'border-0',
      'bg-gray-100',
      'focus:bg-white focus:ring-2 focus:ring-primary-500',
    ],
    outlined: [
      'border-2 border-gray-300',
      'bg-transparent',
      'focus:border-primary-500',
    ],
    search: [
      'border border-gray-300',
      'bg-white/80 backdrop-blur-sm',
      'focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
    ],
  };

  const baseClasses = [
    'flex w-full rounded-lg',
    'transition-all duration-200',
    'placeholder:text-gray-400',
    'focus:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ];

  const inputClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className
  );

  // Exclude custom props from input element

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 h-5 w-5">{leftIcon}</span>
          </div>
        )}
        <input
          className={inputClasses}
          ref={ref}
          disabled={disabled}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-gray-400 h-5 w-5">{rightIcon}</span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
