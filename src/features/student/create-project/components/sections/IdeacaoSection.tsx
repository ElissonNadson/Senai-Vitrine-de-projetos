import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Upload, X, FileText, Image, Video, AlertCircle, Download, Link as LinkIcon, Info, Check, ChevronDown } from 'lucide-react'

interface Attachment {
  id: string
  file: File
  type: string
}

interface IdeacaoSectionProps {
  data: {
    descricao: string
    anexos: Attachment[]
  }
  onUpdate: (field: string, value: any) => void
}

const attachmentTypes = [
  { 
    id: 'crazy8', 
    label: 'Crazy 8', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Técnica criativa de brainstorming que consiste em dobrar uma folha em 8 partes e desenhar 8 ideias diferentes em 8 minutos.',
    templateUrl: 'https://miro.com/templates/crazy-8s/',
    color: 'from-rose-500 to-pink-600'
  },
  { 
    id: 'mapa_mental', 
    label: 'Mapa Mental ou Nuvem de Palavras', 
    icon: Image, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Diagrama usado para representar palavras, ideias ou conceitos ligados a um tema central, facilitando a organização do pensamento.',
    templateUrl: 'https://www.canva.com/pt_br/criar/mapas-mentais/',
    color: 'from-purple-500 to-indigo-600'
  },
  { 
    id: 'value_proposition', 
    label: 'Proposta de Valor (Value Proposition Canvas)', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Ferramenta que ajuda a entender o que o cliente realmente valoriza e como seu produto/serviço pode atender essas necessidades.',
    templateUrl: 'https://www.strategyzer.com/library/the-value-proposition-canvas',
    color: 'from-blue-500 to-cyan-600'
  },
  { 
    id: 'customer_journey', 
    label: 'Jornada do Usuário (Customer Journey Map)', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Mapa visual que ilustra a experiência completa do cliente ao interagir com seu produto ou serviço, do início ao fim.',
    templateUrl: 'https://miro.com/templates/customer-journey-map/',
    color: 'from-teal-500 to-emerald-600'
  },
  { 
    id: 'scamper', 
    label: 'Técnica SCAMPER', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png,.docx',
    description: 'Método criativo usando 7 perguntas: Substituir, Combinar, Adaptar, Modificar, Propor outros usos, Eliminar e Reorganizar.',
    templateUrl: 'https://www.mindtools.com/pages/article/newCT_02.htm',
    color: 'from-orange-500 to-amber-600'
  },
  { 
    id: 'mapa_empatia', 
    label: 'Mapa de Empatia', 
    icon: Image, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Ferramenta que ajuda a entender melhor o cliente através de 4 quadrantes: O que pensa, sente, vê, ouve, fala e faz.',
    templateUrl: 'https://www.canva.com/pt_br/criar/mapa-de-empatia/',
    color: 'from-fuchsia-500 to-pink-600'
  },
  { 
    id: 'video_pitch', 
    label: 'Vídeo Pitch', 
    icon: Video, 
    accept: '',
    description: 'Apresentação em vídeo curta (1-3 min) sobre a ideia do projeto, problema identificado e solução proposta.',
    templateUrl: '',
    color: 'from-red-500 to-rose-600',
    isLink: true
  },
  { 
    id: 'persona', 
    label: 'Persona', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Representação fictícia do cliente ideal, baseada em dados reais, incluindo comportamentos, objetivos e desafios.',
    templateUrl: 'https://miro.com/templates/user-persona/',
    color: 'from-amber-500 to-yellow-500'
  }
]

