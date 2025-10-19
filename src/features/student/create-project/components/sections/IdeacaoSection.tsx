import React, { useState } from 'react'
import { motion } from 'framer-motion'
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

  return (
    <div className="space-y-6">
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 md:p-12 shadow-lg border-2 border-yellow-200 dark:border-yellow-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <motion.div 
            className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Lightbulb className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Fase de Ideação 💡
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Conte como surgiu a ideia e o processo criativo do projeto
            </p>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
            Descrição da Fase de Ideação
          </label>
          <textarea
            value={data.descricao}
            onChange={e => onUpdate('descricao', e.target.value)}
            placeholder="Descreva como surgiu a ideia, o brainstorming realizado, o problema identificado e o planejamento inicial...&#10;&#10;• Qual problema foi identificado?&#10;• Como surgiu a ideia?&#10;• Quais técnicas criativas foram usadas?&#10;• Qual é a proposta de valor?"
            rows={10}
            className="w-full border-2 rounded-2xl px-6 py-4 text-base transition-all focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 resize-none border-gray-300 dark:border-gray-600 hover:border-gray-400"
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 Seja detalhado sobre o processo criativo
            </p>
            <span className={`text-sm font-medium ${
              data.descricao.length > 450 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {data.descricao.length}/500
            </span>
          </div>
        </div>
      </motion.div>

      {/* Anexos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl">
            <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Documentos da Ideação 📄
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Adicione os documentos criados nesta fase
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {attachmentTypes.map((type, index) => {
            const Icon = type.icon
            const attachments = getAttachmentsByType(type.id)
            const isLink = type.isLink || false
            const hasAttachment = attachments.length > 0
            const isDragging = dragOver === type.id

            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.03 }}
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
              </motion.div>
            )
          })}
        </div>

        {/* Dica */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
        >
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
        </motion.div>
      </motion.div>

    </div>
  )
}

export default IdeacaoSection
