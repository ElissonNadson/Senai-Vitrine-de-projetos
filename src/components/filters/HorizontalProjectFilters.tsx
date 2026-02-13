import React from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'

interface HorizontalProjectFiltersProps {
    searchTerm: string
    setSearchTerm: (value: string) => void
    selectedCurso: string | null
    setSelectedCurso: (value: string | null) => void
    selectedCategoria: string | null
    setSelectedCategoria: (value: string | null) => void
    selectedNivel: string | null
    setSelectedNivel: (value: string | null) => void
    selectedStatusFase?: string | null
    setSelectedStatusFase?: (value: string | null) => void
    apenasFaseAtual?: boolean
    setApenasFaseAtual?: (value: boolean) => void
    selectedDestaque?: string | null
    setSelectedDestaque?: (value: string | null) => void
    sortOrder: 'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'
    setSortOrder: (value: 'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos') => void
    totalResults: number
}

const destaquesDisponiveis = ['Itinerário', 'SENAI Lab', 'SAGA SENAI', 'Edital', 'Prêmio']

// Listas de opções (mesmas de ProjectFilters)
const cursosDisponiveis = [
    'Técnico em Administração', 'Técnico em Biotecnologia', 'Técnico em Desenvolvimento de Sistemas', 'Técnico em Eletromecânica',
    'Técnico em Eletrotécnica', 'Técnico em Logística', 'Técnico em Manutenção Automotiva', 'Técnico em Mecânica', 'Técnico em Química', 'Técnico em Segurança do Trabalho'
]

const categoriasDisponiveis = [
    'Aplicativo / Site', 'Automação de Processos', 'Bioprodutos', 'Chatbots e Automação Digital',
    'Dashboards e Análises de Dados', 'Economia Circular', 'Educação', 'E-commerce e Marketplace',
    'Eficiência Energética', 'Impressão 3D', 'Impacto Social', 'IoT', 'Manufatura Inteligente',
    'Modelo de Negócio', 'Sistemas de Gestão (ERP, CRM, etc.)', 'Sustentabilidade e Meio Ambiente',
    'Tecnologias Assistivas e Acessibilidade', 'Outro'
]

const niveisDisponiveis = ['Ideação', 'Modelagem', 'Prototipagem', 'Implementação']
const statusFaseDisponiveis = ['Pendente', 'Em andamento', 'Concluído']

const HorizontalProjectFilters: React.FC<HorizontalProjectFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    selectedCurso,
    setSelectedCurso,
    selectedCategoria,
    setSelectedCategoria,
    selectedNivel,
    setSelectedNivel,
    selectedStatusFase,
    setSelectedStatusFase,
    apenasFaseAtual = false,
    setApenasFaseAtual,
    selectedDestaque,
    setSelectedDestaque,
    sortOrder,
    setSortOrder,
    totalResults
}) => {

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCurso(null)
        setSelectedCategoria(null)
        setSelectedNivel(null)
        if (setSelectedStatusFase) setSelectedStatusFase(null)
        if (setSelectedDestaque) setSelectedDestaque(null)
        setSortOrder('novos')
    }

    const hasFilters = searchTerm || selectedCurso || selectedCategoria || selectedNivel || selectedStatusFase || selectedDestaque

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col gap-4">

                {/* Top Row: Search and Stats */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Buscar projetos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <span className="font-semibold text-gray-900 dark:text-white">{totalResults}</span> projetos encontrados
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="ml-2 flex items-center gap-1 text-red-600 hover:text-red-700 font-medium text-xs bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md transition-colors"
                            >
                                <X className="w-3 h-3" /> Limpar filtros
                            </button>
                        )}
                    </div>
                </div>

                <div className="h-px bg-gray-200 dark:bg-gray-700" />

                {/* Bottom Row: Dropdowns */}
                <div className={`flex flex-wrap items-center gap-3 ${selectedNivel ? 'justify-center' : ''}`}>
                    {/* Curso Selector */}
                    <div className={`relative w-full sm:w-auto flex-1 ${selectedNivel ? 'min-w-[200px] max-w-[280px]' : ''}`}>
                        <select
                            value={selectedCurso || ''}
                            onChange={(e) => setSelectedCurso(e.target.value || null)}
                            className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="">Todos os Cursos</option>
                            {cursosDisponiveis.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Categoria Selector */}
                    <div className={`relative w-full sm:w-auto flex-1 ${selectedNivel ? 'min-w-[160px] max-w-[200px]' : ''}`}>
                        <select
                            value={selectedCategoria || ''}
                            onChange={(e) => setSelectedCategoria(e.target.value || null)}
                            className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="">Todas as Categorias</option>
                            {categoriasDisponiveis.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Container agrupado para Fase, Status e Checkbox - Só aparece quando uma fase está selecionada */}
                    {selectedNivel && setSelectedStatusFase ? (
                        <div className="flex items-center gap-2 p-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 flex-1">
                            {/* Nível Selector */}
                            <div className="relative flex-1 min-w-[140px] max-w-[140px]">
                                <select
                                    value={selectedNivel || ''}
                                    onChange={(e) => {
                                        setSelectedNivel(e.target.value || null)
                                        // Limpar status da fase quando mudar a fase selecionada
                                        if (setSelectedStatusFase) setSelectedStatusFase(null)
                                    }}
                                    className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                >
                                    <option value="">Todas as Fases</option>
                                    {niveisDisponiveis.map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Status da Fase Selector */}
                            <div className="relative flex-1 min-w-[180px] max-w-[200px]">
                                <select
                                    value={selectedStatusFase || ''}
                                    onChange={(e) => setSelectedStatusFase(e.target.value || null)}
                                    className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                                >
                                    <option value="">Todos os Status da fase</option>
                                    {statusFaseDisponiveis
                                        .filter(s => selectedNivel !== 'Ideação' || s !== 'Pendente')
                                        .map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Checkbox "Apenas fase atual" */}
                            {setApenasFaseAtual && (
                                <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors whitespace-nowrap flex-shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={apenasFaseAtual}
                                        onChange={(e) => setApenasFaseAtual(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-xs">Apenas fase atual</span>
                                </label>
                            )}
                        </div>
                    ) : (
                        /* Nível Selector - Mostra quando não há fase selecionada */
                        <div className={`relative w-full sm:w-auto flex-1`}>
                            <select
                                value={selectedNivel || ''}
                                onChange={(e) => {
                                    setSelectedNivel(e.target.value || null)
                                    // Limpar status da fase quando mudar a fase selecionada
                                    if (setSelectedStatusFase) setSelectedStatusFase(null)
                                }}
                                className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="">Todas as Fases</option>
                                {niveisDisponiveis.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    )}

                    {/* Destaque Selector (Optional) */}
                    {setSelectedDestaque && (
                        <div className={`relative w-full sm:w-auto flex-1 ${selectedNivel ? 'min-w-[160px] max-w-[160px]' : ''}`}>
                            <select
                                value={selectedDestaque || ''}
                                onChange={(e) => setSelectedDestaque(e.target.value || null)}
                                className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                <option value="">Todos os Destaques</option>
                                {destaquesDisponiveis.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    )}

                    {/* Ordenação Selector */}
                    <div className={`relative w-full sm:w-auto flex-1 ${selectedNivel ? 'min-w-[130px] max-w-[130px]' : ''}`}>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as any)}
                            className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                        >
                            <option value="novos">Mais Recentes</option>
                            <option value="antigos">Mais Antigos</option>
                            <option value="mais-vistos">Mais Vistos</option>
                            <option value="A-Z">A-Z</option>
                            <option value="Z-A">Z-A</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HorizontalProjectFilters
