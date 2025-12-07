import React, { useState } from 'react'
import { CheckCircle, Edit2, User, FileText, Lightbulb, Code, Eye, Award, Calendar, Tag, Users, GraduationCap, Layers, Sparkles, Shield, Github, ExternalLink, Download, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface ProjectReviewProps {
  data: ProjectReviewData
  onBackToEdit: () => void
  onSaveAndPublish: () => void
  onSaveDraft?: () => void
  isSubmitting?: boolean
  isSavingDraft?: boolean
}

const ProjectReview: React.FC<ProjectReviewProps> = ({
  data,
  onBackToEdit,
  onSaveAndPublish,
  onSaveDraft,
  isSubmitting = false,
  isSavingDraft = false
}) => {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)

  const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm text-gray-900 dark:text-white font-medium">
        {value || 'Não informado'}
      </span>
    </div>
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Header com Gradiente */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 md:p-12"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
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
                  Revisão Final
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </h1>
                <p className="text-blue-100 text-base">
                  Seu projeto está quase pronto para ser publicado!
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToEdit}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-medium rounded-xl transition-all border border-white/30"
            >
              <Edit2 className="w-5 h-5" />
              Voltar para Edição
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Banner Preview com Overlay */}
      {data.banner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group overflow-hidden rounded-3xl shadow-2xl"
        >
          <img
            src={URL.createObjectURL(data.banner)}
            alt="Banner do Projeto"
            className="w-full h-80 md:h-96 object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Floating Title on Banner */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
              {data.titulo || 'Sem título'}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/30">
                {data.categoria}
              </span>
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-sm font-medium rounded-full border border-white/30">
                {data.modalidade}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Informações Principais - Design Melhorado */}
      <motion.div
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
            <h2 className="text-xl font-bold text-white">
              Sobre o Projeto
            </h2>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Título e Descrição com Design Card */}
          <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
            <div className="absolute top-3 right-3">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {data.titulo || 'Sem título'}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.descricao || 'Sem descrição'}
            </p>
          </div>

          {/* Info Grid Melhorado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Categoria</span>
              </div>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {data.categoria || 'Não informado'}
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Modalidade</span>
              </div>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {data.modalidade || 'Não informado'}
              </p>
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Curso</span>
              </div>
              <p className="text-base font-bold text-gray-900 dark:text-white">
                {data.curso || 'Não informado'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Informações Acadêmicas - Design Melhorado */}
      <motion.div
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
            <h2 className="text-xl font-bold text-white">
              Informações Acadêmicas
            </h2>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Turma</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{data.turma || 'Não informado'}</p>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Unidade Curricular</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{data.unidadeCurricular || 'Não informado'}</p>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Itinerário</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{data.itinerario || 'Não informado'}</p>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">SENAI Lab</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{data.senaiLab || 'Não informado'}</p>
            </div>

            <div className="p-5 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">SAGA SENAI</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{data.sagaSenai || 'Não informado'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Equipe - Design Melhorado */}
      <motion.div
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
            <div>
              <h2 className="text-xl font-bold text-white">
                Equipe do Projeto
              </h2>
              <p className="text-green-100 text-sm mt-1">
                {data.autores.length} {data.autores.length === 1 ? 'membro' : 'membros'} no total
              </p>
            </div>
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
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Professor Orientador</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                    <Award className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum orientador adicionado</p>
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
            <div>
              <h2 className="text-xl font-bold text-white">
                Etapas do Projeto
              </h2>
              <p className="text-orange-100 text-sm mt-1">
                Clique para expandir e ver detalhes
              </p>
            </div>
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
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : stage.id)}
                  className={`w-full p-6 bg-gradient-to-br ${stage.bgColor} rounded-2xl border-2 ${stage.borderColor} ${stage.hoverBorderColor} transition-all ${
                    isExpanded ? 'rounded-b-none shadow-lg' : 'hover:shadow-md'
                  }`}
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
                      className={`border-2 border-t-0 ${stage.borderColor} rounded-b-2xl overflow-hidden`}
                    >
                      <div className={`p-6 bg-gradient-to-br ${stage.bgColor} space-y-6`}>
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
            <h2 className="text-xl font-bold text-white">
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        Clique para abrir em uma nova aba
                      </p>
                    </div>
                  </div>
                </a>
              ) : (
                <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                  <Github className="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum repositório adicionado</p>
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
        className="sticky bottom-6 z-10"
      >
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 border-2 border-white/20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 justify-center lg:justify-start">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                Tudo Pronto para Publicar!
              </h3>
              <p className="text-blue-100 text-sm">
                Revise as informações acima e publique seu projeto na Vitrine SENAI
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
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

              {/* Botão Salvar Rascunho */}
              {onSaveDraft && (
                <motion.button
                  whileHover={{ scale: isSavingDraft ? 1 : 1.05 }}
                  whileTap={{ scale: isSavingDraft ? 1 : 0.95 }}
                  onClick={onSaveDraft}
                  disabled={isSavingDraft || isSubmitting}
                  className={`px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-2xl transition-all border-2 border-amber-400 ${
                    isSavingDraft || isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    {isSavingDraft ? (
                      <>
                        <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
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
              
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                onClick={onSaveAndPublish}
                disabled={isSubmitting}
                className={`px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-2xl transition-all border-2 border-green-400 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center gap-2 justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publicando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Salvar e Publicar
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectReview
