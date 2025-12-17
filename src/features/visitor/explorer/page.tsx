import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '@/contexts/theme-context'
import { PhaseStatsCards } from '@/features/student/dashboard/components/PhaseStatsCards'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'
import ProjectFilters from '@/components/filters/ProjectFilters'
import { getProjetos } from '@/api/queries'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, FolderOpen, ChevronLeft, ChevronRight, Sun, Moon, Rocket } from 'lucide-react'
import SectionLayout from '@/features/visitor/layout/SectionLayout'
import { PageBanner } from '@/components/common/PageBanner'
import HorizontalProjectFilters from '@/components/filters/HorizontalProjectFilters'

// Helper to map API phase to number
const mapFaseToNumber = (fase: string): number => {
    const faseMap: Record<string, number> = {
        'IDEACAO': 1,
        'PLANEJAMENTO': 2,
        'EXECUCAO': 3,
        'FINALIZACAO': 4,
        'MODELAGEM': 2,
        'PROTOTIPAGEM': 3,
        'IMPLEMENTACAO': 4
    }
    return faseMap[fase] || 1
}

// Helper to transform project data
const transformarProjeto = (projeto: any) => {
    const autores = projeto.autores || []
    const lider = autores.find((a: any) => a.papel === 'LIDER') || autores[0]
    const equipe = autores.filter((a: any) => a.papel !== 'LIDER')

    // Helper para URL da imagem
    const getFullImageUrl = (url?: string) => {
        if (!url) return undefined;
        if (url.startsWith('http')) return url;
        // Se for uma URL relativa começando com /api, e estivermos em dev/prod, precisamos garantir que aponte para o backend correto
        // Assumindo que o import.meta.env.VITE_API_URL possa ser a base, OU que a raiz do site proxy corretamente.
        // Se o usuário diz que está quebrado, pode ser que o domínio da API seja diferente do frontend
        const apiUrl = import.meta.env.VITE_API_URL || 'https://vitrinesenaifeira.cloud/api';

        // Se a url já começa com /api e a apiUrl também termina com /api, removemos um /api para evitar duplicação
        // Ex: apiUrl=.../api, url=/api/uploads... -> .../api/uploads...
        const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;

        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }

    return {
        id: projeto.uuid,
        uuid: projeto.uuid,
        nome: projeto.titulo,
        descricao: projeto.descricao,
        bannerUrl: getFullImageUrl(projeto.banner_url),
        faseAtual: mapFaseToNumber(projeto.fase_atual),
        fase_atual: projeto.fase_atual,
        // Improved mapping for filters
        curso: projeto.curso || projeto.curso_nome || projeto.departamento || 'Não informado',
        categoria: projeto.categoria || projeto.departamento || 'Geral',
        liderProjeto: lider ? { nome: lider.nome, email: lider.email || '' } : null,
        equipe: equipe.map((a: any) => ({ nome: a.nome })),
        orientadores: (projeto.orientadores || []).map((o: any) => ({ nome: o.nome })),
        tecnologias: (projeto.tecnologias || []).map((t: any) => t.nome),
        criadoEm: projeto.criado_em,
        publicadoEm: projeto.data_publicacao || projeto.publicado_em || projeto.criado_em,
        repositorio_url: projeto.repositorio_url,
        demo_url: projeto.demo_url,
        isOwner: false,
        // Added props for UnifiedProject type compatibility
        autorNome: lider ? lider.nome : 'Equipe do Projeto',
        status: 'PUBLISHED',
        visualizacoes: projeto.visualizacoes || 0,
        turma: projeto.turma || '',
        atualizadoEm: projeto.atualizado_em || projeto.criado_em,
        faseId: mapFaseToNumber(projeto.fase_atual),
        orientador: projeto.orientadores?.[0]?.nome,
        itinerario: projeto.itinerario,
        participouSaga: projeto.participou_saga,
        labMaker: projeto.lab_maker
    }
}

