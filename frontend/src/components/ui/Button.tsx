import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'gradient' | 'glow' | 'neon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = 'lg',
  children,
  className,
  disabled,
  ...props
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-semibold',
    'transition-all duration-300 ease-out',
    'focus:outline-none focus:ring-4 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'relative overflow-hidden',
    'active:scale-95',
  ];

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white',
      'hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800',
      'shadow-lg hover:shadow-xl hover:shadow-blue-500/25',
      'focus:ring-blue-500/50',
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300',
    ],
    secondary: [
      'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-white',
      'hover:from-gray-700 hover:via-gray-800 hover:to-gray-900',
      'shadow-lg hover:shadow-xl hover:shadow-gray-500/25',
      'focus:ring-gray-500/50',
    ],
    ghost: [
      'text-gray-700 dark:text-gray-300 bg-transparent',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'focus:ring-gray-500/50',
      'border border-transparent hover:border-gray-200 dark:hover:border-gray-700',
    ],
    danger: [
      'bg-gradient-to-r from-red-600 via-red-700 to-pink-700 text-white',
      'hover:from-red-700 hover:via-red-800 hover:to-pink-800',
      'shadow-lg hover:shadow-xl hover:shadow-red-500/25',
      'focus:ring-red-500/50',
    ],
    success: [
      'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white',
      'hover:from-green-700 hover:via-emerald-700 hover:to-teal-700',
      'shadow-lg hover:shadow-xl hover:shadow-green-500/25',
      'focus:ring-green-500/50',
    ],
    outline: [
      'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800',
      'hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      'focus:ring-blue-500/50',
      'shadow-sm hover:shadow-md',
    ],
    gradient: [
      'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white',
      'hover:from-purple-700 hover:via-pink-700 hover:to-blue-700',
      'shadow-lg hover:shadow-xl hover:shadow-purple-500/25',
      'focus:ring-purple-500/50',
      'animate-gradient-x bg-[length:200%_200%]',
    ],
    glow: [
      'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 text-white',
      'hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400',
      'shadow-lg hover:shadow-2xl',
      'focus:ring-cyan-500/50',
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/50 before:via-blue-400/50 before:to-purple-400/50 before:blur-lg before:-z-10',
      'hover:before:blur-xl hover:before:scale-110 before:transition-all before:duration-300',
    ],
    neon: [
      'bg-black text-cyan-400 border-2 border-cyan-400',
      'hover:bg-cyan-400 hover:text-black hover:shadow-cyan-400/50',
      'focus:ring-cyan-500/50',
      'shadow-lg hover:shadow-xl hover:shadow-cyan-400/25',
      'font-mono uppercase tracking-wider',
    ],
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
    '2xl': 'px-12 py-6 text-xl',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses[rounded],
    fullWidth && 'w-full',
    loading && 'cursor-wait',
    !disabled && 'hover:scale-105 hover:-translate-y-0.5',
    className
  );

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {leftIcon && !loading && (
        <span className="mr-2 transition-transform duration-300 group-hover:scale-110">{leftIcon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {rightIcon && (
        <span className="ml-2 transition-transform duration-300 group-hover:scale-110">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
