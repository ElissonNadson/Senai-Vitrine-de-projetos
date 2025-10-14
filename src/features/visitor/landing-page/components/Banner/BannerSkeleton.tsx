import React from 'react'
import Skeleton from '@/components/ui/Skeleton'

const BannerSkeleton: React.FC = () => {
  return (
    <section className="w-full h-[600px] bg-gray-100">
      <div className="flex h-full">
        {/* Skeleton for multiple banner items */}
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex-1 p-0 relative">
            <Skeleton 
              variant="rectangular" 
              className="w-full h-full" 
              animation="wave"
            />
            {/* Text skeleton at bottom */}
            <div className="absolute bottom-8 left-12">
              <Skeleton 
                variant="rectangular" 
                width={120} 
                height={20} 
                className="transform -rotate-90 origin-bottom-left"
                animation="pulse"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default BannerSkeleton
