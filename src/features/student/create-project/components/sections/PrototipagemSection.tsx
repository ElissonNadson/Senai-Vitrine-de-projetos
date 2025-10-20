import React, { useState } from 'react'
import { Paintbrush, Upload, X, FileText, Image, LinkIcon, Info, Check, Download } from 'lucide-react'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PrototipagemSectionProps {
  data: {
    descricao: string
    anexos: Attachment[]
  }
  onUpdate: (field: string, value: any) => void
}

const attachmentTypes = [
  { 
    id: 'wireframes', 
    label: 'Wireframes', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png,.fig',
    description: 'Esboços de baixa fidelidade mostrando layout e estrutura das telas ou produto.',
    templateUrl: 'https://www.figma.com/templates/wireframe-kits/',
    isLink: false
  },
  { 
    id: 'mockups', 
    label: 'Mockups', 
    icon: Image, 
    accept: '.pdf,.jpg,.jpeg,.png,.fig',
    description: 'Protótipos de alta fidelidade com design visual completo e detalhado.',
    templateUrl: 'https://www.canva.com/templates/?query=mockup',
    isLink: false
  },
  { 
    id: 'prototipo_interativo', 
    label: 'Protótipo Interativo (Figma, Adobe XD, etc.)', 
    icon: LinkIcon, 
    accept: '',
    description: 'Link de protótipo clicável que simula a experiência de uso do produto.',
    templateUrl: null,
    isLink: true
  },
  { 
    id: 'modelagem_3d', 
    label: 'Desenho 3D / Modelagem CAD', 
    icon: FileText, 
    accept: '.pdf,.stl,.obj,.jpg,.jpeg,.png',
    description: 'Modelagem tridimensional ou desenhos técnicos CAD do produto.',
    templateUrl: 'https://www.tinkercad.com/',
    isLink: false
  },
  { 
    id: 'maquete_fisica', 
    label: 'Fotos ou Vídeo de Maquete Física', 
    icon: Image, 
    accept: '.jpg,.jpeg,.png,.mp4,.mov',
    description: 'Registro visual de protótipo físico ou maquete do projeto.',
    templateUrl: null,
    isLink: false
  },
  { 
    id: 'fluxograma', 
    label: 'Fluxograma de Processo', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Diagrama que representa o fluxo de processos, navegação ou funcionamento do sistema.',
    templateUrl: 'https://miro.com/templates/flowchart/',
    isLink: false
  }
]

const PrototipagemSection: React.FC<PrototipagemSectionProps> = ({ data, onUpdate }) => {
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({})
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

  const handleLinkAdd = (typeId: string) => {
    const link = linkInputs[typeId]
    if (!link?.trim()) return

    // Create a File-like object for the link
    const blob = new Blob([link], { type: 'text/plain' })
    const file = blob as any as File
    Object.defineProperty(file, 'name', { value: link })
    
    const newAttachment: Attachment = {
      id: `${typeId}-${Date.now()}`,
      file,
      type: typeId
    }
    onUpdate('anexos', [...data.anexos, newAttachment])
    setLinkInputs({ ...linkInputs, [typeId]: '' })
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
          <Paintbrush className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Fase de Prototipagem
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Criação de protótipos para validar conceitos e ideias
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Descrição da Fase de Prototipagem
        </label>
        <textarea
          value={data.descricao}
          onChange={e => onUpdate('descricao', e.target.value)}
          placeholder="Explique o processo de prototipagem, wireframes, mockups e testes...&#10;&#10;• Quais protótipos foram criados?&#10;• Como foi o processo de design?&#10;• Quais testes foram realizados?&#10;• Que feedbacks foram recebidos?"
          rows={8}
          className="w-full border rounded-xl px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none border-gray-300 dark:border-gray-600"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Descreva o processo de prototipagem
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
          Protótipos e Designs
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
                          {attachments.length} {type.isLink ? 'link(s)' : 'arquivo(s)'}:
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
                              {!type.isLink && (
                                <span className="text-xs text-gray-500">
                                  ({(att.file.size / 1024).toFixed(1)} KB)
                                </span>
                              )}
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

                  {/* Coluna Direita - Upload ou Link */}
                  <div className="lg:w-80">
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {type.isLink ? 'Adicionar link:' : 'Anexar arquivo:'}
                        </p>
                      </div>

                      {type.isLink ? (
                        <div className="space-y-2">
                          <input
                            type="url"
                            value={linkInputs[type.id] || ''}
                            onChange={e => setLinkInputs({ ...linkInputs, [type.id]: e.target.value })}
                            placeholder="https://figma.com/..."
                            className="w-full border rounded-lg px-3 py-2 text-sm dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                          />
                          <button
                            onClick={() => handleLinkAdd(type.id)}
                            disabled={!linkInputs[type.id]?.trim()}
                            className="w-full px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Adicionar Link
                          </button>
                        </div>
                      ) : (
                        <label 
                          onDragOver={(e) => handleDragOver(e, type.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, type.id)}
                          className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                            isDragging 
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                          }`}
                        >
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
                            isDragging 
                              ? 'bg-purple-100 dark:bg-purple-900/30' 
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Upload className={`w-6 h-6 transition-colors ${
                              isDragging 
                                ? 'text-purple-600 dark:text-purple-400' 
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
                      )}
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

export default PrototipagemSection
