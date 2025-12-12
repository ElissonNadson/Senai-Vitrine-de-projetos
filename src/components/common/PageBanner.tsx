import React from 'react'
import { useTheme, AccentColor } from '@/contexts/theme-context'

interface PageBannerProps {
    title: string
    subtitle?: React.ReactNode
    icon?: React.ReactNode
    action?: React.ReactNode
    color?: AccentColor
    className?: string
}

export const PageBanner: React.FC<PageBannerProps> = ({
    title,
    subtitle,
    icon,
    action,
    color,
    className
}) => {
    const { accentColor: themeAccentColor } = useTheme()
    // Use provided color or fallback to theme color
    const accentColor = color || themeAccentColor

    const getThemeStyles = (color: AccentColor) => {
        switch (color) {
            case 'indigo':
                return {
                    gradient: 'from-indigo-900 via-indigo-800 to-purple-900',
                    iconColor: 'text-indigo-400',
                    textColor: 'text-indigo-200',
                    buttonBg: 'bg-indigo-500 hover:bg-indigo-600',
                    buttonShadow: 'hover:shadow-indigo-500/25'
                }
            case 'purple':
                return {
                    gradient: 'from-purple-900 via-purple-800 to-fuchsia-900',
                    iconColor: 'text-purple-400',
                    textColor: 'text-purple-200',
                    buttonBg: 'bg-purple-500 hover:bg-purple-600',
                    buttonShadow: 'hover:shadow-purple-500/25'
                }
            case 'pink':
                return {
                    gradient: 'from-pink-900 via-pink-800 to-rose-900',
                    iconColor: 'text-pink-400',
                    textColor: 'text-pink-200',
                    buttonBg: 'bg-pink-500 hover:bg-pink-600',
                    buttonShadow: 'hover:shadow-pink-500/25'
                }
            case 'green':
                return {
                    gradient: 'from-green-900 via-green-800 to-emerald-900',
                    iconColor: 'text-green-400',
                    textColor: 'text-green-200',
                    buttonBg: 'bg-green-500 hover:bg-green-600',
                    buttonShadow: 'hover:shadow-green-500/25'
                }
            case 'orange':
                return {
                    gradient: 'from-orange-900 via-orange-800 to-amber-900',
                    iconColor: 'text-orange-400',
                    textColor: 'text-orange-200',
                    buttonBg: 'bg-orange-500 hover:bg-orange-600',
                    buttonShadow: 'hover:shadow-orange-500/25'
                }
            case 'blue':
            default:
                return {
                    gradient: 'from-blue-900 via-blue-800 to-indigo-900',
                    iconColor: 'text-blue-400',
                    textColor: 'text-blue-200',
                    buttonBg: 'bg-blue-500 hover:bg-blue-600',
                    buttonShadow: 'hover:shadow-blue-500/25'
                }
        }
    }

    const styles = getThemeStyles(accentColor)

    return (
        <div className={`bg-gradient-to-r ${styles.gradient} text-white overflow-hidden relative transition-colors duration-500 ${className || ''}`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            {icon && (
                                <span className={`${styles.iconColor} transition-colors duration-300`}>
                                    {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-8 h-8' })}
                                </span>
                            )}
                            {title}
                        </h1>
                        {subtitle && (
                            <p className={`${styles.textColor} text-lg max-w-2xl transition-colors duration-300`}>
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {action && (
                        <div className="flex-shrink-0">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
