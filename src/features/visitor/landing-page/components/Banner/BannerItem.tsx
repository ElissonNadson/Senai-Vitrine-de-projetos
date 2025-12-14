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
}

const BannerItem: React.FC<BannerItemProps> = ({
    title,
    subtitle,
    image,
    link,
    isActive,
    onMouseEnter
}) => {
    return (
        <div
            className={`relative h-[450px] md:h-[60vh] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden cursor-pointer group ${isActive ? 'flex-[3] md:flex-[4]' : 'flex-1 hover:flex-[1.5]'
                }`}
            onMouseEnter={onMouseEnter}
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
            <Link to={link} className="absolute inset-0 flex flex-col justify-end p-8 text-white items-center text-center">

                {/* Active State Content (Full info) */}
                {isActive && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="max-w-2xl flex flex-col items-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
                                {subtitle}
                            </p>
                        )}
                        <div className="flex items-center gap-3 text-sm font-bold tracking-wider uppercase bg-white/10 w-fit px-6 py-3 rounded-full backdrop-blur-sm hover:bg-white hover:text-blue-900 transition-colors duration-300">
                            Saiba Mais <ArrowRight size={18} />
                        </div>
                    </motion.div>
                )}

                {/* Inactive State Content (Vertical Text) */}
                {!isActive && (
                    <div className="absolute inset-0 flex items-end justify-center pb-12">
                        <h3 className="text-2xl font-bold tracking-widest whitespace-nowrap [writing-mode:vertical-rl] rotate-180 opacity-80 group-hover:opacity-100 transition-opacity">
                            {title}
                        </h3>
                    </div>
                )}
            </Link>
        </div>
    )
}

export default BannerItem