const ExplorerPage: React.FC = () => {
    const navigate = useNavigate()
    const { effectiveTheme } = useTheme()

    // Local state for filters
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)
    const [selectedNivel, setSelectedNivel] = useState<string | null>(null)
    const [selectedCurso, setSelectedCurso] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'>('novos')

    // Pagination
    const [paginaAtual, setPaginaAtual] = useState(1)
    const itensPorPagina = 9

    // Fetch ALL projects for client-side filtering
    const { data, isLoading, error } = useQuery({
        queryKey: ['projetos-publicos-explorer'], // Removed search/page deps to cache all
        queryFn: () => getProjetos({
            limit: 1000, // Fetch all (or reasonable max)
            offset: 0
        }),
        staleTime: 60000, // Cache for 1 minute
        retry: 1
    })

    const projetosAPI = data?.projetos || []

    // Transform projects
    const projects = useMemo(() => {
        return projetosAPI.map(transformarProjeto)
    }, [projetosAPI])

    // Calculate stats based on ALL projects
    const projetosIdeacao = projects.filter(p => p.faseAtual === 1).length
    const projetosModelagem = projects.filter(p => p.faseAtual === 2).length
    const projetosPrototipagem = projects.filter(p => p.faseAtual === 3).length
    const projetosImplementacao = projects.filter(p => p.faseAtual === 4).length

    // Filter logic (Client-Side)
    const filteredProjects = useMemo(() => {
        let result = [...projects]

        // Search Term
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase()
            result = result.filter(p =>
                p.nome.toLowerCase().includes(lowerTerm) ||
                p.descricao?.toLowerCase().includes(lowerTerm)
            )
        }

        if (selectedCategoria) {
            result = result.filter(p => p.categoria === selectedCategoria)
        }

        if (selectedCurso) {
            result = result.filter(p => p.curso === selectedCurso)
        }

        if (selectedNivel) {
            const nivelNum = mapFaseToNumber(selectedNivel.toUpperCase())
            // Need to match mapped number to mapped number or string? 
            // mapFaseToNumber returns 1,2,3,4. p.faseAtual is 1,2,3,4.
            result = result.filter(p => p.faseAtual === nivelNum)
        }

        // Sort
        switch (sortOrder) {
            case 'A-Z':
                result.sort((a, b) => a.nome.localeCompare(b.nome))
                break
            case 'Z-A':
                result.sort((a, b) => b.nome.localeCompare(a.nome))
                break
            case 'novos':
                result.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime())
                break
            case 'antigos':
                result.sort((a, b) => new Date(a.criadoEm || 0).getTime() - new Date(b.criadoEm || 0).getTime())
                break
        }

        return result
    }, [projects, searchTerm, selectedCategoria, selectedCurso, selectedNivel, sortOrder])

    // Client-side Pagination
    const totalResultados = filteredProjects.length
    const totalPaginas = Math.ceil(totalResultados / itensPorPagina) || 1

    const paginatedProjects = useMemo(() => {
        const startIndex = (paginaAtual - 1) * itensPorPagina
        return filteredProjects.slice(startIndex, startIndex + itensPorPagina)
    }, [filteredProjects, paginaAtual])

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setPaginaAtual(1)
    }

    return (
        <SectionLayout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Top Banner */}
                <PageBanner
                    title="Explorar Vitrine"
                    subtitle="Navegue pelos projetos inovadores desenvolvidos no SENAI"
                    icon={<Rocket />}
                    color="blue"
                    className="pb-24" // Extra padding to allow significant overlap without hiding content
                />

                {/* Main Content Area with overlapping margin */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-20">

                    {/* Stats Cards */}
                    <div className="mb-8">
                        <PhaseStatsCards
                            projetosIdeacao={projetosIdeacao}
                            projetosModelagem={projetosModelagem}
                            projetosPrototipagem={projetosPrototipagem}
                            projetosImplementacao={projetosImplementacao}
                        />
                    </div>

                    {/* Horizontal Filters */}
                    <HorizontalProjectFilters
                        searchTerm={searchTerm}
                        setSearchTerm={handleSearchChange}
                        selectedCurso={selectedCurso}
                        setSelectedCurso={setSelectedCurso}
                        selectedCategoria={selectedCategoria}
                        setSelectedCategoria={setSelectedCategoria}
                        selectedNivel={selectedNivel}
                        setSelectedNivel={setSelectedNivel}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        totalResults={totalResultados}
                    />

                    {/* Project Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                            ))}
                        </div>
                    ) : paginatedProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedProjects.map((projeto) => (
                                <UnifiedProjectCard
                                    key={projeto.id}
                                    project={projeto}
                                    isGuest={true}
                                    onClick={() => navigate(`/vitrine/${projeto.uuid}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full inline-block mb-4">
                                <AlertCircle className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Nenhum projeto encontrado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                Tente ajustar seus filtros ou realizar uma nova busca.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPaginas > 1 && (
                        <div className="mt-8 flex justify-center gap-2">
                            <button
                                onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                                disabled={paginaAtual === 1}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="flex items-center px-4 font-medium text-gray-700 dark:text-gray-300">
                                Página {paginaAtual} de {totalPaginas}
                            </span>
                            <button
                                onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                                disabled={paginaAtual === totalPaginas}
                                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </SectionLayout>
    )
}

export default ExplorerPage
