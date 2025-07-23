import React from 'react';
import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could implement custom wave animation
    none: '',
  };

  const styles: React.CSSProperties = {};
  if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
  if (height) styles.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        !height && variant === 'text' && 'h-4',
        !width && variant === 'text' && 'w-full',
        className
      )}
      style={styles}
    />
  );
};

// Pre-built skeleton components for common use cases
export const PostSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <Skeleton variant="rectangular" height={192} className="w-full" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <Skeleton width={64} height={24} variant="rounded" />
        <div className="flex space-x-1">
          <Skeleton width={48} height={20} variant="rounded" />
          <Skeleton width={64} height={20} variant="rounded" />
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <Skeleton height={24} />
        <Skeleton height={24} width="75%" />
      </div>
      <div className="space-y-2 mb-4">
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton height={16} width="60%" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton width={80} height={16} className="ml-2" />
        </div>
        <div className="flex space-x-4">
          <Skeleton width={40} height={16} />
          <Skeleton width={40} height={16} />
        </div>
      </div>
    </div>
  </div>
);

export const UserSkeleton: React.FC = () => (
  <div className="flex items-center space-x-3 animate-pulse">
    <Skeleton variant="circular" width={40} height={40} />
    <div className="space-y-2">
      <Skeleton width={120} height={16} />
      <Skeleton width={80} height={14} />
    </div>
  </div>
);

export const CommentSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="flex items-start space-x-3">
      <Skeleton variant="circular" width={32} height={32} />
      <div className="flex-1 space-y-2">
        <Skeleton width={100} height={14} />
        <div className="space-y-1">
          <Skeleton height={14} />
          <Skeleton height={14} width="80%" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton width={60} height={12} />
          <Skeleton width={40} height={12} />
        </div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton height={32} width={200} />
        <Skeleton height={20} width={300} />
      </div>
      <Skeleton height={40} width={120} variant="rounded" />
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton height={20} width={80} />
              <Skeleton height={32} width={60} />
            </div>
            <Skeleton variant="circular" width={48} height={48} />
          </div>
        </div>
      ))}
    </div>

    {/* Content Area */}
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-4">
        <Skeleton height={24} width={150} />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-3">
              <Skeleton variant="rounded" width={60} height={40} />
              <div className="space-y-1">
                <Skeleton height={16} width={200} />
                <Skeleton height={14} width={120} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton height={32} width={80} variant="rounded" />
              <Skeleton height={32} width={32} variant="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
