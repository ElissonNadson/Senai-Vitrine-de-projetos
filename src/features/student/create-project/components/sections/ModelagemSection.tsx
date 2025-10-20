import React, { useState } from 'react'
import { Settings, Upload, X, FileText, Download, Info, Check } from 'lucide-react'

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
    templateUrl: 'https://www.strategyzer.com/canvas/business-model-canvas'
  },
  { 
    id: 'viabilidade', 
    label: 'Planilha de Viabilidade do Projeto', 
    icon: FileText, 
    accept: '.pdf,.xlsx,.xls',
    description: 'Análise financeira e técnica que demonstra se o projeto é viável, incluindo custos, investimentos e retorno esperado.',
    templateUrl: 'https://www.canva.com/templates/?query=viabilidade'
  },
  { 
    id: 'swot', 
    label: 'Análise SWOT', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png,.docx',
    description: 'Análise das Forças, Fraquezas, Oportunidades e Ameaças do projeto para planejamento estratégico.',
    templateUrl: 'https://miro.com/templates/swot-analysis/'
  },
  { 
    id: 'matriz_riscos', 
    label: 'Matriz de Riscos', 
    icon: FileText, 
    accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
    description: 'Matriz que identifica, avalia e prioriza riscos do projeto baseado em probabilidade e impacto.',
    templateUrl: 'https://www.projectmanager.com/templates/risk-matrix-template'
  },
  { 
    id: 'cronograma', 
    label: 'Cronograma de Execução (Gantt, 5W2H, etc.)', 
    icon: FileText, 
    accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
    description: 'Planejamento temporal com marcos, entregas e responsáveis usando Gantt, 5W2H ou outras metodologias.',
    templateUrl: 'https://www.canva.com/pt_br/criar/cronogramas/'
  }
]

const ModelagemSection: React.FC<ModelagemSectionProps> = ({ data, onUpdate }) => {
  const [dragOver, setDragOver] = useState<string | null>(null)

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

  return (
    <div className="space-y-6">
      
      {/* Hero Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Fase de Modelagem
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Planejamento detalhado e estruturação do projeto
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
          className="w-full border rounded-xl px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none border-gray-300 dark:border-gray-600"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Detalhe o planejamento e a estrutura
          </p>
          <span className={`text-xs font-medium ${
            data.descricao.length > 450 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {data.descricao.length}/500
          </span>
        </div>
      </div>

      {/* Documentos */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Documentos da Modelagem
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {attachmentTypes.map((type, index) => {
            const Icon = type.icon
            const attachments = getAttachmentsByType(type.id)
            const hasAttachment = attachments.length > 0
            const isDragging = dragOver === type.id

            return (
              <div
                key={type.id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-5 border transition-all ${
                  hasAttachment 
                    ? 'border-green-500 shadow-sm' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-5">
                  
                  {/* Coluna Esquerda - Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {type.label}
                          </h4>
                          {hasAttachment && (
                            <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                              <Check className="w-3 h-3" />
                              Anexado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </div>

                    {type.templateUrl && (
                      <a
                        href={type.templateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Baixar Modelo/Template
                      </a>
                    )}

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {attachments.length} arquivo(s):
                        </p>
                        {attachments.map(att => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium">
                                {att.file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({(att.file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() => removeAttachment(att.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Coluna Direita - Upload */}
                  <div className="lg:w-80">
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Anexar arquivo:
                        </p>
                      </div>

                      <label 
                        onDragOver={(e) => handleDragOver(e, type.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, type.id)}
                        className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                          isDragging 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
                          isDragging 
                            ? 'bg-blue-100 dark:bg-blue-900/30' 
                            : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Upload className={`w-6 h-6 transition-colors ${
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
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

export default ModelagemSection
