import React from 'react'
import { motion } from 'framer-motion'
import { Palette, Monitor, Sun, Moon, Check } from 'lucide-react'
import { useTheme, type ThemeMode, type AccentColor } from '@/contexts/theme-context'

const AppearanceTab: React.FC = () => {
  const { themeMode, accentColor, effectiveTheme, setThemeMode, setAccentColor } = useTheme()

  const themes: Array<{ id: ThemeMode; name: string; icon: typeof Sun; description: string }> = [
    { id: 'light', name: 'Claro', icon: Sun, description: 'Tema claro para todos os momentos' },
    { id: 'dark', name: 'Escuro', icon: Moon, description: 'Tema escuro para reduzir o cansaço visual' },
    { id: 'system', name: 'Sistema', icon: Monitor, description: 'Segue as preferências do sistema' }
  ]

  const accentColors: Array<{ id: AccentColor; name: string; color: string; preview: string }> = [
    { id: 'indigo', name: 'Índigo', color: 'bg-indigo-600', preview: 'from-indigo-500 to-indigo-700' },
    { id: 'blue', name: 'Azul', color: 'bg-blue-600', preview: 'from-blue-500 to-blue-700' },
    { id: 'purple', name: 'Roxo', color: 'bg-purple-600', preview: 'from-purple-500 to-purple-700' },
    { id: 'pink', name: 'Rosa', color: 'bg-pink-600', preview: 'from-pink-500 to-pink-700' },
    { id: 'green', name: 'Verde', color: 'bg-green-600', preview: 'from-green-500 to-green-700' },
    { id: 'orange', name: 'Laranja', color: 'bg-orange-600', preview: 'from-orange-500 to-orange-700' }
  ]

  const currentAccentData = accentColors.find(c => c.id === accentColor) || accentColors[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Theme Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tema da Interface
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Escolha o tema que melhor se adapta ao seu estilo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon
            const isSelected = themeMode === theme.id
            return (
              <button
                key={theme.id}
                onClick={() => setThemeMode(theme.id)}
                className={`relative p-4 sm:p-6 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <Icon className={`h-8 w-8 mb-3 ${
                  isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                }`} />
                <p className="font-medium text-gray-900 dark:text-white mb-1">
                  {theme.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {theme.description}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cor de Destaque
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Personalize a cor principal da interface
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {accentColors.map((color) => {
            const isSelected = accentColor === color.id
            return (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className="group flex flex-col items-center gap-2"
              >
                <div className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-full ${color.color} transition-transform group-hover:scale-110 ${
                  isSelected ? 'ring-4 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-gray-300 dark:ring-gray-600' : ''
                }`}>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {color.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Pré-visualização
        </h3>

        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6">
          {/* Header Preview */}
          <div className={`bg-gradient-to-br ${currentAccentData.preview} rounded-lg p-4 sm:p-6 text-white mb-4`}>
            <h4 className="text-lg sm:text-xl font-bold mb-2">Dashboard de Projetos</h4>
            <p className="text-sm ${currentAccentData.id === 'indigo' ? 'text-indigo-100' : 'text-white/80'}">
              Esta é uma prévia de como a interface ficará com suas configurações
            </p>
          </div>

          {/* Cards Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`${effectiveTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
              <div className={`h-8 w-8 rounded-full ${currentAccentData.color} mb-2`}></div>
              <div className={`h-3 ${effectiveTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4 mb-2`}></div>
              <div className={`h-2 ${effectiveTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2`}></div>
            </div>
            <div className={`${effectiveTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
              <div className={`h-8 w-8 rounded-full ${currentAccentData.color} mb-2`}></div>
              <div className={`h-3 ${effectiveTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4 mb-2`}></div>
              <div className={`h-2 ${effectiveTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2`}></div>
            </div>
            <div className={`${effectiveTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4`}>
              <div className={`h-8 w-8 rounded-full ${currentAccentData.color} mb-2`}></div>
              <div className={`h-3 ${effectiveTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4 mb-2`}></div>
              <div className={`h-2 ${effectiveTheme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2`}></div>
            </div>
          </div>

          {/* Button Preview */}
          <div className="mt-4 flex flex-wrap gap-3">
            <button className={`px-4 py-2 ${currentAccentData.color} hover:opacity-90 text-white rounded-lg font-medium transition-opacity text-sm sm:text-base`}>
              Botão Principal
            </button>
            <button className={`px-4 py-2 border-2 ${effectiveTheme === 'dark' ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'} rounded-lg font-medium transition-colors text-sm sm:text-base`}>
              Botão Secundário
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex gap-3">
          <Palette className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Tema Aplicado Automaticamente
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
              Suas preferências são salvas e aplicadas em toda a plataforma. 
              {themeMode === 'system' && ` Atualmente usando tema ${effectiveTheme === 'dark' ? 'escuro' : 'claro'} baseado nas configurações do sistema.`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AppearanceTab
