import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface BannerItemProps {
    id: number
    title: string
    subtitle?: string
    image: string
    link: string
    isActive: boolean
    onMouseEnter: () => void
    onClick: () => void
}

const BannerItem: React.FC<BannerItemProps> = ({
    title,
    subtitle,
    image,
    link,
    isActive,
    onMouseEnter,
    onClick
}) => {
    // Handle click for mobile expansion
    const handleClick = (e: React.MouseEvent) => {
        // On mobile, if not active, prevent default link behavior and expand instead
        if (window.innerWidth < 768 && !isActive) {
            e.preventDefault()
            onClick()
        }
    }

    return (
        <div
            className={`relative transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden cursor-pointer group
                w-full md:w-auto
                ${isActive
                    ? 'h-[450px] md:h-auto md:flex-[4]'
                    : 'h-[60px] md:h-auto md:flex-1 md:hover:flex-[1.5]'
                }`}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                <img
                    src={image}
                    alt={title}
                    className={`w-full h-full object-cover transition-transform duration-[1200ms] ${isActive ? 'scale-100' : 'scale-110 group-hover:scale-105'
                        } ${!isActive ? 'grayscale-[0.5] group-hover:grayscale-0' : ''}`}
                />
                <div className={`absolute inset-0 transition-opacity duration-[1200ms] ${isActive
                    ? 'bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent'
                    : 'bg-blue-900/60 group-hover:bg-blue-900/40'
                    }`} />
            </div>

            {/* Content */}
            <Link
                to={link}
                onClick={handleClick}
                className={`absolute inset-0 flex text-white items-center
                    ${isActive
                        ? 'flex-col justify-end p-8 text-center'
                        : 'justify-center md:items-end md:pb-12'
                    }`}
            >

                {/* Active State Content (Full info) */}
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="max-w-2xl flex flex-col items-center"
                    >
                        <h2 className="text-3xl md:text-6xl font-bold mb-4 leading-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-base md:text-xl text-gray-200 mb-6 max-w-lg hidden md:block">
                                {subtitle}
                            </p>
                        )}
                        <div className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-wider uppercase bg-white/10 w-fit px-4 py-2 md:px-6 md:py-3 rounded-full backdrop-blur-sm hover:bg-white hover:text-blue-900 transition-colors duration-300">
                            Acessar <ArrowRight size={16} />
                        </div>
                    </motion.div>
                )}

                {/* Inactive State Content */}
                {!isActive && (
                    <div className="relative z-10">
                        {/* Mobile: Horizontal Text */}
                        <h3 className="md:hidden text-lg font-bold tracking-wider uppercase text-white/90">
                            {title}
                        </h3>

                        {/* Desktop: Vertical Text */}
                        <h3 className="hidden md:block text-2xl font-bold tracking-widest whitespace-nowrap [writing-mode:vertical-rl] rotate-180 opacity-80 group-hover:opacity-100 transition-opacity">
                            {title}
                        </h3>
                    </div>
                )}
            </Link>
        </div>
    )
}

export default BannerItem