const IdeacaoSection: React.FC<IdeacaoSectionProps> = ({ data, onUpdate }) => {
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({})
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
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

    // Create a File-like object for the link
    const blob = new Blob([link], { type: 'text/plain' })
    const file = blob as any as File
    Object.defineProperty(file, 'name', { value: 'link.txt' })

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

  const isValidVideoUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      // Only allow specific video hosting domains
      return hostname === 'www.youtube.com' || 
             hostname === 'youtube.com' || 
             hostname === 'youtu.be' || 
             hostname === 'www.vimeo.com' || 
             hostname === 'vimeo.com'
    } catch {
      return false
    }
  }

  const handlePreviewFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else if (file.name === 'link.txt') {
      // It's a link stored as a file
      const reader = new FileReader()
      reader.onloadend = () => {
        const link = reader.result as string
        if (isValidVideoUrl(link)) {
          setPreviewVideo(link)
        } else {
          window.open(link, '_blank', 'noopener,noreferrer')
        }
      }
      reader.readAsText(file)
    }
  }

  const getVideoEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      
      // Convert YouTube URLs to embed format
      if (hostname === 'www.youtube.com' || hostname === 'youtube.com') {
        const videoId = urlObj.searchParams.get('v')
        if (videoId) {
          return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`
        }
      } else if (hostname === 'youtu.be') {
        const videoId = urlObj.pathname.slice(1).split('?')[0]
        if (videoId) {
          return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`
        }
      } else if (hostname === 'www.vimeo.com' || hostname === 'vimeo.com') {
        const videoId = urlObj.pathname.slice(1).split('?')[0]
        if (videoId) {
          return `https://player.vimeo.com/video/${encodeURIComponent(videoId)}`
        }
      }
    } catch {
      // Invalid URL, return empty string
    }
    return ''
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
      
      {/* Hero Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Fase 1: Ideação
            </h3>
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full">
              Descoberta
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Explore ideias criativas e identifique oportunidades
          </p>
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Descrição da Fase de Ideação
        </label>
        <textarea
          value={data.descricao}
          onChange={e => onUpdate('descricao', e.target.value)}
          placeholder="Descreva como surgiu a ideia, o brainstorming realizado, o problema identificado e o planejamento inicial...&#10;&#10;• Qual problema foi identificado?&#10;• Como surgiu a ideia?&#10;• Quais técnicas criativas foram usadas?&#10;• Qual é a proposta de valor?"
          rows={8}
          className="w-full border-2 rounded-xl px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 resize-none border-yellow-200 dark:border-yellow-800 bg-white"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Seja criativo e detalhado
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {data.descricao.length} caracteres
          </span>
        </div>
      </div>

      {/* Anexos */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Documentos e Evidências da Ideação
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

                        {/* Upload/Link Area */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {isLink ? 'Cole o link do vídeo:' : 'Anexar arquivo:'}
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
                                  placeholder="https://youtube.com/watch?v=..."
                                  className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                          )}
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
                            {attachments.map(att => {
                              const isImage = att.file.type?.startsWith('image/')
                              const isLinkFile = att.file.name === 'link.txt'
                              const canPreview = isImage || isLinkFile
                              
                              return (
                                <motion.div
                                  key={att.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 10 }}
                                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 group hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm transition-all"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`p-2 bg-gradient-to-br ${type.color} rounded-lg`}>
                                      {isImage ? (
                                        <Image className="w-4 h-4 text-white" />
                                      ) : isLinkFile ? (
                                        <Video className="w-4 h-4 text-white" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-white" />
                                      )}
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
                                  
                                  <div className="flex items-center gap-2">
                                    {canPreview && (
                                      <button
                                        onClick={() => handlePreviewFile(att.file)}
                                        className="px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors"
                                      >
                                        Visualizar
                                      </button>
                                    )}
                                    <button
                                      onClick={() => removeAttachment(att.id)}
                                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                </motion.div>
                              )
                            })}
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

        {/* Dica */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                Dica sobre a Fase de Ideação
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Esta é a fase inicial onde você identifica o problema, gera ideias através de técnicas criativas e define a proposta de valor do projeto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative w-full max-w-6xl max-h-[95vh] flex flex-col">
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-semibold text-white">Prévia da Imagem</h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Imagem */}
            <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded-lg overflow-hidden">
              <img
                src={previewImage}
                alt="Prévia"
                className="max-w-full max-h-[calc(95vh-80px)] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Footer do Modal */}
            <div className="mt-4 px-2">
              <p className="text-xs text-white/60 text-center">
                Clique fora da imagem ou no X para fechar
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && getVideoEmbedUrl(previewVideo) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div className="relative w-full max-w-5xl flex flex-col">
            {/* Header do Modal */}
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-semibold text-white">Prévia do Vídeo</h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Vídeo */}
            <div 
              className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getVideoEmbedUrl(previewVideo)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            </div>
            
            {/* Footer do Modal */}
            <div className="mt-4 px-2">
              <p className="text-xs text-white/60 text-center">
                Clique fora do vídeo ou no X para fechar
              </p>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  )
}

export default IdeacaoSection
