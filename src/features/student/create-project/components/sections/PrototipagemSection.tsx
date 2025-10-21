import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Upload, X, FileText, Image, LinkIcon, Info, Check, Download, ChevronDown } from 'lucide-react'

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
    color: 'from-purple-500 to-pink-600',
    isLink: false
  },
  { 
    id: 'mockups', 
    label: 'Mockups', 
    icon: Image, 
    accept: '.pdf,.jpg,.jpeg,.png,.fig',
    description: 'Protótipos de alta fidelidade com design visual completo e detalhado.',
    templateUrl: 'https://www.canva.com/templates/?query=mockup',
    color: 'from-purple-500 to-pink-600',
    isLink: false
  },
  { 
    id: 'prototipo_interativo', 
    label: 'Protótipo Interativo (Figma, Adobe XD, etc.)', 
    icon: LinkIcon, 
    accept: '',
    description: 'Link de protótipo clicável que simula a experiência de uso do produto.',
    templateUrl: null,
    color: 'from-purple-500 to-pink-600',
    isLink: true
  },
  { 
    id: 'modelagem_3d', 
    label: 'Desenho 3D / Modelagem CAD', 
    icon: FileText, 
    accept: '.pdf,.stl,.obj,.jpg,.jpeg,.png',
    description: 'Modelagem tridimensional ou desenhos técnicos CAD do produto.',
    templateUrl: 'https://www.tinkercad.com/',
    color: 'from-purple-500 to-pink-600',
    isLink: false
  },
  { 
    id: 'maquete_fisica', 
    label: 'Fotos ou Vídeo de Maquete Física', 
    icon: Image, 
    accept: '.jpg,.jpeg,.png,.mp4,.mov',
    description: 'Registro visual de protótipo físico ou maquete do projeto.',
    templateUrl: null,
    color: 'from-purple-500 to-pink-600',
    isLink: false
  },
  { 
    id: 'fluxograma', 
    label: 'Fluxograma de Processo', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Diagrama que representa o fluxo de processos, navegação ou funcionamento do sistema.',
    templateUrl: 'https://miro.com/templates/flowchart/',
    color: 'from-purple-500 to-pink-600',
    isLink: false
  }
]

const PrototipagemSection: React.FC<PrototipagemSectionProps> = ({ data, onUpdate }) => {
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({})
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

  const handleLinkAdd = (typeId: string) => {
    const link = linkInputs[typeId]
    if (!link?.trim()) return

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

  const toggleCard = (typeId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [typeId]: !prev[typeId]
    }))
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
      
      {/* Hero Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
          <Wrench className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Fase 3: Prototipagem
            </h3>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
              Design
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Crie protótipos e valide suas ideias
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
          className="w-full border-2 rounded-xl px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 resize-none border-purple-200 dark:border-purple-800 bg-white"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Wrench className="w-3 h-3" /> Mostre o processo de criação
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.descricao.length} caracteres
          </span>
        </div>
      </div>

      {/* Documentos */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Documentos e Evidências da Prototipagem
        </label>

        <div className="grid grid-cols-1 gap-4">
          {attachmentTypes.map((type, index) => {
            const Icon = type.icon
            const attachments = getAttachmentsByType(type.id)
            const isLink = type.isLink || false
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
                {/* Card Header */}
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

                {/* Card Content */}
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
                        {/* Descrição */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/30 dark:to-gray-800/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {type.description}
                          </p>
                        </div>

                        {/* Template */}
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

                        {/* Upload/Link */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {isLink ? 'Cole o link do protótipo:' : 'Anexar arquivo:'}
                            </p>
                          </div>

                          {isLink ? (
                            <div className="space-y-2">
                              <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="url"
                                  value={linkInputs[type.id] || ''}
                                  onChange={e => setLinkInputs({ ...linkInputs, [type.id]: e.target.value })}
                                  placeholder="https://figma.com/proto/..."
                                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                />
                              </div>
                              <button
                                onClick={() => handleLinkAdd(type.id)}
                                disabled={!linkInputs[type.id]?.trim()}
                                className={`w-full px-4 py-2.5 bg-gradient-to-r ${type.color} text-white text-sm font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:-translate-y-0.5`}
                              >
                                Adicionar Link
                              </button>
                            </div>
                          ) : (
                            <label 
                              onDragOver={(e) => handleDragOver(e, type.id)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, type.id)}
                              className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                                isDragging 
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center transition-all ${
                                isDragging 
                                  ? 'bg-purple-100 dark:bg-purple-900/30 scale-110' 
                                  : 'bg-gray-100 dark:bg-gray-700'
                              }`}>
                                <Upload className={`w-7 h-7 transition-colors ${
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

                        {/* Files */}
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

export default PrototipagemSection
