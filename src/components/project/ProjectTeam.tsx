import React from 'react'
import {
    Users,
    User,
    Crown,
    Mail,
    Award
} from 'lucide-react'

export interface TeamMember {
    nome: string
    email: string
    papel: string // 'LIDER' | 'AUTOR' | etc.
    usuario_uuid?: string
}

export interface Advisor {
    nome: string
    email: string
}

interface ProjectTeamProps {
    autores?: TeamMember[]
    orientadores?: Advisor[]
    showContactInfo?: boolean
    showEmail?: boolean
}

export const ProjectTeam: React.FC<ProjectTeamProps> = ({
    autores = [],
    orientadores = [],
    showContactInfo = false,
    showEmail = true
}) => {

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white text-shadow-sm">Equipe do Projeto</h2>
                        <p className="text-green-100 text-sm mt-1 font-medium">
                            {autores.length} membros no total
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Autores */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Autores</h3>
                        </div>

                        <div className="space-y-4">
                            {autores.map((autor, idx) => {
                                const isLider = autor.papel === 'LIDER';

                                return (
                                    <div key={idx} className={`flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl border shadow-sm relative overflow-hidden group ${isLider
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
                                        : 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors'
                                        }`}>
                                        {isLider && (
                                            <div className="absolute right-0 top-0 p-2 bg-yellow-400 text-yellow-900 rounded-bl-xl shadow-sm z-10">
                                                <Crown className="w-3 h-3" />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className={`${isLider ? 'w-12 h-12' : 'w-10 h-10'} rounded-full ${isLider
                                                ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-white dark:border-gray-700'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                                } flex items-center justify-center text-white font-bold ${isLider ? 'text-lg' : 'text-sm'} shadow-md flex-shrink-0`}>
                                                {autor.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`${isLider ? 'text-base' : 'text-sm'} font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate`}>
                                                    {autor.nome}
                                                </p>
                                                {showEmail && (
                                                    <p className={`${isLider ? 'text-sm' : 'text-xs'} text-gray-600 dark:text-gray-400 truncate`}>{autor.email}</p>
                                                )}
                                                {isLider && (
                                                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1 block">Líder do Projeto</span>
                                                )}
                                            </div>
                                        </div>

                                        {showContactInfo && isLider && (
                                            <a
                                                href={`mailto:${autor.email}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl font-bold shadow-sm border border-blue-100 dark:border-blue-900 hover:scale-105 transition-transform whitespace-nowrap"
                                            >
                                                <Mail className="w-4 h-4" />
                                                <span>Falar com o Líder</span>
                                            </a>
                                        )}

                                        {showContactInfo && !isLider && autor.email && (
                                            <a
                                                href={`mailto:${autor.email}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl font-bold shadow-sm border border-blue-100 dark:border-blue-900 hover:scale-105 transition-transform whitespace-nowrap"
                                            >
                                                <Mail className="w-4 h-4" />
                                                <span>Email</span>
                                            </a>
                                        )}

                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Orientadores */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <Award className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Orientação</h3>
                        </div>

                        <div className="space-y-4">
                            {orientadores.length > 0 ? (
                                orientadores.map((orientador, idx) => (
                                    <div key={idx} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-200 dark:border-purple-800">
                                        <div className="flex items-center gap-4 w-full md:w-auto">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white dark:border-gray-700 flex-shrink-0">
                                                {orientador.nome.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-base font-bold text-gray-900 dark:text-white truncate">{orientador.nome}</p>
                                                <p className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest mt-1 block">Docente Orientador(a)</p>
                                                {showEmail && orientador.email && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{orientador.email}</p>}
                                            </div>
                                        </div>

                                        {showContactInfo && orientador.email && (
                                            <a
                                                href={`mailto:${orientador.email}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-xl font-bold shadow-sm border border-purple-100 dark:border-purple-900 hover:scale-105 transition-transform whitespace-nowrap"
                                            >
                                                <Mail className="w-4 h-4" />
                                                <span>Contato</span>
                                            </a>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-center border-dashed border-2 border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500">Orientador não informado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
