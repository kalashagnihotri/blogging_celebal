import React from 'react';

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      {/* Content skeleton */}
      <div className="p-6">
        {/* Category and tags */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
          <div className="flex space-x-1">
            <div className="h-5 w-12 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gray-200 rounded w-full"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Author and meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="ml-3">
              <div className="h-4 w-20 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
            <div className="h-4 w-8 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Read more */}
        <div className="mt-4">
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
