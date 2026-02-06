import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Lightbulb, PenTool, Layers, Rocket,
  Upload, X, Image, Video, Link as LinkIcon, Download,
  Info, Check, ChevronDown, CheckCircle2, Circle
} from 'lucide-react'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

interface AttachmentsSectionProps {
  data: {
    banner?: File | null
    ideacao: PhaseData
    modelagem: PhaseData
    prototipagem: PhaseData
    implementacao: PhaseData
  }
  errors?: Record<string, string>
  onUpdate: (field: string, value: any) => void
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ data, errors = {}, onUpdate }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({})
  const [dragOver, setDragOver] = useState<string | null>(null)

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const handleFileUpload = (phaseId: string, typeId: string, file: File) => {
    const currentPhaseData = data[phaseId as keyof typeof data] as PhaseData
    const newAttachment: Attachment = {
      id: `${typeId}-${Date.now()}`,
      file,
      type: typeId
    }
    const updatedAnexos = [...(currentPhaseData.anexos || []), newAttachment]
    onUpdate(phaseId, { ...currentPhaseData, anexos: updatedAnexos })
  }

  const handleLinkAdd = (phaseId: string, typeId: string) => {
    const link = linkInputs[typeId]
    if (!link?.trim()) return

    const blob = new Blob([link], { type: 'text/plain' })
    const file = blob as any as File
    Object.defineProperty(file, 'name', { value: 'LINK: ' + link })

    handleFileUpload(phaseId, typeId, file)
    setLinkInputs(prev => ({ ...prev, [typeId]: '' }))
  }

  const removeAttachment = (phaseId: string, attachmentId: string) => {
    const currentPhaseData = data[phaseId as keyof typeof data] as PhaseData
    const updatedAnexos = currentPhaseData.anexos.filter(att => att.id !== attachmentId)
    onUpdate(phaseId, { ...currentPhaseData, anexos: updatedAnexos })
  }

  const getPhaseIconClasses = (color: string, hasAttachment: boolean) => {
    const baseClasses = {
      yellow: hasAttachment
        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
      blue: hasAttachment
        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      purple: hasAttachment
        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
        : 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
      green: hasAttachment
        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
        : 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    }
    return baseClasses[color as keyof typeof baseClasses] || baseClasses.blue
  }

  const phases = [
    {
      id: 'ideacao',
      title: 'Ideação',
      icon: Lightbulb,
      description: 'Fase de brainstorming e concepção da ideia.',
      color: 'yellow',
      suggestions: [
        {
          id: 'crazy8',
          label: 'Crazy 8',
          description: 'Técnica criativa: 8 ideias em 8 minutos.',
          icon: FileText,
          templateUrl: 'https://miro.com/templates/crazy-8s/',
          accept: '.pdf,.jpg,.png'
        },
        {
          id: 'persona',
          label: 'Persona',
          description: 'Representação fictícia do cliente ideal.',
          icon: FileText,
          templateUrl: 'https://miro.com/templates/user-persona/',
          accept: '.pdf,.jpg,.png'
        },
        {
          id: 'mapa_empatia',
          label: 'Mapa de Empatia',
          description: 'O que o cliente pensa, sente, vê, ouve...',
          icon: Image,
          templateUrl: 'https://www.canva.com/pt_br/criar/mapa-de-empatia/',
          accept: '.pdf,.jpg,.png'
        },
        {
          id: 'video_pitch',
          label: 'Vídeo Pitch',
          description: 'Apresentação curta da ideia (Link).',
          icon: Video,
          isLink: true
        }
      ]
    },
    {
      id: 'modelagem',
      title: 'Modelagem',
      icon: PenTool,
      description: 'Desenho técnico, diagramas e estruturação.',
      color: 'blue',
      suggestions: [
        {
          id: 'business_canvas',
          label: 'Business Model Canvas',
          description: 'Modelo de negócio em 9 blocos.',
          icon: FileText,
          templateUrl: 'https://www.strategyzer.com/canvas/business-model-canvas',
          accept: '.pdf,.jpg,.png'
        },
        {
          id: 'swot',
          label: 'Análise SWOT',
          description: 'Forças, Fraquezas, Oportunidades, Ameaças.',
          icon: FileText,
          templateUrl: 'https://miro.com/templates/swot-analysis/',
          accept: '.pdf,.jpg,.png'
        },
        {
          id: 'cronograma',
          label: 'Cronograma',
          description: 'Planejamento temporal (Gantt, etc).',
          icon: FileText,
          templateUrl: 'https://www.canva.com/pt_br/criar/cronogramas/',
          accept: '.pdf,.xlsx'
        }
      ]
    },
    {
      id: 'prototipagem',
      title: 'Prototipagem',
      icon: Layers,
      description: 'Criação de protótipos e testes iniciais.',
      color: 'purple',
      suggestions: [
        {
          id: 'wireframes',
          label: 'Wireframes',
          description: 'Esboços de baixa fidelidade.',
          icon: FileText,
          templateUrl: 'https://www.figma.com/templates/wireframe-kits/',
          accept: '.pdf,.jpg,.png,.fig'
        },
        {
          id: 'mockups',
          label: 'Mockups',
          description: 'Design visual de alta fidelidade.',
          icon: Image,
          templateUrl: 'https://www.canva.com/templates/?query=mockup',
          accept: '.pdf,.jpg,.png'
        },
        {
          id: 'prototipo_interativo',
          label: 'Protótipo Interativo',
          description: 'Link do Figma/Adobe XD.',
          icon: LinkIcon,
          isLink: true
        }
      ]
    },
    {
      id: 'implementacao',
      title: 'Implementação',
      icon: Rocket,
      description: 'Desenvolvimento final e execução.',
      color: 'green',
      suggestions: [
        {
          id: 'video_final',
          label: 'Vídeo Final',
          description: 'Demonstração do projeto finalizado.',
          icon: Video,
          isLink: true
        },
        {
          id: 'teste_piloto',
          label: 'Teste Piloto',
          description: 'Relatório de testes realizados.',
          icon: FileText,
          templateUrl: null,
          accept: '.pdf,.docx'
        },
        {
          id: 'feedback',
          label: 'Feedback de Usuários',
          description: 'Depoimentos ou formulários.',
          icon: FileText,
          templateUrl: null,
          accept: '.pdf,.docx'
        }
      ]
    }
  ]

  const handlePhaseUpdate = (phase: string, field: string, value: any) => {
    const currentData = (data[phase as keyof typeof data] as PhaseData) || { descricao: '', anexos: [] }
    onUpdate(phase, { ...currentData, [field]: value })
  }

  const [activeTab, setActiveTab] = useState('ideacao')

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tabs Header */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2 p-4">
            {phases.map((phase) => {
              const Icon = phase.icon
              const isActive = activeTab === phase.id
              const hasError = !!errors[phase.id]

              return (
                <button
                  key={phase.id}
                  onClick={() => setActiveTab(phase.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold transition-all duration-200 ${isActive
                      ? `bg-${phase.color}-50 dark:bg-${phase.color}-900/20 border-${phase.color}-500 text-${phase.color}-700 dark:text-${phase.color}-300 shadow-sm`
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    } ${hasError ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''}`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive
                      ? `bg-${phase.color}-100 dark:bg-${phase.color}-800 text-${phase.color}-600 dark:text-${phase.color}-300`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm">{phase.title}</span>
                  {hasError && (
                    <Info className="w-4 h-4 text-red-500 ml-1" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {phases.map((phase, index) => {
            if (phase.id !== activeTab) return null

            const phaseData = (data[phase.id as keyof typeof data] as PhaseData) || { descricao: '', anexos: [] }
            const hasError = !!errors[phase.id]

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Header da Fase Ativa */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-4 rounded-2xl bg-${phase.color}-100 dark:bg-${phase.color}-900/30`}>
                    <phase.icon className={`w-8 h-8 text-${phase.color}-600 dark:text-${phase.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {phase.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {phase.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Descrição Field */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Descrição da Fase
                      </label>
                      <span className={`text-xs ${phaseData.descricao?.length < 50 ? 'text-orange-500' : 'text-green-500'}`}>
                        {phaseData.descricao?.length || 0}/50 caracteres
                      </span>
                    </div>

                    <textarea
                      value={phaseData.descricao || ''}
                      onChange={(e) => handlePhaseUpdate(phase.id, 'descricao', e.target.value)}
                      placeholder={`Descreva o que foi feito na fase de ${phase.title.toLowerCase()}...`}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-${phase.color}-500/20 focus:border-${phase.color}-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${hasError ? 'border-red-300' : 'border-gray-200'}`}
                      rows={4}
                    />
                    {hasError && (
                      <p className="text-red-500 text-sm mt-1">{errors[phase.id]}</p>
                    )}
                  </div>

                  {/* Sugestões e Uploads */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Anexos Sugeridos
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.suggestions.map((suggestion) => {
                        const Icon = suggestion.icon
                        const attachments = phaseData.anexos?.filter(att => att.type === suggestion.id) || []
                        const hasAttachment = attachments.length > 0
                        const isExpanded = expandedCards[`${phase.id}-${suggestion.id}`]
                        const isDragging = dragOver === `${phase.id}-${suggestion.id}`

                        return (
                          <div
                            key={suggestion.id}
                            className={`border rounded-xl transition-all ${hasAttachment
                              ? 'border-green-500 bg-green-50/10 dark:bg-green-900/10'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                              }`}
                          >
                            <div
                              className="p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-t-xl transition-colors"
                              onClick={() => toggleCard(`${phase.id}-${suggestion.id}`)}
                            >
                              <div className={`p-2 rounded-lg ${getPhaseIconClasses(phase.color, hasAttachment)}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {suggestion.label}
                                  </h4>
                                  {hasAttachment && (
                                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                      <Check className="w-3 h-3" />
                                      {attachments.length}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {suggestion.description}
                                </p>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                  <div className="p-4 space-y-3">
                                    {suggestion.templateUrl && (
                                      <a
                                        href={suggestion.templateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline mb-2"
                                      >
                                        <Download className="w-3 h-3" />
                                        Baixar modelo recomendado
                                      </a>
                                    )}

                                    {/* Lista de Arquivos Anexados */}
                                    {hasAttachment && (
                                      <div className="space-y-2 mb-3">
                                        {attachments.map(att => (
                                          <div key={att.id} className="flex items-center justify-between text-xs bg-white dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
                                            <span className="truncate flex-1 pr-2">{att.file.name}</span>
                                            <button
                                              onClick={(e) => { e.stopPropagation(); removeAttachment(phase.id, att.id); }}
                                              className="text-red-500 hover:text-red-700"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {/* Área de Upload/Input */}
                                    {suggestion.isLink ? (
                                      <div className="flex gap-2">
                                        <input
                                          type="url"
                                          placeholder="Cole o link aqui..."
                                          className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                          value={linkInputs[suggestion.id] || ''}
                                          onChange={e => setLinkInputs({ ...linkInputs, [suggestion.id]: e.target.value })}
                                        />
                                        <button
                                          onClick={() => handleLinkAdd(phase.id, suggestion.id)}
                                          disabled={!linkInputs[suggestion.id]}
                                          className="px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                        >
                                          Adicionar
                                        </button>
                                      </div>
                                    ) : (
                                      <label
                                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 hover:border-blue-400'
                                          }`}
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(`${phase.id}-${suggestion.id}`); }}
                                        onDragLeave={(e) => { e.preventDefault(); setDragOver(null); }}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          setDragOver(null);
                                          if (e.dataTransfer.files?.[0]) {
                                            handleFileUpload(phase.id, suggestion.id, e.dataTransfer.files[0]);
                                          }
                                        }}
                                      >
                                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">Clique ou arraste para enviar</span>
                                        <input
                                          type="file"
                                          className="hidden"
                                          accept={suggestion.accept}
                                          onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                              handleFileUpload(phase.id, suggestion.id, e.target.files[0]);
                                            }
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AttachmentsSection
