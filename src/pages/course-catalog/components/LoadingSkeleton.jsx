import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 8, className = '' }) => {
  if (type === 'card') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="glass rounded-2xl overflow-hidden">
            {/* Image Skeleton */}
            <div className="h-48 bg-muted animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              {/* Category */}
              <div className="h-4 bg-muted rounded animate-pulse w-20" />
              
              {/* Title */}
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded animate-pulse w-full" />
                <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
              </div>
              
              {/* Instructor */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted rounded-full animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse w-24" />
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="w-3 h-3 bg-muted rounded animate-pulse" />
                  ))}
                </div>
                <div className="h-4 bg-muted rounded animate-pulse w-12" />
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-4">
                <div className="h-4 bg-muted rounded animate-pulse w-16" />
                <div className="h-4 bg-muted rounded animate-pulse w-20" />
                <div className="h-4 bg-muted rounded animate-pulse w-12" />
              </div>
              
              {/* Price and Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="h-6 bg-muted rounded animate-pulse w-20" />
                <div className="h-8 bg-muted rounded animate-pulse w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'filter') {
    return (
      <div className={`space-y-6 ${className}`}>
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="space-y-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-32" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'search') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="flex items-center gap-3 p-4 glass rounded-lg">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;