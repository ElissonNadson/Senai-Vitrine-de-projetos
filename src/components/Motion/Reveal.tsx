import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

interface RevealProps {
  children: React.ReactNode
  width?: 'fit-content' | '100%'
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

const Reveal: React.FC<RevealProps> = ({
  children,
  width = 'fit-content',
  direction = 'up',
  delay = 0.25,
  duration = 0.5,
  className = '',
  once = true
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once })
  const mainControls = useAnimation()

  useEffect(() => {
    if (isInView) {
      mainControls.start('visible')
    } else if (!once) {
      mainControls.start('hidden')
    }
  }, [isInView, mainControls, once])

  const getVariants = (): Variants => {
    const distance = 75

    let hiddenVariant: any = { opacity: 0, scale: 0.95 }

    if (direction === 'up') hiddenVariant.y = distance
    if (direction === 'down') hiddenVariant.y = -distance
    if (direction === 'left') hiddenVariant.x = distance
    if (direction === 'right') hiddenVariant.x = -distance

    return {
      hidden: hiddenVariant,
      visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        transition: { duration, delay, ease: [0.25, 0.25, 0.25, 0.75] }
      },
    }
  }

  return (
    <div ref={ref} style={{ position: 'relative', width }} className={className}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default Reveal
