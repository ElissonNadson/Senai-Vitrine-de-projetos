import React, { useState } from 'react'
import { CheckCircle, Edit2, User, FileText, Lightbulb, Code, Eye, Award, Calendar, Tag, Users, GraduationCap, Layers, Sparkles, Shield, Github, ExternalLink, Download, Save, Copy, Check, Image as ImageIcon, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { useTheme, AccentColor } from '@/contexts/theme-context'
import UnifiedProjectCard from '@/components/cards/UnifiedProjectCard'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

interface ProjectReviewData {
  status?: string // Add status support
  curso: string
  turma: string
  itinerario: string
  unidadeCurricular: string
  senaiLab: string
  sagaSenai: string
  titulo: string
  descricao: string
  categoria: string
  modalidade: string
  autores: string[]
  orientador: string
  liderEmail: string
  isLeader: boolean
  banner?: File | null
  bannerUrl?: string
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  codigo?: File | null
  linkRepositorio: string
  hasRepositorio: boolean
  codigoVisibilidade: string
  anexosVisibilidade: string
}

export type SectionType = 'details' | 'academic' | 'team' | 'phases' | 'code'

interface ProjectReviewProps {
  data: ProjectReviewData
  onBackToEdit: () => void
  onSaveAndPublish: () => void
  onSaveDraft?: () => void
  isSubmitting?: boolean
  isSavingDraft?: boolean
  isEditMode?: boolean // This seems to be the old modal edit trigger
  isEditing?: boolean // New global edit mode
  onInputChange?: (field: keyof ProjectReviewData, value: any) => void
  onEditSection?: (section: SectionType) => void
  hideActionBanner?: boolean
}

const EditableField = ({
  label,
  value,
  isEditing,
  onChange,
  multiline = false,
  className = "",
  disabled = false,
  options // New prop for dropdown options
}: {
  label?: string
  value: string
  isEditing?: boolean
  onChange?: (val: string) => void
  multiline?: boolean
  className?: string
  disabled?: boolean
  options?: string[]
}) => {
  if (!isEditing) return <p className={`font-medium text-gray-900 dark:text-gray-100 ${className}`}>{value || '-'}</p>

  const baseClasses = "w-full rounded-lg border text-sm text-gray-900 dark:text-gray-100 transition-colors bg-white dark:bg-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
  const borderClasses = "border-gray-300 dark:border-gray-600 focus:border-blue-500"

  if (options && options.length > 0) {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={`${baseClasses} ${borderClasses} px-3 py-2 appearance-none ${className}`}
        >
          <option value="" disabled>Selecione uma opção</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    )
  }

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={`${baseClasses} ${borderClasses} min-h-[100px] px-3 py-2 ${className}`}
        disabled={disabled}
      />
    )
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${baseClasses} ${borderClasses} px-3 py-2 ${className}`}
      disabled={disabled}
    />
  )
}

const ProjectReview: React.FC<ProjectReviewProps> = ({
  data,
  onBackToEdit,
  onSaveAndPublish,
  onSaveDraft,
  isSubmitting = false,
  isSavingDraft = false,
  isEditMode = false,
  isEditing = false,
  onInputChange,
  onEditSection,
  hideActionBanner = false
}) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)
  const { accentColor: themeAccentColor } = useTheme()
  const accentColor = themeAccentColor

  // Theme Helpers
  const getThemeGradient = (color: AccentColor) => {
    switch (color) {
      case 'indigo': return 'from-indigo-600 via-indigo-700 to-purple-800'
      case 'purple': return 'from-purple-600 via-purple-700 to-fuchsia-800'
      case 'pink': return 'from-pink-600 via-pink-700 to-rose-800'
      case 'green': return 'from-green-600 via-green-700 to-emerald-800'
      case 'orange': return 'from-orange-600 via-orange-700 to-amber-800'
      case 'blue': default: return 'from-blue-600 via-blue-700 to-indigo-800'
    }
  }

  const getThemeLightGradient = (color: AccentColor) => {
    switch (color) {
      case 'indigo': return 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800'
      case 'purple': return 'from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-purple-200 dark:border-purple-800'
      case 'pink': return 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800'
      case 'green': return 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
      case 'orange': return 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800'
      case 'blue': default: return 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  // Scroll to section helper
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm text-gray-900 dark:text-white font-medium">
        {value || 'Não informado'}
      </span>
    </div>
  )

  const EditButton = ({ section, color = "text-white" }: { section: SectionType, color?: string }) => {
    if (!isEditMode || !onEditSection) return null

    return (
      <button
        onClick={() => onEditSection(section)}
        className={`ml - auto p - 2 bg - white / 20 hover: bg - white / 30 backdrop - blur - sm rounded - lg transition - colors ${color} `}
        title="Editar seção"
      >
        <Edit2 className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="flex gap-8 max-w-7xl mx-auto">
      {/* Sidebar de Navegação - Desktop */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:block w-64 sticky top-6 h-fit space-y-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
            Navegação Rápida
          </h3>
          <nav className="space-y-1">
            {[
              { id: 'hero-section', label: 'Banner', icon: ImageIcon },
              { id: 'details-section', label: 'Sobre o Projeto', icon: Lightbulb },
              { id: 'academic-section', label: 'Informações Acadêmicas', icon: GraduationCap },
              { id: 'team-section', label: 'Equipe', icon: Users },
              { id: 'phases-section', label: 'Etapas', icon: Layers },
              { id: 'code-section', label: 'Repositório', icon: Github },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Status Badge */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
            Status do Projeto
          </h3>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <span className={`w-2.5 h-2.5 rounded-full ${data.status === 'PUBLICADO' || data.status === 'EM_ANALISE'
              ? 'bg-green-500 animate-pulse'
              : 'bg-yellow-500'
              } `} />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {data.status === 'PUBLICADO' ? 'Publicado' :
                data.status === 'EM_ANALISE' ? 'Em Análise' :
                  'Rascunho'}
            </span>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 space-y-8 min-w-0">
        {/* Hero Header com Gradiente Dinâmico */}
        <motion.div
          id="hero-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden bg-gradient-to-br ${getThemeGradient(accentColor)} rounded-3xl shadow-2xl p-8 md:p-12`}
        >
          {/* Background Pattern or User Banner */}
          <div className="absolute inset-0">
            {(data.banner || data.bannerUrl) ? (
              <>
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                  src={data.banner ? URL.createObjectURL(data.banner) : data.bannerUrl}
                  alt="Banner do Projeto"
                  className="w-full h-full object-cover"
                />
              </>
            ) : (
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '40px 40px'
              }} />
            )}

            {/* Upload de Banner Overlay */}
            {isEditing && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <label className="cursor-pointer flex flex-col items-center gap-2 p-4 bg-white/90 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                  <ImageIcon className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-bold text-gray-800">Alterar Imagem da Capa</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onInputChange?.('banner', file);
                    }}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                >
                  <Award className="w-10 h-10 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    {isEditMode ? 'Editar Projeto' : 'Revisão Final'}
                    <Sparkles className="w-6 h-6 text-yellow-300" />
                  </h1>
                  <p className="text-white/80 text-base">
                    {isEditMode
                      ? 'Edite as informações do seu projeto abaixo'
                      : 'Seu projeto está quase pronto para ser publicado!'
                    }
                  </p>
                </div>
              </div>

              {!isEditMode && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBackToEdit}
                  className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-xl transition-all border border-white/30"
                >
                  <Edit2 className="w-5 h-5" />
                  Voltar para Edição
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>



        {/* Preview do Banner Antigo (Removido ou mantido como fallback oculto) */}
        {/* data.banner && (...) */}

        {/* Informações Principais - Design Melhorado */}
        <motion.div
          id="details-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Header com Gradiente */}
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white flex-1">
                Sobre o Projeto
              </h2>
              <EditButton section="details" />
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Título e Descrição com Design Card */}
            <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
              <div className="absolute top-3 right-3">
                <Sparkles className="w-5 h-5 text-blue-500" />
              </div>
              <div className="mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Título</span>
                <EditableField
                  value={data.titulo || ''}
                  isEditing={isEditing}
                  onChange={(val) => onInputChange?.('titulo', val)}
                  className="text-xl font-bold text-gray-900 dark:text-white mt-1"
                />
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Descrição</span>
                <EditableField
                  value={data.descricao || ''}
                  isEditing={isEditing}
                  onChange={(val) => onInputChange?.('descricao', val)}
                  multiline
                  className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mt-1"
                />
              </div>
            </div>

            {/* Info Grid Melhorado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Categoria</span>
                </div>
                <EditableField
                  value={data.categoria || ''}
                  isEditing={isEditing}
                  onChange={(val) => onInputChange?.('categoria', val)}
                  className="text-base font-bold text-gray-900 dark:text-white"
                  options={[
                    "Inovação",
                    "Impacto Social",
                    "Sustentabilidade",
                    "Tecnologia Assistiva",
                    "Educação",
                    "Saúde e Bem-estar",
                    "Indústria 4.0",
                    "Outros"
                  ]}
                />
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Modalidade</span>
                </div>
                <EditableField
                  value={data.modalidade || ''}
                  isEditing={isEditing}
                  disabled={true}
                  onChange={(val) => onInputChange?.('modalidade', val)}
                  className="text-base font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Curso</span>
                </div>
                <EditableField
                  value={data.curso || ''}
                  isEditing={isEditing}
                  disabled={true}
                  onChange={(val) => onInputChange?.('curso', val)}
                  className="text-base font-bold text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Informações Acadêmicas - Design Melhorado */}
        <motion.div
          id="academic-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Header com Gradiente */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white flex-1">
                Informações Acadêmicas
              </h2>
              <EditButton section="academic" />
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Turma</p>
                <EditableField
                  value={data.turma || ''}
                  isEditing={isEditing}
                  disabled={true}
                  onChange={(val) => onInputChange?.('turma', val)}
                  className="text-base font-bold text-gray-900 dark:text-white"
                />
              </div>

              <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Unidade Curricular</p>
                <EditableField value={data.unidadeCurricular || ''} isEditing={isEditing} onChange={(val) => onInputChange?.('unidadeCurricular', val)} className="text-base font-bold text-gray-900 dark:text-white" />
              </div>

              <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Itinerário</p>
                <EditableField
                  value={data.itinerario || ''}
                  isEditing={isEditing}
                  onChange={(val) => onInputChange?.('itinerario', val)}
                  className="text-base font-bold text-gray-900 dark:text-white"
                  options={['Sim', 'Não']}
                />
              </div>

              <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">SENAI Lab</p>
                <EditableField
                  value={data.senaiLab || ''}
                  isEditing={isEditing}
                  onChange={(val) => onInputChange?.('senaiLab', val)}
                  className="text-base font-bold text-gray-900 dark:text-white"
                  options={['Sim', 'Não']}
                />
              </div>

              <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">SAGA SENAI</p>
                <EditableField
                  value={data.sagaSenai || ''}
                  isEditing={isEditing}
                  onChange={(val) => onInputChange?.('sagaSenai', val)}
                  className="text-base font-bold text-gray-900 dark:text-white"
                  options={['Sim', 'Não']}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Equipe - Design Melhorado */}
        <motion.div
          id="team-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Header com Gradiente */}
          <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  Equipe do Projeto
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {data.autores.length} {data.autores.length === 1 ? 'membro' : 'membros'} no total
                </p>
              </div>
              <EditButton section="team" />
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Autores */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Autores
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full">
                    {data.autores.length}
                  </span>
                </div>

                {data.autores.length > 0 ? (
                  <div className="space-y-3">
                    {data.autores.map((autor, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {autor.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-base font-medium text-gray-900 dark:text-white">{autor}</span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                    <User className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum autor adicionado</p>
                  </div>
                )}
              </div>

              {/* Orientador e Líder */}
              <div className="space-y-6">
                {/* Orientador */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Orientador
                    </h3>
                  </div>

                  {data.orientador ? (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {data.orientador.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">{data.orientador}</span>
                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Docente Orientador</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center flex flex-col items-center justify-center gap-3">
                      <Award className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Nenhum orientador adicionado</p>
                        {isEditMode && onEditSection && (
                          <button
                            onClick={() => onEditSection('team')}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Adicionar Orientador
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Líder */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Líder do Projeto
                    </h3>
                  </div>

                  <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {data.liderEmail || 'Não informado'}
                    </p>
                    {data.isLeader && (
                      <div className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg w-fit">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-green-700 dark:text-green-300 font-semibold">
                          Você é o líder deste projeto
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Anexos e Timeline - Design Melhorado com Expansão */}
        <motion.div
          id="phases-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Header com Gradiente */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  Etapas do Projeto
                </h2>
                <p className="text-orange-100 text-sm mt-1">
                  Clique para expandir e ver detalhes
                </p>
              </div>
              <EditButton section="phases" />
            </div>
          </div>

          <div className="p-8 space-y-4">
            {[
              {
                id: 'ideacao',
                name: 'Ideação',
                data: data.ideacao,
                color: 'from-yellow-400 to-orange-500',
                bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
                borderColor: 'border-yellow-300 dark:border-yellow-700',
                hoverBorderColor: 'hover:border-yellow-400 dark:hover:border-yellow-600',
                icon: Lightbulb
              },
              {
                id: 'modelagem',
                name: 'Modelagem',
                data: data.modelagem,
                color: 'from-blue-500 to-indigo-600',
                bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
                borderColor: 'border-blue-300 dark:border-blue-700',
                hoverBorderColor: 'hover:border-blue-400 dark:hover:border-blue-600',
                icon: FileText
              },
              {
                id: 'prototipagem',
                name: 'Prototipagem',
                data: data.prototipagem,
                color: 'from-purple-500 to-pink-600',
                bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
                borderColor: 'border-purple-300 dark:border-purple-700',
                hoverBorderColor: 'hover:border-purple-400 dark:hover:border-purple-600',
                icon: Layers
              },
              {
                id: 'implementacao',
                name: 'Implementação',
                data: data.implementacao,
                color: 'from-green-500 to-emerald-600',
                bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
                borderColor: 'border-green-300 dark:border-green-700',
                hoverBorderColor: 'hover:border-green-400 dark:hover:border-green-600',
                icon: Code
              }
            ].map((stage, idx) => {
              const Icon = stage.icon
              const isExpanded = expandedPhase === stage.id
              const hasContent = stage.data.descricao || stage.data.anexos.length > 0

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="overflow-hidden"
                >
                  {/* Card Header - Clicável */}
                  {/* Card Header - Clicável */}
                  <button
                    onClick={() => setExpandedPhase(isExpanded ? null : stage.id)}
                    className={`w-full p-6 bg-gradient-to-br ${stage.bgColor} rounded-2xl border-2 ${stage.borderColor} ${stage.hoverBorderColor} transition-all ${isExpanded ? 'rounded-b-none shadow-lg' : 'hover:shadow-md'
                      } `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 bg-gradient-to-br ${stage.color} rounded-xl shadow-md`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="text-left">
                          <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                            {stage.name}
                          </h4>

                          <div className="flex items-center gap-3">
                            {stage.data.anexos.length > 0 && (
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {stage.data.anexos.length} {stage.data.anexos.length === 1 ? 'anexo' : 'anexos'}
                                </span>
                              </div>
                            )}

                            {stage.data.descricao && (
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm font-medium">Com descrição</span>
                              </div>
                            )}

                            {!hasContent && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 italic">Sem conteúdo</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {hasContent && (
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-500 dark:text-gray-400"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Card Content - Expansível */}
                  <AnimatePresence>
                    {isExpanded && hasContent && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`border - 2 border - t - 0 ${stage.borderColor} rounded - b - 2xl overflow - hidden`}
                      >
                        <div className={`p - 6 bg - gradient - to - br ${stage.bgColor} space - y - 6`}>
                          {/* Descrição */}
                          {stage.data.descricao && (
                            <div>
                              <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Descrição da Fase
                              </h5>
                              <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                                <p className="text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                                  {stage.data.descricao}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Anexos */}
                          {stage.data.anexos.length > 0 && (
                            <div>
                              <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Documentos e Anexos ({stage.data.anexos.length})
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {stage.data.anexos.map((anexo) => (
                                  <div
                                    key={anexo.id}
                                    className="flex items-center gap-3 p-4 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                                  >
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                        {anexo.file.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {anexo.type}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Repositório e Privacidade - Design Melhorado */}
        <motion.div
          id="code-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Header com Gradiente */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Github className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white flex-1">
                Repositório e Privacidade
              </h2>
              <EditButton section="code" />
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
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                          Clique para abrir em uma nova aba
                        </p>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="p-8 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center flex flex-col items-center justify-center gap-4">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                      <Github className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        Adicione um Repositório
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-xs mx-auto">
                        Vincule seu projeto ao GitHub para que outros possam ver seu código.
                      </p>
                      {isEditMode && onEditSection && (
                        <button
                          onClick={() => onEditSection('code')}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                        >
                          Vincular Repositório
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Configurações de Privacidade do Projeto */}
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
                      {data.anexosVisibilidade}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      Define quem pode visualizar os documentos e anexos do projeto
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-3">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                          Suas configurações de privacidade garantem que apenas as pessoas autorizadas possam acessar o conteúdo do projeto.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Botões de Ação - Design Melhorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`sticky bottom-6 z-10 ${isEditing || hideActionBanner ? 'hidden' : ''}`}
        >
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 border-2 border-white/20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                  {isEditMode ? 'Tudo pronto?' : 'Tudo Pronto para Publicar!'}
                </h3>
                <p className="text-blue-100 text-sm">
                  {isEditMode
                    ? 'Clique em salvar para persistir suas alterações'
                    : 'Revise as informações acima e publique seu projeto na Vitrine SENAI'
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {!isEditMode && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBackToEdit}
                    className="px-8 py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold rounded-xl transition-all border-2 border-white/30 shadow-lg"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Edit2 className="w-5 h-5" />
                      Editar Projeto
                    </div>
                  </motion.button>
                )}

                {/* Botão Salvar Rascunho */}
                {onSaveDraft && (
                  <motion.button
                    whileHover={{ scale: isSavingDraft ? 1 : 1.05 }}
                    whileTap={{ scale: isSavingDraft ? 1 : 0.95 }}
                    onClick={onSaveDraft}
                    disabled={isSavingDraft || isSubmitting}
                    className={`px - 8 py - 4 bg - white dark: bg - gray - 800 hover: bg - gray - 50 dark: hover: bg - gray - 700 text - gray - 700 dark: text - gray - 200 font - bold rounded - xl shadow - lg border - 2 border - gray - 200 dark: border - gray - 600 transition - all ${isSavingDraft || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                      } `}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      {isSavingDraft ? (
                        <>
                          <Loader2 className="animate-spin w-5 h-5 text-gray-600 dark:text-gray-400" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          Salvar Rascunho
                        </>
                      )}
                    </div>
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  onClick={onSaveAndPublish}
                  disabled={isSubmitting}
                  className={`px - 8 py - 4 bg - gradient - to - r from - green - 500 to - emerald - 600 hover: from - green - 600 hover: to - emerald - 700 text - white font - bold rounded - xl shadow - 2xl transition - all border - 2 border - green - 400 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    } `}
                >
                  <div className="flex items-center gap-2 justify-center">
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isEditMode ? 'Salvando...' : 'Publicando...'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {isEditMode ? 'Salvar Alterações' : 'Salvar e Publicar'}
                      </>
                    )}
                  </div>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectReview
