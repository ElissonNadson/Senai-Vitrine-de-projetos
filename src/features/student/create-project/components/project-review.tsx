import React, { useMemo } from 'react'
import {
  CheckCircle,
  Edit2,
  Save,
  Loader2,
  Lightbulb,
  GraduationCap,
  Layers,
  Github,
  ExternalLink,
  Shield,
  Eye,
  Sparkles,
  BookOpen,
  Wrench,
  Award,
  Clock,
  Check
} from 'lucide-react'
import { motion } from 'framer-motion'

import { useTheme } from '@/contexts/theme-context'
import { ProjectBanner } from '@/components/project/ProjectBanner'
import { ProjectTeam } from '@/components/project/ProjectTeam'
import ProjectTimeline from '@/components/project-timeline'
import {
  adaptBannerUrl,
  adaptTeamMembers,
  adaptAdvisors,
  adaptPhases,
  type ReviewFormData
} from '../utils/review-data-adapter'

export type SectionType = 'details' | 'academic' | 'team' | 'phases' | 'code'

interface ProjectReviewProps {
  data: ReviewFormData
  onBackToEdit: () => void
  onSaveAndPublish: () => void
  onSaveDraft?: () => void
  isSubmitting?: boolean
  isSavingDraft?: boolean
  isEditMode?: boolean
  isEditing?: boolean
  onInputChange?: (field: keyof ReviewFormData, value: any) => void
  onEditSection?: (section: SectionType) => void
  hideActionBanner?: boolean
  submitLabel?: string
  savingLabel?: string
}

