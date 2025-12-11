import React, { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

interface StaggerContainerProps {
    children: React.ReactNode
    className?: string
    delay?: number
    staggerChildren?: number
    once?: boolean
    width?: string
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
    children,
    className = '',
    delay = 0.1,
    staggerChildren = 0.15,
    once = true,
    width = '100%'
}) => {
    const ref = useRef(null)
    const isInView = useInView(ref, { once, margin: "-10% 0px -10% 0px" })
    const controls = useAnimation()

    useEffect(() => {
        if (isInView) {
            controls.start('visible')
        }
    }, [isInView, controls])

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: delay,
                staggerChildren: staggerChildren
            }
        }
    }

    return (
        <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
            className={className}
            style={{ width }}
        >
            {children}
        </motion.div>
    )
}

// Helper component for items within a StaggerContainer
export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => {
    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15
            } as const
        }
    }

    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    )
}

export default StaggerContainer
