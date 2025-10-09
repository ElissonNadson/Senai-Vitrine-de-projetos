import React, { createContext, useContext, useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentColor = 'indigo' | 'blue' | 'purple' | 'pink' | 'green' | 'orange'

interface ThemeContextType {
  themeMode: ThemeMode
  accentColor: AccentColor
  effectiveTheme: 'light' | 'dark'
  setThemeMode: (mode: ThemeMode) => void
  setAccentColor: (color: AccentColor) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode')
    return (saved as ThemeMode) || 'system'
  })

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('accentColor')
    return (saved as AccentColor) || 'indigo'
  })

  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light')

  // Detectar preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateEffectiveTheme = () => {
      if (themeMode === 'system') {
        setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setEffectiveTheme(themeMode as 'light' | 'dark')
      }
    }

    updateEffectiveTheme()

    // Listener para mudanças na preferência do sistema
    mediaQuery.addEventListener('change', updateEffectiveTheme)
    return () => mediaQuery.removeEventListener('change', updateEffectiveTheme)
  }, [themeMode])

  // Aplicar tema no documento
  useEffect(() => {
    const root = document.documentElement
    
    // Aplicar/remover classe dark
    if (effectiveTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Aplicar cor de destaque
    root.setAttribute('data-accent', accentColor)
    
    // Aplicar variáveis CSS para a cor de destaque
    const colors = {
      indigo: {
        primary: '99 102 241', // indigo-500
        primaryDark: '79 70 229', // indigo-600
        primaryLight: '129 140 248', // indigo-400
      },
      blue: {
        primary: '59 130 246', // blue-500
        primaryDark: '37 99 235', // blue-600
        primaryLight: '96 165 250', // blue-400
      },
      purple: {
        primary: '168 85 247', // purple-500
        primaryDark: '147 51 234', // purple-600
        primaryLight: '192 132 252', // purple-400
      },
      pink: {
        primary: '236 72 153', // pink-500
        primaryDark: '219 39 119', // pink-600
        primaryLight: '244 114 182', // pink-400
      },
      green: {
        primary: '34 197 94', // green-500
        primaryDark: '22 163 74', // green-600
        primaryLight: '74 222 128', // green-400
      },
      orange: {
        primary: '249 115 22', // orange-500
        primaryDark: '234 88 12', // orange-600
        primaryLight: '251 146 60', // orange-400
      }
    }

    const colorValues = colors[accentColor]
    root.style.setProperty('--color-primary', colorValues.primary)
    root.style.setProperty('--color-primary-dark', colorValues.primaryDark)
    root.style.setProperty('--color-primary-light', colorValues.primaryLight)
    
    // Debug: Log para verificar se está aplicando
    console.log('🎨 Tema aplicado:', {
      theme: effectiveTheme,
      accent: accentColor,
      colors: colorValues
    })
  }, [effectiveTheme, accentColor])

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    localStorage.setItem('themeMode', mode)
  }

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color)
    localStorage.setItem('accentColor', color)
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        accentColor,
        effectiveTheme,
        setThemeMode,
        setAccentColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
