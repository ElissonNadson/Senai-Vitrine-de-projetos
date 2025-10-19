import React, { useState } from 'react'
import { Lightbulb, Upload, X, FileText, Image, Video, AlertCircle, Download, Link as LinkIcon, Info, Check } from 'lucide-react'

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
    color: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'mapa_mental', 
    label: 'Mapa Mental ou Nuvem de Palavras', 
    icon: Image, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Diagrama usado para representar palavras, ideias ou conceitos ligados a um tema central, facilitando a organização do pensamento.',
    templateUrl: 'https://www.canva.com/pt_br/criar/mapas-mentais/',
    color: 'from-pink-500 to-rose-500'
  },
  { 
    id: 'value_proposition', 
    label: 'Proposta de Valor (Value Proposition Canvas)', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Ferramenta que ajuda a entender o que o cliente realmente valoriza e como seu produto/serviço pode atender essas necessidades.',
    templateUrl: 'https://www.strategyzer.com/library/the-value-proposition-canvas',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'customer_journey', 
    label: 'Jornada do Usuário (Customer Journey Map)', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Mapa visual que ilustra a experiência completa do cliente ao interagir com seu produto ou serviço, do início ao fim.',
    templateUrl: 'https://miro.com/templates/customer-journey-map/',
    color: 'from-purple-500 to-indigo-500'
  },
  { 
    id: 'scamper', 
    label: 'Técnica SCAMPER', 
    icon: FileText, 
    accept: '.pdf,.jpg,.jpeg,.png,.docx',
    description: 'Método criativo usando 7 perguntas: Substituir, Combinar, Adaptar, Modificar, Propor outros usos, Eliminar e Reorganizar.',
    templateUrl: 'https://www.mindtools.com/pages/article/newCT_02.htm',
    color: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'mapa_empatia', 
    label: 'Mapa de Empatia', 
    icon: Image, 
    accept: '.pdf,.jpg,.jpeg,.png',
    description: 'Ferramenta que ajuda a entender melhor o cliente através de 4 quadrantes: O que pensa, sente, vê, ouve, fala e faz.',
    templateUrl: 'https://www.canva.com/pt_br/criar/mapa-de-empatia/',
    color: 'from-red-500 to-pink-500'
  },
  { 
    id: 'video_pitch', 
    label: 'Vídeo Pitch', 
    icon: Video, 
    accept: '',
    description: 'Apresentação em vídeo curta (1-3 min) sobre a ideia do projeto, problema identificado e solução proposta.',
    templateUrl: '',
    color: 'from-violet-500 to-purple-500',
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
        if (link.includes('youtube.com') || link.includes('youtu.be') || link.includes('vimeo.com')) {
          setPreviewVideo(link)
        } else {
          window.open(link, '_blank')
        }
      }
      reader.readAsText(file)
    }
  }

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  return (
    <div className="space-y-6">
      
      {/* Hero Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Fase de Ideação 💡
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Conte como surgiu a ideia e o processo criativo do projeto
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
          className="w-full border rounded-xl px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 resize-none border-gray-300 dark:border-gray-600"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 Seja detalhado sobre o processo criativo
          </p>
          <span className={`text-xs font-medium ${
            data.descricao.length > 450 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {data.descricao.length}/500
          </span>
        </div>
      </div>

      {/* Anexos */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Documentos da Ideação 📄
        </h4>

        <div className="grid grid-cols-1 gap-4">
          {attachmentTypes.map((type, index) => {
            const Icon = type.icon
            const attachments = getAttachmentsByType(type.id)
            const isLink = type.isLink || false
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
                  {/* Coluna da Esquerda - Info e Modelo */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
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
                            <span className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-md border border-green-200 dark:border-green-800">
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

                    {/* Botão de Modelo */}
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

                    {/* Arquivos Anexados */}
                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {attachments.length} arquivo(s):
                        </p>
                        {attachments.map(att => {
                          const isImage = att.file.type?.startsWith('image/')
                          const isLink = att.file.name === 'link.txt'
                          const canPreview = isImage || isLink
                          
                          return (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                            <div 
                              className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                              onClick={() => canPreview && handlePreviewFile(att.file)}
                            >
                              {isImage ? (
                                <Image className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              ) : isLink ? (
                                <Video className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                              )}
                              <span className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium">
                                {att.file.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({(att.file.size / 1024).toFixed(1)} KB)
                              </span>
                              {canPreview && (
                                <span className="text-xs text-blue-600 dark:text-blue-400 ml-auto mr-2">
                                  👁️ Preview
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
                        )})}
                      </div>
                    )}
                  </div>

                  {/* Coluna da Direita - Upload/Link */}
                  <div className="lg:w-80">
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {isLink ? 'Cole o link:' : 'Anexar arquivo:'}
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
                              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                          </div>
                          <button
                            onClick={() => handleLinkAdd(type.id)}
                            disabled={!linkInputs[type.id]?.trim()}
                            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dica */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                💡 Dica sobre a Fase de Ideação
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={getVideoEmbedUrl(previewVideo)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default IdeacaoSection
