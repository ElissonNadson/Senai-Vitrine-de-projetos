import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded'
      case 'circular':
        return 'rounded-full'
      case 'rounded':
        return 'rounded-lg'
      case 'rectangular':
      default:
        return 'rounded'
    }
  }

  const getAnimationClasses = () => {
    switch (animation) {
      case 'pulse':
        return 'animate-pulse'
      case 'wave':
        return 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
      case 'none':
      default:
        return ''
    }
  }

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
  }

  return (
    <div
      className={`bg-gray-200 ${getVariantClasses()} ${getAnimationClasses()} ${className}`}
      style={style}
      aria-label="Loading..."
      role="status"
    />
  )
}

export default Skeleton
