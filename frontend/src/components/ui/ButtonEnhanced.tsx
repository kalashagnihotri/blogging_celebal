import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'gradient' | 'glass' | 'neon' | 'glow';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  glow?: boolean;
  animate?: boolean;
}

const ButtonEnhanced = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = 'lg',
  glow = false,
  animate = true,
  children,
  className,
  disabled,
  ...props
}, ref) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out',
    'focus:outline-none focus:ring-4 focus:ring-opacity-50',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'relative overflow-hidden group',
    animate && 'hover:transform hover:scale-[1.02] active:scale-[0.98]',
    glow && 'hover:shadow-2xl',
  ].filter(Boolean);

  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs gap-1',
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
    xl: 'px-10 py-5 text-xl gap-4',
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500',
      'text-white border-0',
      'hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-400 dark:hover:to-purple-400',
      'focus:ring-blue-500 dark:focus:ring-blue-400',
      'shadow-lg hover:shadow-xl',
      glow && 'hover:shadow-blue-500/50 dark:hover:shadow-blue-400/50',
    ],
    secondary: [
      'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100',
      'border border-gray-200 dark:border-gray-600',
      'hover:bg-gray-200 dark:hover:bg-gray-600',
      'focus:ring-gray-500',
    ],
    ghost: [
      'bg-transparent text-gray-700 dark:text-gray-300',
      'hover:bg-gray-100 dark:hover:bg-gray-800',
      'focus:ring-gray-500',
    ],
    danger: [
      'bg-gradient-to-r from-red-500 to-pink-600 dark:from-red-600 dark:to-pink-700',
      'text-white border-0',
      'hover:from-red-600 hover:to-pink-700 dark:hover:from-red-500 dark:hover:to-pink-600',
      'focus:ring-red-500',
      'shadow-lg hover:shadow-xl',
      glow && 'hover:shadow-red-500/50',
    ],
    success: [
      'bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700',
      'text-white border-0',
      'hover:from-green-600 hover:to-emerald-700 dark:hover:from-green-500 dark:hover:to-emerald-600',
      'focus:ring-green-500',
      'shadow-lg hover:shadow-xl',
      glow && 'hover:shadow-green-500/50',
    ],
    outline: [
      'bg-transparent border-2',
      'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400',
      'hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white',
      'focus:ring-blue-500',
    ],
    gradient: [
      'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
      'text-white border-0',
      'hover:from-purple-600 hover:via-pink-600 hover:to-red-600',
      'focus:ring-purple-500',
      'shadow-lg hover:shadow-xl',
      glow && 'hover:shadow-purple-500/50',
    ],
    glass: [
      'bg-white/10 dark:bg-black/10 backdrop-blur-lg',
      'border border-white/20 dark:border-white/10',
      'text-gray-900 dark:text-white',
      'hover:bg-white/20 dark:hover:bg-black/20',
      'focus:ring-white/50',
    ],
    neon: [
      'bg-black border-2 border-cyan-400',
      'text-cyan-400',
      'hover:bg-cyan-400 hover:text-black hover:shadow-cyan-400/50',
      'focus:ring-cyan-400',
      'shadow-lg hover:shadow-2xl',
      'before:absolute before:inset-0 before:bg-cyan-400/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
    ],
    glow: [
      'bg-gradient-to-r from-cyan-500 to-blue-500',
      'text-white border-0',
      'hover:from-cyan-400 hover:to-blue-400',
      'focus:ring-cyan-500',
      'shadow-lg hover:shadow-2xl hover:shadow-cyan-500/50',
    ],
  };

  const shimmerEffect = animate && (
    <div className="absolute inset-0 -top-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:top-full transition-all duration-700 ease-out" />
  );

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        roundedClasses[rounded],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {shimmerEffect}
      {loading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {leftIcon && !loading && (
        <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span className="relative z-10">{children}</span>
      {rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

ButtonEnhanced.displayName = 'ButtonEnhanced';

export default ButtonEnhanced;
