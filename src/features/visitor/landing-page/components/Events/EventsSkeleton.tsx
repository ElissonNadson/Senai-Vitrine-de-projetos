import React from 'react'
import Skeleton from '@/components/ui/Skeleton'

const EventsSkeleton: React.FC = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Title skeleton */}
        <div className="flex justify-center mb-10">
          <Skeleton variant="text" width={300} height={32} animation="pulse" />
        </div>
        
        {/* Top row skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Large card skeleton */}
          <div className="md:col-span-2">
            <Skeleton variant="rectangular" className="w-full h-96" animation="wave" />
          </div>
          {/* Small card skeleton */}
          <div className="md:col-span-1">
            <Skeleton variant="rectangular" className="w-full h-96" animation="wave" />
          </div>
        </div>
        
        {/* Bottom row skeleton */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <Skeleton variant="rectangular" className="w-full h-64" animation="wave" />
          </div>
          <div className="flex-1">
            <Skeleton variant="rectangular" className="w-full h-64" animation="wave" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsSkeleton
