import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Upload, X, FileText, Download, Info, Check, ChevronDown, Image } from 'lucide-react'

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
    templateUrl: 'https://www.strategyzer.com/canvas/business-model-canvas',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    id: 'viabilidade', 
    label: 'Planilha de Viabilidade do Projeto', 
    icon: FileText, 
    accept: '.pdf,.xlsx,.xls',
    description: 'Análise financeira e técnica que demonstra se o projeto é viável, incluindo custos, investimentos e retorno esperado.',
    templateUrl: 'https://www.canva.com/templates/?query=viabilidade',
    color: 'from-blue-500 to-indigo-600'
  },
  { 
    id: 'swot', 
    label: 'Análise SWOT', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png,.docx',
    description: 'Análise das Forças, Fraquezas, Oportunidades e Ameaças do projeto para planejamento estratégico.',
    templateUrl: 'https://miro.com/templates/swot-analysis/',
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
    label: 'Cronograma de Execução (Gantt, 5W2H, etc.)', 
    icon: FileText, 
    accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
    description: 'Planejamento temporal com marcos, entregas e responsáveis usando Gantt, 5W2H ou outras metodologias.',
    templateUrl: 'https://www.canva.com/pt_br/criar/cronogramas/',
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
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Settings className="w-3 h-3" /> Detalhe o planejamento
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.descricao.length} caracteres
          </span>
        </div>
      </div>

      {/* Documentos */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Documentos e Evidências da Modelagem
        </label>

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
                className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all overflow-hidden ${
                  hasAttachment 
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {type.description.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
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
                        {/* Descrição Completa */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {type.description}
                          </p>
                        </div>

                        {/* Template Button */}
                        {type.templateUrl && (
                          <a
                            href={type.templateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r ${type.color} rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all`}
                          >
                            <Download className="w-4 h-4" />
                            Baixar Modelo/Template
                          </a>
                        )}

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
                            className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                              isDragging 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                              isDragging 
                                ? 'bg-blue-100 dark:bg-blue-900/30 scale-110' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                              <Upload className={`w-7 h-7 transition-colors ${
                                isDragging 
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
