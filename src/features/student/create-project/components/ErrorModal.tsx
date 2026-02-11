import React from 'react'
import {
    AlertTriangle,
    X,
    Copy,
    Lock,
    SearchX,
    WifiOff,
    ServerCrash,
    FileWarning,
    Users,
    Crown,
    FileCheck2,
} from 'lucide-react'
import type { ErrorModalState, ErrorCategory } from '../hooks/useErrorModal'

interface ErrorModalProps {
    error: ErrorModalState
    onClose: () => void
    onAction?: () => void
    onRetry?: () => void
}

interface ModalConfig {
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    accentColor: string
    buttonClass: string
}

const categoryConfig: Record<ErrorCategory, ModalConfig> = {
    TITULO_DUPLICADO: {
        icon: <Copy className="h-6 w-6" />,
        iconBg: 'bg-orange-100 dark:bg-orange-900/30',
        iconColor: 'text-orange-600 dark:text-orange-400',
        accentColor: 'border-orange-500',
        buttonClass: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    SEM_PERMISSAO: {
        icon: <Lock className="h-6 w-6" />,
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400',
        accentColor: 'border-red-500',
        buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
    },
    VALIDACAO_DADOS: {
        icon: <FileWarning className="h-6 w-6" />,
        iconBg: 'bg-amber-100 dark:bg-amber-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        accentColor: 'border-amber-500',
        buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    EQUIPE_INVALIDA: {
        icon: <Users className="h-6 w-6" />,
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        accentColor: 'border-blue-500',
        buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    LIDER_NAO_DEFINIDO: {
        icon: <Crown className="h-6 w-6" />,
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
        accentColor: 'border-purple-500',
        buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    TERMOS_NAO_ACEITOS: {
        icon: <FileCheck2 className="h-6 w-6" />,
        iconBg: 'bg-teal-100 dark:bg-teal-900/30',
        iconColor: 'text-teal-600 dark:text-teal-400',
        accentColor: 'border-teal-500',
        buttonClass: 'bg-teal-600 hover:bg-teal-700 text-white',
    },
    PROJETO_NAO_ENCONTRADO: {
        icon: <SearchX className="h-6 w-6" />,
        iconBg: 'bg-gray-100 dark:bg-gray-700',
        iconColor: 'text-gray-600 dark:text-gray-400',
        accentColor: 'border-gray-500',
        buttonClass: 'bg-gray-600 hover:bg-gray-700 text-white',
    },
    ERRO_REDE: {
        icon: <WifiOff className="h-6 w-6" />,
        iconBg: 'bg-rose-100 dark:bg-rose-900/30',
        iconColor: 'text-rose-600 dark:text-rose-400',
        accentColor: 'border-rose-500',
        buttonClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    ERRO_SERVIDOR: {
        icon: <ServerCrash className="h-6 w-6" />,
        iconBg: 'bg-red-100 dark:bg-red-900/30',
        iconColor: 'text-red-600 dark:text-red-400',
        accentColor: 'border-red-500',
        buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
    },
}

export default function ErrorModal({ error, onClose, onAction, onRetry }: ErrorModalProps) {
    if (!error.isOpen) return null

    const config = categoryConfig[error.category]

    const handleAction = () => {
        if (error.actionType === 'retry' && onRetry) {
            onRetry()
        } else if (error.actionType === 'navigate' && onAction) {
            onAction()
        } else {
            onClose()
        }
    }

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-t-4 ${config.accentColor} animate-in zoom-in-95 duration-200`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full ${config.iconBg}`}>
                                <span className={config.iconColor}>{config.icon}</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {error.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {error.subtitle}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pb-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {error.message}
                    </p>

                    {/* Details (e-mails inválidos, mensagens de validação, etc.) */}
                    {error.details && error.details.length > 0 && (
                        <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                            <ul className="space-y-1">
                                {error.details.map((detail, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                                    >
                                        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="break-all">{detail}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-6 flex gap-3">
                    {error.actionType !== 'close' && (
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Fechar
                        </button>
                    )}
                    <button
                        onClick={handleAction}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${config.buttonClass}`}
                    >
                        {error.actionLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
