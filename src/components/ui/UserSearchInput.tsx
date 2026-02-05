import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, User, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/services/axios-instance'

export interface UserOption {
    uuid: string
    nome: string
    email: string
    avatar_url?: string
    tipo: 'ALUNO' | 'PROFESSOR' | 'DOCENTE'
}

interface UserSearchInputProps {
    onSelect: (user: UserOption) => void
    placeholder?: string
    typeFilter?: 'ALUNO' | 'PROFESSOR' | 'DOCENTE'
    excludeEmails?: string[]
}

export const UserSearchInput: React.FC<UserSearchInputProps> = ({
    onSelect,
    placeholder = 'Buscar por nome ou e-mail',
    typeFilter,
    excludeEmails = []
}) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [results, setResults] = useState<UserOption[]>([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length >= 3) {
                setLoading(true)
                try {
                    const params = new URLSearchParams()
                    params.append('q', searchTerm)
                    if (typeFilter) params.append('tipo', typeFilter)

                    const response = await api.get(`/perfil/pesquisar?${params.toString()}`)
                    setResults(response.data.filter((u: UserOption) => !excludeEmails.includes(u.email)))
                    setShowResults(true)
                } catch (error) {
                    console.error('Erro ao buscar usuários:', error)
                    setResults([])
                } finally {
                    setLoading(false)
                }
            } else {
                setResults([])
                setShowResults(false)
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, typeFilter, excludeEmails])

    const handleSelect = (user: UserOption) => {
        onSelect(user)
        setSearchTerm('')
        setShowResults(false)
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-900 dark:text-white placeholder-gray-400"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Search className="w-5 h-5" />
                    )}
                </div>
                {searchTerm && (
                    <button
                        onClick={() => {
                            setSearchTerm('')
                            setResults([])
                            setShowResults(false)
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-60 overflow-y-auto"
                    >
                        {results.length > 0 ? (
                            <ul>
                                {results.map((user) => (
                                    <li key={user.uuid}>
                                        <button
                                            onClick={() => handleSelect(user)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                                        >
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.nome}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {user.nome}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${user.tipo === 'PROFESSOR'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                }`}>
                                                {user.tipo === 'PROFESSOR' ? 'PROF' : 'ALUNO'}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                                Nenhum usuário encontrado
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
