import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Upload, X, FileText, Download, Info, Check, ChevronDown, Image, CheckCircle2, Circle } from 'lucide-react'

interface Attachment {
  id: string
  file: File
  type: string
}

interface ModelagemSectionProps {
  data: {
    descricao: string
    anexos: Attachment[]
  }
  onUpdate: (field: string, value: any) => void
}

const attachmentTypes = [
  {
    id: 'business_canvas',
    label: 'Business Model Canvas',
    icon: FileText,
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Ferramenta estratégica que descreve como a empresa cria, entrega e captura valor através de 9 blocos fundamentais.',
    templateUrl: 'https://www.canva.com/design/DAG7NkqCpQw/cbko-cLQG4LWyagpNCNg_w/edit?utm_content=DAG7NkqCpQw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'viabilidade',
    label: 'Planilha de Viabilidade do Projeto',
    icon: FileText,
    accept: '.pdf,.xlsx,.xls',
    description: 'Análise financeira e técnica que demonstra se o projeto é viável, incluindo custos, investimentos e retorno esperado.',
    templateUrl: 'https://docs.google.com/spreadsheets/d/1ru2eNGfkDl3zGUFcYFAB_D_vS53sttiQFulWX0-OHdg/edit?usp=sharing',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'swot',
    label: 'Análise SWOT',
    icon: FileText,
    accept: '.pdf,.jpg,.jpeg,.png,.docx',
    description: 'Análise das Forças, Fraquezas, Oportunidades e Ameaças do projeto para planejamento estratégico.',
    templateUrl: 'https://www.canva.com/design/DAG7s0MulTo/XRQdk62WdozEWkeWRGab3w/edit?utm_content=DAG7s0MulTo&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'matriz_riscos',
    label: 'Matriz de Riscos',
    icon: FileText,
    accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
    description: 'Matriz que identifica, avalia e prioriza riscos do projeto baseado em probabilidade e impacto.',
    templateUrl: 'https://www.projectmanager.com/templates/risk-matrix-template',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'cronograma',
    label: 'Cronograma de Execução (Gantt)',
    icon: FileText,
    accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
    description: 'Planejamento temporal com marcos, entregas e responsáveis.',
    templateUrl: 'https://www.canva.com/pt_br/criar/cronogramas/',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'plano_acao_5w2h',
    label: 'Plano de Ação 5W2H',
    icon: FileText,
    accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
    description: 'Ferramenta de gestão para planejamento de atividades (What, Why, Where, When, Who, How, How much).',
    templateUrl: 'https://www.canva.com/search/templates?q=5w2h',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'canvas_projeto',
    label: 'Canvas de Projeto',
    icon: FileText,
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Visão geral do projeto em uma única página, integrando objetivos, justificativa e entregáveis.',
    templateUrl: 'https://www.canva.com/design/DAG8DlyMW7o/asMrQbiLQ8VID2hM5nFfsA/edit?utm_content=DAG8DlyMW7o&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'outros_modelagem',
    label: 'Outros Documentos',
    icon: FileText,
    accept: '.pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.zip',
    description: 'Qualquer outro documento relevante da fase de Modelagem que não se encaixe nas categorias acima.',
    templateUrl: null,
    color: 'from-blue-500 to-indigo-600'
  }
]