const ProjectReview: React.FC<ProjectReviewProps> = ({
  data,
  onBackToEdit,
  onSaveAndPublish,
  onSaveDraft,
  isSubmitting = false,
  isSavingDraft = false,
  submitLabel,
  savingLabel,
}) => {
  const { accentColor } = useTheme()

  // Adaptar dados do formulário para os componentes compartilhados
  const bannerUrl = useMemo(() => adaptBannerUrl(data), [data.banner, data.bannerUrl])
  const teamMembers = useMemo(() => adaptTeamMembers(data), [data.autores, data.liderEmail, data.autoresMetadata])
  const advisors = useMemo(() => adaptAdvisors(data), [data.orientador, data.orientadoresMetadata])
  const { phases, currentPhaseId } = useMemo(() => adaptPhases(data), [data.ideacao, data.modelagem, data.prototipagem, data.implementacao])

  // Encontrar o líder para exibir no banner
  const liderMember = teamMembers.find(m => m.papel === 'LIDER')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
      {/* Header Fixo */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <Edit2 className="w-5 h-5" />
            </div>
            <span className="font-semibold text-sm">Voltar para Edição</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              data.status === 'PUBLICADO'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              {data.status === 'PUBLICADO' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {data.status === 'PUBLICADO' ? 'Publicado' : 'Revisão Final'}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Hero Section - ProjectBanner */}
        <ProjectBanner.Root
          bannerUrl={bannerUrl}
          accentColor={accentColor}
        >
          <ProjectBanner.Overlay>
            <div className="flex flex-col justify-end h-full">
              <ProjectBanner.Title>
                {data.titulo || 'Sem título'}
              </ProjectBanner.Title>
              {liderMember && (
                <ProjectBanner.Leader
                  name={liderMember.nome}
                />
              )}
            </div>
          </ProjectBanner.Overlay>
        </ProjectBanner.Root>

        {/* Sobre o Projeto + Informações Acadêmicas - Grid lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sobre o Projeto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-sm">Sobre o Projeto</h2>
            </div>

            <div className="p-6">
              <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl border-2 border-blue-100 dark:border-blue-800 overflow-hidden">
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line text-sm break-words text-justify overflow-hidden">
                  {data.descricao || 'Sem descrição disponível.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Informações Acadêmicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 p-6 flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white text-shadow-sm">Informações Acadêmicas</h2>
            </div>

            <div className="p-6">
              {/* Grid de Informações */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {data.curso && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Curso</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={data.curso}>{data.curso}</p>
                  </div>
                )}
                {data.turma && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Turma</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{data.turma}</p>
                  </div>
                )}
                {data.categoria && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Categoria</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={data.categoria}>{data.categoria}</p>
                  </div>
                )}
                {data.unidadeCurricular && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                    <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Unidade Curricular</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate" title={data.unidadeCurricular}>{data.unidadeCurricular}</p>
                  </div>
                )}
              </div>

              {/* Tags de Participação */}
              <div className="flex flex-wrap gap-2">
                {data.itinerario === 'Sim' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-bold text-xs border border-blue-200 dark:border-blue-800">
                    <BookOpen className="w-3.5 h-3.5" />
                    Itinerário
                  </div>
                )}
                {data.senaiLab === 'Sim' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-bold text-xs border border-purple-200 dark:border-purple-800">
                    <Wrench className="w-3.5 h-3.5" />
                    SENAI Lab
                  </div>
                )}
                {data.sagaSenai === 'Sim' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-bold text-xs border border-yellow-200 dark:border-yellow-800">
                    <Award className="w-3.5 h-3.5" />
                    SAGA SENAI
                  </div>
                )}
                {data.participouEdital === 'Sim' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full font-bold text-xs border border-amber-200 dark:border-amber-800">
                    <Award className="w-3.5 h-3.5" />
                    Edital
                  </div>
                )}
                {data.ganhouPremio === 'Sim' && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-bold text-xs border border-yellow-200 dark:border-yellow-800">
                    <Award className="w-3.5 h-3.5" />
                    Prêmio
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Equipe do Projeto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProjectTeam
            autores={teamMembers}
            orientadores={advisors}
            showContactInfo={false}
            showEmail={true}
          />
        </motion.div>

        {/* Etapas do Projeto - Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shadow-md">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white text-shadow-sm">Linha do Tempo</h2>
                <p className="text-orange-100 text-sm">Progresso detalhado do projeto</p>
              </div>
            </div>
          </div>

          <div className="p-8 relative min-h-[400px]">
            <ProjectTimeline
              phases={phases}
              currentPhaseId={currentPhaseId}
              isGuest={false}
              isReview={true}
              visibilidadeAnexos={data.anexosVisibilidade === 'Privado' ? 'privado' : 'publico'}
              allowDownload={true}
            />
          </div>
        </motion.div>

        {/* Repositório e Privacidade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Github className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white flex-1">
                Repositório e Privacidade
              </h2>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Repositório GitHub */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Github className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Repositório do Projeto
                  </h3>
                </div>

                {data.hasRepositorio && data.linkRepositorio ? (
                  <a
                    href={data.linkRepositorio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-300 dark:border-green-700 hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform">
                        <Github className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">Repositório GitHub</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white break-all hover:underline flex items-center gap-2">
                          {data.linkRepositorio}
                          <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        </p>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="p-8 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center flex flex-col items-center justify-center gap-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Github className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhum repositório vinculado
                    </p>
                  </div>
                )}
              </div>

              {/* Configurações de Privacidade */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Privacidade do Projeto
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                    <div className="flex items-center gap-3 mb-2">
                      <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Visibilidade dos Anexos</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {data.anexosVisibilidade || 'Não informado'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Define quem pode visualizar os documentos e anexos do projeto
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                        Suas configurações de privacidade garantem que apenas as pessoas autorizadas possam acessar o conteúdo do projeto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Barra de Ação Sticky - Full Width */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 shadow-2xl border-t-2 border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  {submitLabel ? 'Pronto para Salvar?' : 'Tudo Pronto para Publicar!'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {submitLabel
                    ? 'Revise as informações acima e salve as alterações do seu projeto'
                    : 'Revise as informações acima e publique seu projeto na Vitrine SENAI'
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Editar Projeto */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToEdit}
                  className="w-full sm:w-auto px-5 py-3 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold rounded-xl transition-all border-2 border-white/30 shadow-lg"
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Edit2 className="w-5 h-5" />
                    Editar Projeto
                  </div>
                </motion.button>

                {/* Salvar Rascunho */}
                {onSaveDraft && (
                  <motion.button
                    whileHover={{ scale: isSavingDraft ? 1 : 1.05 }}
                    whileTap={{ scale: isSavingDraft ? 1 : 0.95 }}
                    onClick={onSaveDraft}
                    disabled={isSavingDraft || isSubmitting}
                    className={`w-full sm:w-auto px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg border-2 border-blue-400 transition-all ${
                      isSavingDraft || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      {isSavingDraft ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Salvar Rascunho
                        </>
                      )}
                    </div>
                  </motion.button>
                )}

                {/* Salvar e Publicar */}
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  onClick={onSaveAndPublish}
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-2xl transition-all border-2 border-green-400 ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        {savingLabel || 'Publicando...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {submitLabel || 'Salvar e Publicar'}
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectReview
