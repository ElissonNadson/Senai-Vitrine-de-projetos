import React, { useState, useEffect, useRef } from 'react'
import { Search, Loader2, User, GraduationCap, Plus, Mail } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { buscarUsuariosAPI, resolverUsuarios } from '../../../../api/projetos'
import { motion, AnimatePresence } from 'framer-motion'

import { Modal } from 'antd'

interface UserSearchInputProps {
    placeholder: string
    onSelect: (user: any) => void
    excludeEmails?: string[]
    type: 'ALUNO' | 'PROFESSOR'
}

export const UserSearchInput: React.FC<UserSearchInputProps> = ({
    placeholder,
    onSelect,
    excludeEmails = [],
    type
}) => {
    const [modal, contextHolder] = Modal.useModal()
    const [searchTerm, setSearchTerm] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const { data: users, isLoading } = useQuery({
        queryKey: ['users', searchTerm],
        queryFn: () => buscarUsuariosAPI(searchTerm),
        enabled: searchTerm.length >= 3,
        staleTime: 1000 * 60, // 1 minute
    })

    const filteredUsers = users?.filter(u =>
        u.tipo === type && !excludeEmails.includes(u.email)
    ) || []

    // Validar e Adicionar
    const [isValidating, setIsValidating] = useState(false)

    const handleManualAdd = async () => {
        if (!searchTerm || !searchTerm.includes('@')) return

        setIsValidating(true)
        try {
            // Verificar se usuário existe usando resolverUsuarios
            // O resolverUsuarios aceita array de emails e retorna { alunos: [], professores: [], invalidos: [] }
            // Precisamos importar resolverUsuarios do arquivo de API ou usar a mutation via props se fosse o caso,
            // mas aqui vamos usar a função direta da API para ser mais simples dentro do componente, ou melhor,
            // vamos expor uma prop `onValidate` opcional, mas para resolver rápido vamos usar a API direta.

            // Oops, I can't easily use hooks inside the event handler if I didn't set them up.
            // But I can fetch directly.
            // Let's import { resolverUsuarios } from '../../../../api/projetos'

            // Wait, `resolverUsuarios` is imported in `page.tsx` hooks, let's see imports here.
            // I need to add import { resolverUsuarios } from '../../../../api/projetos'

            // Actually, to be clean, let's just attempt to resolve it.
            // But `resolverUsuarios` requires a token usually? AxiosInstance handles it.

            const result = await resolverUsuarios([searchTerm])

            let foundUser = null
            if (type === 'ALUNO') {
                foundUser = result.alunos.find(a => a.email === searchTerm)
            } else {
                foundUser = result.professores.find(p => p.email === searchTerm)
            }

            if (foundUser) {
                onSelect(foundUser)
                setSearchTerm('')
                setIsOpen(false)
            } else {
                modal.warning({
                    title: 'Usuário não encontrado',
                    content: (
                        <div>
                            <p>Não encontramos nenhum <strong>{type === 'ALUNO' ? 'Aluno' : 'Professor'}</strong> com o e-mail:</p>
                            <p className="text-blue-600 font-medium mt-1">{searchTerm}</p>
                            <p className="text-gray-500 text-xs mt-3">Verifique se o e-mail está correto ou peça para ele se cadastrar na plataforma.</p>
                        </div>
                    ),
                    okText: 'Entendi',
                    centered: true,
                    maskClosable: true,
                })
            }

        } catch (error) {
            console.error('Erro ao validar usuário:', error)
            modal.error({
                title: 'Erro na validação',
                content: 'Ocorreu um erro ao verificar o usuário. Tente novamente.',
            })
        } finally {
            setIsValidating(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchTerm.includes('@')) {
            handleManualAdd()
        }
    }

    return (
        <div className="relative" ref={wrapperRef}>
            {contextHolder}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setIsOpen(true)
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsOpen(true)}
                        placeholder={placeholder}
                        className="w-full border-2 rounded-xl pl-10 pr-4 py-3 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    />
                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                    {(isLoading || isValidating) && (
                        <div className="absolute right-3 top-3.5">
                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                        </div>
                    )}
                </div>

                {/* Manual Add Button */}
                <button
                    onClick={() => searchTerm && handleManualAdd()}
                    disabled={!searchTerm || isValidating}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Adicionar</span>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && searchTerm.length >= 3 && filteredUsers && !isValidating && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-64 overflow-y-auto"
                    >
                        {filteredUsers.length > 0 ? (
                            <ul className="py-2">
                                {filteredUsers.map((user: any) => (
                                    <li
                                        key={user.uuid || user.email}
                                        onClick={() => {
                                            onSelect(user)
                                            setSearchTerm('')
                                            setIsOpen(false)
                                        }}
                                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 dark:border-gray-700"
                                    >
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.nome} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${type === 'ALUNO' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {type === 'ALUNO' ? <User className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.nome}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                <p>Nenhum usuário encontrado na busca.</p>
                                <p className="text-xs mt-1">Para adicionar manualmente, digite o e-mail completo e clique em "Adicionar". O sistema irá verificar se ela existe.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
