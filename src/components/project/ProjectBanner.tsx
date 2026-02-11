import React, { createContext, useContext } from 'react'
import { motion } from 'framer-motion'
import { AccentColor, useTheme } from '@/contexts/theme-context'

// Context para compartilhar dados entre sub-componentes (se necessário no futuro)
const BannerContext = createContext<{ project: any } | null>(null)

interface ProjectBannerProps {
    bannerUrl?: string
    accentColor?: AccentColor
    children: React.ReactNode
    className?: string
}

const getGradient = (color: AccentColor = 'blue') => {
    switch (color) {
        case 'indigo': return 'from-indigo-600 to-purple-600'
        case 'blue': return 'from-blue-600 to-cyan-600'
        case 'purple': return 'from-purple-600 to-pink-600'
        case 'pink': return 'from-pink-600 to-rose-600'
        case 'green': return 'from-green-600 to-emerald-600'
        case 'orange': return 'from-orange-600 to-red-600'
        default: return 'from-blue-600 to-indigo-600'
    }
}

// 1. Root Component
const Root = ({ bannerUrl, accentColor = 'blue', children, className = '' }: ProjectBannerProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900 h-[320px] ${className}`}
        >
            {bannerUrl ? (
                <img
                    src={bannerUrl}
                    alt="Project Banner"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getGradient(accentColor)} opacity-90`} />
            )}
            {children}
        </motion.div>
    )
}

// 2. Overlay Component
const Overlay = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent flex flex-col justify-end p-6 md:p-10 ${className}`}>
            <div className="max-w-4xl space-y-4">
                {children}
            </div>
        </div>
    )
}

// 3. Tags Component
const Tags = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {children}
        </div>
    )
}

// 4. Tag Item Component
const Tag = ({ children, className = '', variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'primary' }) => {
    const variants = {
        default: "bg-white/20 border-white/20 text-white",
        primary: "bg-blue-500/30 border-blue-400/30 text-blue-100"
    }
    return (
        <span className={`px-3 py-1 backdrop-blur-md border rounded-lg text-xs font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
            {children}
        </span>
    )
}

// 5. Title Component
const Title = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
    return (
        <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight ${className}`}>
            {children}
        </h1>
    )
}

// 6. Leader Component
const Leader = ({ name, avatarChar, label = "Criado por", className = '' }: { name: string, avatarChar?: string, label?: string, className?: string }) => {
    const char = avatarChar || name.charAt(0).toUpperCase();
    return (
        <div className={`flex items-center gap-3 text-gray-300 pt-2 ${className}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-white/20">
                {char}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium opacity-80">{label}</span>
                <span className="font-bold text-white">{name}</span>
            </div>
        </div>
    )
}

// Export as Compound Component
export const ProjectBanner = {
    Root,
    Overlay,
    Tags,
    Tag,
    Title,
    Leader
}