const ModelagemSection: React.FC<ModelagemSectionProps> = ({ data, onUpdate }) => {
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const handleFileUpload = (typeId: string, file: File) => {
    const newAttachment: Attachment = {
      id: `${typeId}-${Date.now()}`,
      file,
      type: typeId
    }
    onUpdate('anexos', [...data.anexos, newAttachment])
  }

  const handleDragOver = (e: React.DragEvent, typeId: string) => {
    e.preventDefault()
    setDragOver(typeId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(null)
  }

  const handleDrop = (e: React.DragEvent, typeId: string) => {
    e.preventDefault()
    setDragOver(null)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(typeId, file)
    }
  }

  const removeAttachment = (id: string) => {
    onUpdate('anexos', data.anexos.filter(att => att.id !== id))
  }

  const getAttachmentsByType = (typeId: string) => {
    return data.anexos.filter(att => att.type === typeId)
  }

  const toggleCard = (typeId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [typeId]: !prev[typeId]
    }))
  }

  const hasMinChars = data.descricao.length >= 50
  const hasAttachments = data.anexos.length > 0

  const getCharCountColor = () => {
    const length = data.descricao.length
    if (length === 0) return 'text-gray-500 dark:text-gray-400'
    if (length < 50) return 'text-red-500 font-medium'
    if (length > 4900) return 'text-amber-500 font-medium'
    return 'text-green-600 dark:text-green-400'
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">

      {/* Hero Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Fase 2: Modelagem
            </h3>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
              Planejamento
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Estruture o modelo de negócio e planeje a execução
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Descrição da Fase de Modelagem
        </label>
        <textarea
          value={data.descricao}
          onChange={e => onUpdate('descricao', e.target.value)}
          placeholder="Explique a modelagem do negócio, análise de viabilidade, requisitos e arquitetura...&#10;&#10;• Como foi estruturado o modelo de negócio?&#10;• Qual é a viabilidade do projeto?&#10;• Quais riscos foram identificados?&#10;• Como foi definido o cronograma?"
          rows={8}
          className="w-full border-2 rounded-xl px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 resize-none border-blue-200 dark:border-blue-800 bg-white"
        />
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-xs">
              <span className={`flex items-center gap-1 transition-colors ${hasMinChars ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {hasMinChars ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                Mínimo 50 caracteres
              </span>
              <span className={`flex items-center gap-1 transition-colors ${hasAttachments ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                {hasAttachments ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                Mínimo 1 anexo
              </span>
            </div>
            <span className={`text-xs transition-colors ${getCharCountColor()}`}>
              {data.descricao.length} / 5000 caracteres
            </span>
          </div>
        </div>
      </div>

      {/* Documentos */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Documentos e Evidências da Modelagem
        </label>

        {/* Aviso Importante */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4"
        >
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                📋 Requisito Mínimo
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                É necessário ter <strong>pelo menos um documento</strong> preenchido nesta fase para poder avançar para a próxima etapa do projeto.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4">
          {attachmentTypes.map((type, index) => {
            const Icon = type.icon
            const attachments = getAttachmentsByType(type.id)
            const hasAttachment = attachments.length > 0
            const isDragging = dragOver === type.id
            const isExpanded = expandedCards[type.id] || false

            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all overflow-hidden ${hasAttachment
                  ? 'border-green-500 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
              >
                {/* Card Header - Always Visible */}
                <button
                  onClick={() => toggleCard(type.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 bg-gradient-to-br ${type.color} rounded-lg shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {type.label}
                        </h4>
                        {hasAttachment && (
                          <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-md border border-green-200 dark:border-green-800">
                            <Check className="w-3 h-3" />
                            {attachments.length}
                          </span>
                        )}
                      </div>
                      {!isExpanded && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {type.description.substring(0, 60)}...
                        </p>
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Card Content - Collapsible */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              {type.description}
                            </p>
                          </div>

                          {type.templateUrl && (
                            <div className="flex-shrink-0">
                              <a
                                href={type.templateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r ${type.color} rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all whitespace-nowrap`}
                              >
                                <Download className="w-4 h-4" />
                                Ver modelo
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Upload Area */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Anexar arquivo:
                            </p>
                          </div>

                          <label
                            onDragOver={(e) => handleDragOver(e, type.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, type.id)}
                            className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${isDragging
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                              }`}
                          >
                            <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${isDragging
                              ? 'bg-blue-100 dark:bg-blue-900/30 scale-110'
                              : 'bg-gray-100 dark:bg-gray-700'
                              }`}>
                              <Upload className={`w-7 h-7 transition-colors ${isDragging
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-500 dark:text-gray-400'
                                }`} />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              {isDragging ? 'Solte o arquivo aqui' : 'Clique ou arraste o arquivo'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {type.accept.split(',').map(ext => ext.trim().toUpperCase().replace('.', '')).join(', ')}
                            </p>
                            <input
                              type="file"
                              accept={type.accept}
                              onChange={e => e.target.files?.[0] && handleFileUpload(type.id, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Uploaded Files */}
                        {attachments.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Arquivos anexados ({attachments.length}):
                              </p>
                            </div>
                            {attachments.map(att => (
                              <motion.div
                                key={att.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 group hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className={`p-2 bg-gradient-to-br ${type.color} rounded-lg`}>
                                    <FileText className="w-4 h-4 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">
                                      {att.file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {(att.file.size / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                </div>

                                <button
                                  onClick={() => removeAttachment(att.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </motion.div>
                            ))}
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
      </div>

    </div>
  )
}

export default ModelagemSection
