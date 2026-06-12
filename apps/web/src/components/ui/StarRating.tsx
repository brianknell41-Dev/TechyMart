'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function StarRating({ rating, size = 'md', showValue, reviewCount, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)} aria-label={`Rating: ${rating} out of 5 stars`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizes[size],
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-gray-200 text-gray-200'
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="ml-1 font-normal text-gray-500">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
