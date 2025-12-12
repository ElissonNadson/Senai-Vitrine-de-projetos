import React, { useState, useRef, useEffect } from 'react'
import { Palette, Check } from 'lucide-react'
import { useTheme, AccentColor } from '@/contexts/theme-context'

export const ThemeSwitcher: React.FC = () => {
    const { accentColor, setAccentColor } = useTheme()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const colors: { value: AccentColor; label: string; colorClass: string }[] = [
        { value: 'blue', label: 'Azul', colorClass: 'bg-blue-500' },
        { value: 'indigo', label: 'Indigo', colorClass: 'bg-indigo-500' },
        { value: 'purple', label: 'Roxo', colorClass: 'bg-purple-500' },
        { value: 'pink', label: 'Rosa', colorClass: 'bg-pink-500' },
        { value: 'orange', label: 'Laranja', colorClass: 'bg-orange-500' },
        { value: 'green', label: 'Verde', colorClass: 'bg-green-500' },
    ]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative group"
                title="Alterar cor do tema"
            >
                <Palette className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200 p-2">
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Cor do Tema
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => {
                                    setAccentColor(color.value)
                                    setIsOpen(false)
                                }}
                                className={`
                  relative flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200
                  ${color.colorClass} hover:scale-110 hover:shadow-md
                  ${accentColor === color.value ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-400 dark:ring-gray-500 scale-105' : ''}
                `}
                                title={color.label}
                            >
                                {accentColor === color.value && (
                                    <Check className="h-5 w-5 text-white stroke-[3]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
