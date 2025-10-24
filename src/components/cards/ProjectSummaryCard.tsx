import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  Users,
  GraduationCap,
  Lightbulb,
  FileText,
  Wrench,
  Rocket,
  Code,
  BookOpen,
  MapPin,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Lock,
  Globe,
  Award,
  Layers,
  Clock
} from 'lucide-react'
import { Projeto } from '@/types/types-queries'
import { useNavigate } from 'react-router-dom'
import RatingDisplay from '@/components/RatingDisplay'

interface ProjectSummaryCardProps {
  project: Projeto
  onEdit?: (projectId: string) => void
  onDelete?: (projectId: string) => void
  onAddStage?: (projectId: string) => void
}

const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  project,
  onEdit,
  onDelete,
  onAddStage
}) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Determinar fase do projeto
  const getProjectPhase = () => {
    // Lógica simplificada - você pode melhorar com base nas etapas reais
    const phases = [
      { 
        name: 'Ideação', 
        icon: Lightbulb, 
        color: 'yellow',
        gradient: 'from-yellow-400 to-amber-500',
        bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        darkBg: 'dark:from-yellow-900/20 dark:to-amber-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        badge: 'bg-yellow-500'
      },
      { 
        name: 'Modelagem', 
        icon: FileText, 
        color: 'blue',
        gradient: 'from-blue-500 to-indigo-600',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        darkBg: 'dark:from-blue-900/20 dark:to-indigo-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        badge: 'bg-blue-500'
      },
      { 
        name: 'Prototipagem', 
        icon: Wrench, 
        color: 'purple',
        gradient: 'from-purple-500 to-pink-600',
        bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
        darkBg: 'dark:from-purple-900/20 dark:to-pink-900/20',
        border: 'border-purple-200 dark:border-purple-800',
        badge: 'bg-purple-500'
      },
      { 
        name: 'Implementação', 
        icon: Rocket, 
        color: 'green',
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        darkBg: 'dark:from-green-900/20 dark:to-emerald-900/20',
        border: 'border-green-200 dark:border-green-800',
        badge: 'bg-green-500'
      }
    ]
    
    // Retorna primeira fase por padrão - você pode implementar lógica mais complexa
    return phases[0]
  }

  const phase = getProjectPhase()
  const PhaseIcon = phase.icon

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project.uuid)
    } else {
      navigate(`/app/edit-project/${project.uuid}`)
    }
  }

  const handleAddStage = () => {
    if (onAddStage) {
      onAddStage(project.uuid)
    } else {
      navigate(`/app/projects/${project.uuid}/add-stage`)
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(project.uuid)
    }
    setShowDeleteConfirm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative overflow-hidden rounded-3xl shadow-xl border-2 ${phase.border} ${phase.bg} ${phase.darkBg} transition-all duration-300 hover:shadow-2xl`}
      >
        {/* Banner do Projeto */}
        {project.bannerUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={project.bannerUrl}
              alt={project.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Badge da Fase */}
            <div className="absolute top-4 right-4">
              <div className={`flex items-center gap-2 px-4 py-2 ${phase.badge} text-white rounded-full shadow-lg backdrop-blur-sm`}>
                <PhaseIcon className="w-4 h-4" />
                <span className="font-bold text-sm">{phase.name}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                <div className={`w-2 h-2 rounded-full ${project.status === 'ativo' ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
                <span className="text-xs font-semibold text-gray-900 dark:text-white capitalize">{project.status}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cabeçalho sem Banner */}
        {!project.bannerUrl && (
          <div className="relative p-6 pb-0">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 bg-gradient-to-br ${phase.gradient} rounded-2xl shadow-xl`}>
                <PhaseIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 ${phase.badge} text-white rounded-full shadow-lg`}>
                  <PhaseIcon className="w-4 h-4" />
                  <span className="font-bold text-sm">{phase.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="p-6">
          {/* Título e Descrição */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {project.titulo}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {project.descricao}
            </p>

            {/* Rating (lâmpadas) */}
            <div className="mt-3">
              <RatingDisplay projectId={project.uuid} />
            </div>
          </div>

          {/* Informações Rápidas - Grid 2x2 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Curso */}
            <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Curso</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {project.curso}
                </p>
              </div>
            </div>

            {/* Turma */}
            <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Turma</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {project.turma}
                </p>
              </div>
            </div>

            {/* Categoria */}
            <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Categoria</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {project.categoria}
                </p>
              </div>
            </div>

            {/* Modalidade */}
            <div className="flex items-center gap-2 p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400">Modalidade</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {project.modalidade}
                </p>
              </div>
            </div>
          </div>

          {/* Badges de Programas */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.itinerario && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                Itinerário
              </div>
            )}
            {project.labMaker && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                <Wrench className="w-3.5 h-3.5" />
                SENAI Lab
              </div>
            )}
            {project.participouSaga && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                SAGA SENAI
              </div>
            )}
          </div>

          {/* Botão Expandir/Recolher */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-2 py-3 mb-4 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {isExpanded ? 'Ver Menos' : 'Ver Mais Detalhes'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Seção Expandível */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  {/* Unidade Curricular */}
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Unidade Curricular</h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                      {project.unidadeCurricular?.nome || 'Não informado'}
                    </p>
                    {project.unidadeCurricular?.descricao && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {project.unidadeCurricular.descricao}
                      </p>
                    )}
                    {project.unidadeCurricular?.cargaHoraria && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {project.unidadeCurricular.cargaHoraria}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Líder do Projeto */}
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Líder do Projeto</h4>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold">
                      {project.liderProjeto?.usuarios?.usuario || 'Não informado'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {project.liderProjeto?.usuarios?.email}
                    </p>
                    {project.liderProjeto?.matricula && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Matrícula: {project.liderProjeto.matricula}
                      </p>
                    )}
                  </div>

                  {/* Código e Visibilidade */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">Código</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.visibilidadeCodigo === 'publico' ? (
                          <Globe className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-gray-600" />
                        )}
                        <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                          {project.visibilidadeCodigo}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">Anexos</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.visibilidadeAnexos === 'publico' ? (
                          <Globe className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-gray-600" />
                        )}
                        <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                          {project.visibilidadeAnexos}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Datas */}
                  <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Timeline</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Criado em:</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.criadoEm)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Atualizado em:</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {formatDate(project.atualizadoEm)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ações Principais */}
          <div className="flex gap-3 mt-6">
            {/* Editar Projeto */}
            <button
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Edit className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span>Editar</span>
            </button>

            {/* Adicionar Etapa */}
            <button
              onClick={handleAddStage}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              <span>Nova Etapa</span>
            </button>

            {/* Excluir */}
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>

          {/* Link para Ver Detalhes Completos */}
          <button
            onClick={() => navigate(`/app/projects/${project.uuid}`)}
            className="w-full flex items-center justify-center gap-2 mt-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            Ver página completa do projeto
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Modal de Confirmação de Exclusão */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Excluir Projeto</h3>
                    <p className="text-white/90 text-sm">Esta ação não pode ser desfeita</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Tem certeza que deseja excluir o projeto{' '}
                  <strong className="text-gray-900 dark:text-white">"{project.titulo}"</strong>?
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Todos os dados, etapas e anexos serão permanentemente removidos.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-6 pt-0">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sim, Excluir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProjectSummaryCard
