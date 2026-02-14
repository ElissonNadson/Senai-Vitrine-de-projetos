import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import {
  FileText, Lightbulb, PenTool, Layers, Rocket,
  Upload, X, Image, Video, Link as LinkIcon,
  Info, Check, ChevronDown, ExternalLink, Sparkles,
  FileUp, Trash2, Globe, Paperclip, Loader2, AlertTriangle,
  Lock
} from 'lucide-react'
import { deletarAnexoFase } from '@/api/projetos'

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
  projetoUuid?: string | null
  errors?: Record<string, string>
  onUpdate: (field: string, value: any) => void
}

/* ── Dados completos dos modelos por fase ─────────────────────── */

const phases = [
  {
    id: 'ideacao',
    title: 'Ideação',
    icon: Lightbulb,
    description: 'Fase de brainstorming e concepção da ideia.',
    color: 'yellow',
    tip: 'Use técnicas de brainstorming para explorar o máximo de ideias. Não se preocupe com viabilidade nesta fase — quantidade gera qualidade!',
    suggestions: [
      {
        id: 'crazy8',
        label: 'Crazy 8',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Técnica criativa de brainstorming que consiste em dobrar uma folha em 8 partes e desenhar 8 ideias diferentes em 8 minutos.',
        templateUrl: 'https://www.canva.com/design/DAHBEhikaEQ/Ve05p34ogXrr0RsLllDKMg/edit?utm_content=DAHBEhikaEQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'mapa_mental',
        label: 'Mapa Mental ou Nuvem de Palavras',
        icon: Image,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Diagrama usado para representar palavras, ideias ou conceitos ligados a um tema central, facilitando a organização do pensamento.',
        templateUrl: 'https://miro.com/pt/',
      },
      {
        id: 'value_proposition',
        label: 'Proposta de Valor (Value Proposition Canvas)',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Ferramenta que ajuda a entender o que o cliente realmente valoriza e como seu produto/serviço pode atender essas necessidades.',
        templateUrl: 'https://www.canva.com/design/DAHBEtPjChY/TiGOXeVO4m5dqkxeigFHoQ/edit?utm_content=DAHBEtPjChY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'customer_journey',
        label: 'Jornada do Usuário (Customer Journey Map)',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Mapa visual que ilustra a experiência completa do cliente ao interagir com seu produto ou serviço, do início ao fim.',
        templateUrl: 'https://www.canva.com/design/DAHBEmbfnnA/PcBNnB9WuYudEo4jQ9LeGg/edit?utm_content=DAHBEmbfnnA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'scamper',
        label: 'Técnica SCAMPER',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png,.docx',
        description: 'Método criativo usando 7 perguntas: Substituir, Combinar, Adaptar, Modificar, Propor outros usos, Eliminar e Reorganizar.',
        templateUrl: 'https://www.canva.com/design/DAHBElTf8SQ/Xe_ZOmMWfxD3voYsGMAZvw/edit?utm_content=DAHBElTf8SQ&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'mapa_empatia',
        label: 'Mapa de Empatia',
        icon: Image,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Ferramenta que ajuda a entender melhor o cliente através de 4 quadrantes: O que pensa, sente, vê, ouve, fala e faz.',
        templateUrl: 'https://www.canva.com/design/DAHBEoZEhLA/Z1I2eCw9bfFvuGICv6MWHQ/edit?utm_content=DAHBEoZEhLA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'video_pitch',
        label: 'Vídeo Pitch',
        icon: Video,
        accept: '',
        description: 'Apresentação em vídeo curta (1–3 min) sobre a ideia do projeto, problema identificado e solução proposta.',
        templateUrl: null,
        isLink: true,
      },
      {
        id: 'persona',
        label: 'Persona',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Representação fictícia do cliente ideal, baseada em dados reais, incluindo comportamentos, objetivos e desafios.',
        templateUrl: 'https://www.canva.com/design/DAHBEpnlYBM/hP-cScW-I_VOuN7vLy7yZQ/edit?utm_content=DAHBEpnlYBM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'outros_ideacao',
        label: 'Outros Documentos',
        icon: Paperclip,
        accept: '.pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.zip',
        description: 'Qualquer outro documento relevante da fase de Ideação que não se encaixe nas categorias acima.',
        templateUrl: null,
      },
    ],
  },
  {
    id: 'modelagem',
    title: 'Modelagem',
    icon: PenTool,
    description: 'Planejamento estratégico, viabilidade e estruturação do projeto.',
    color: 'blue',
    tip: 'Planeje o modelo de negócio, analise viabilidade financeira, identifique riscos e crie um cronograma detalhado de execução do projeto.',
    suggestions: [
      {
        id: 'business_canvas',
        label: 'Business Model Canvas',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Ferramenta estratégica que descreve como a empresa cria, entrega e captura valor através de 9 blocos fundamentais.',
        templateUrl: 'https://www.canva.com/design/DAHBEgEVuOY/v3UZgJ_DxzauIs8fxL4lsQ/edit?utm_content=DAHBEgEVuOY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'viabilidade',
        label: 'Planilha de Viabilidade do Projeto',
        icon: FileText,
        accept: '.pdf,.xlsx,.xls',
        description: 'Análise financeira e técnica que demonstra se o projeto é viável, incluindo custos, investimentos e retorno esperado.',
        templateUrl: 'https://docs.google.com/spreadsheets/d/1ru2eNGfkDl3zGUFcYFAB_D_vS53sttiQFuiWX0-OHdg/edit?usp=sharing',
      },
      {
        id: 'swot',
        label: 'Análise SWOT',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png,.docx',
        description: 'Análise das Forças, Fraquezas, Oportunidades e Ameaças do projeto para planejamento estratégico.',
        templateUrl: 'https://www.canva.com/design/DAHBEqdhKSI/XvigODs8Tg3IdcxcG23QPw/edit?utm_content=DAHBEqdhKSI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'matriz_riscos',
        label: 'Matriz de Riscos',
        icon: FileText,
        accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
        description: 'Matriz que identifica, avalia e prioriza riscos do projeto baseado em probabilidade e impacto.',
        templateUrl: 'https://www.canva.com/design/DAHBEoDQTwI/MuLyVwsm0jB6SrnX9WEwlw/edit?utm_content=DAHBEoDQTwI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'cronograma',
        label: 'Cronograma de Execução (Gantt)',
        icon: FileText,
        accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
        description: 'Planejamento temporal com marcos, entregas e responsáveis para acompanhar a execução do projeto.',
        templateUrl: 'https://www.canva.com/design/DAHBEiLQBPE/H0GZUrBQILyGe82PD6yYlg/edit?utm_content=DAHBEiLQBPE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'plano_acao_5w2h',
        label: 'Plano de Ação 5W2H',
        icon: FileText,
        accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
        description: 'Ferramenta de gestão para planejamento de atividades: What, Why, Where, When, Who, How, How much.',
        templateUrl: 'https://www.canva.com/design/DAHBEt_L3As/iuKKMcSPP6oa6dXVFvKDow/edit?utm_content=DAHBEt_L3As&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'canvas_projeto',
        label: 'Canvas de Projeto',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Visão geral do projeto em uma única página, integrando objetivos, justificativa e entregáveis.',
        templateUrl: 'https://www.canva.com/design/DAHBEgQTxnw/OTtdq1iqScATN6iiDnm54w/edit?utm_content=DAHBEgQTxnw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
      },
      {
        id: 'outros_modelagem',
        label: 'Outros Documentos',
        icon: Paperclip,
        accept: '.pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.zip',
        description: 'Qualquer outro documento relevante da fase de Modelagem que não se encaixe nas categorias acima.',
        templateUrl: null,
      },
    ],
  },
  {
    id: 'prototipagem',
    title: 'Prototipagem',
    icon: Layers,
    description: 'Criação de protótipos visuais e funcionais para validar conceitos.',
    color: 'purple',
    tip: 'Crie protótipos visuais e funcionais, desde wireframes de baixa fidelidade até mockups interativos para validar conceitos com usuários.',
    suggestions: [
      {
        id: 'wireframes',
        label: 'Wireframes',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png,.fig',
        description: 'Esboços de baixa fidelidade mostrando layout e estrutura das telas ou produto.',
        templateUrl: 'https://www.figma.com/templates/wireframe-kits/',
      },
      {
        id: 'mockups',
        label: 'Mockups',
        icon: Image,
        accept: '.pdf,.jpg,.jpeg,.png,.fig',
        description: 'Protótipos de alta fidelidade com design visual completo e detalhado.',
        templateUrl: 'https://www.canva.com/templates/?query=mockup',
      },
      {
        id: 'prototipo_interativo',
        label: 'Protótipo Interativo (Figma, Adobe XD, etc.)',
        icon: LinkIcon,
        accept: '',
        description: 'Link de protótipo clicável que simula a experiência de uso do produto.',
        templateUrl: null,
        isLink: true,
      },
      {
        id: 'modelagem_3d',
        label: 'Desenho 3D / Modelagem CAD',
        icon: FileText,
        accept: '.pdf,.stl,.obj,.jpg,.jpeg,.png',
        description: 'Modelagem tridimensional ou desenhos técnicos CAD do produto.',
        templateUrl: 'https://www.tinkercad.com/',
      },
      {
        id: 'maquete_fisica',
        label: 'Fotos ou Vídeo de Maquete Física',
        icon: Image,
        accept: '.jpg,.jpeg,.png,.mp4,.mov',
        description: 'Registro visual de protótipo físico ou maquete do projeto.',
        templateUrl: null,
      },
      {
        id: 'fluxograma',
        label: 'Fluxograma de Processo',
        icon: FileText,
        accept: '.pdf,.jpg,.jpeg,.png',
        description: 'Diagrama que representa o fluxo de processos, navegação ou funcionamento do sistema.',
        templateUrl: 'https://miro.com/templates/flowchart/',
      },
      {
        id: 'outros_prototipagem',
        label: 'Outros Documentos',
        icon: Paperclip,
        accept: '.pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.zip',
        description: 'Qualquer outro documento relevante da fase de Prototipagem que não se encaixe nas categorias acima.',
        templateUrl: null,
      },
    ],
  },
  {
    id: 'implementacao',
    title: 'Implementação',
    icon: Rocket,
    description: 'Desenvolvimento final, testes e validação com usuários reais.',
    color: 'green',
    tip: 'Documente testes realizados, colete feedback de usuários reais e registre a evolução do projeto até o resultado final.',
    suggestions: [
      {
        id: 'video_pitch_impl',
        label: 'Vídeo Pitch Final',
        icon: Video,
        accept: '',
        description: 'Apresentação em vídeo do projeto finalizado, demonstrando resultados e aprendizados.',
        templateUrl: null,
        isLink: true,
      },
      {
        id: 'teste_piloto',
        label: 'Teste Piloto',
        icon: FileText,
        accept: '.pdf,.docx,.jpg,.jpeg,.png',
        description: 'Relatório ou documentação do teste piloto realizado com o produto ou serviço.',
        templateUrl: null,
      },
      {
        id: 'registro_testes',
        label: 'Registro de Testes ou Logs de Uso',
        icon: FileText,
        accept: '.pdf,.txt,.xlsx,.xls',
        description: 'Dados, métricas e logs coletados durante os testes de uso do produto.',
        templateUrl: null,
      },
      {
        id: 'feedback_cliente',
        label: 'Formulário de Feedback do Cliente',
        icon: FileText,
        accept: '.pdf,.xlsx,.xls,.jpg,.jpeg,.png',
        description: 'Questionário ou formulário com respostas de clientes/usuários sobre o projeto.',
        templateUrl: null,
      },
      {
        id: 'entrevista_usuarios',
        label: 'Entrevista com Usuários',
        icon: FileText,
        accept: '.pdf,.docx,.mp3,.mp4',
        description: 'Transcrição, áudio ou vídeo de entrevistas realizadas com usuários finais.',
        templateUrl: null,
      },
      {
        id: 'video_usuarios',
        label: 'Vídeo de Usuários Utilizando o Produto',
        icon: Video,
        accept: '',
        description: 'Link de vídeo mostrando usuários reais interagindo com o produto desenvolvido.',
        templateUrl: null,
        isLink: true,
      },
      {
        id: 'relato_experiencia',
        label: 'Vídeo do Relato de Experiência do Cliente',
        icon: Video,
        accept: '',
        description: 'Depoimento em vídeo de clientes contando suas experiências com o projeto.',
        templateUrl: null,
        isLink: true,
      },
      {
        id: 'outros_implementacao',
        label: 'Outros Documentos',
        icon: Paperclip,
        accept: '.pdf,.jpg,.jpeg,.png,.docx,.xlsx,.pptx,.zip',
        description: 'Qualquer outro documento relevante da fase de Implementação que não se encaixe nas categorias acima.',
        templateUrl: null,
      },
    ],
  },
]

/* ── Cores por fase (safe-listed para Tailwind) ─────────────────── */
const phaseColors: Record<string, {
  tabActive: string
  tabIcon: string
  headerBg: string
  headerIcon: string
  cardIcon: string
  cardIconDone: string
  cardBg: string
  cardBorder: string
  cardLeftBorder: string
  focusRing: string
  tipBg: string
  tipBorder: string
  tipText: string
  tipIcon: string
  badge: string
}> = {
  yellow: {
    tabActive: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-300 shadow-sm',
    tabIcon: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-600 dark:text-yellow-300',
    headerBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    headerIcon: 'text-yellow-600 dark:text-yellow-400',
    cardIcon: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    cardIconDone: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    cardBg: 'bg-amber-50/40 dark:bg-yellow-900/5',
    cardBorder: 'border-yellow-200/60 dark:border-yellow-800/30',
    cardLeftBorder: 'border-l-yellow-400 dark:border-l-yellow-600',
    focusRing: 'focus:ring-yellow-500/20 focus:border-yellow-500',
    tipBg: 'bg-yellow-50 dark:bg-yellow-900/10',
    tipBorder: 'border-yellow-200 dark:border-yellow-800/50',
    tipText: 'text-yellow-800 dark:text-yellow-200',
    tipIcon: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  },
  blue: {
    tabActive: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300 shadow-sm',
    tabIcon: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
    headerBg: 'bg-blue-100 dark:bg-blue-900/30',
    headerIcon: 'text-blue-600 dark:text-blue-400',
    cardIcon: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    cardIconDone: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    cardBg: 'bg-blue-50/40 dark:bg-blue-900/5',
    cardBorder: 'border-blue-200/60 dark:border-blue-800/30',
    cardLeftBorder: 'border-l-blue-400 dark:border-l-blue-600',
    focusRing: 'focus:ring-blue-500/20 focus:border-blue-500',
    tipBg: 'bg-blue-50 dark:bg-blue-900/10',
    tipBorder: 'border-blue-200 dark:border-blue-800/50',
    tipText: 'text-blue-800 dark:text-blue-200',
    tipIcon: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  purple: {
    tabActive: 'bg-purple-50 dark:bg-purple-900/20 border-purple-500 text-purple-700 dark:text-purple-300 shadow-sm',
    tabIcon: 'bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300',
    headerBg: 'bg-purple-100 dark:bg-purple-900/30',
    headerIcon: 'text-purple-600 dark:text-purple-400',
    cardIcon: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    cardIconDone: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    cardBg: 'bg-purple-50/40 dark:bg-purple-900/5',
    cardBorder: 'border-purple-200/60 dark:border-purple-800/30',
    cardLeftBorder: 'border-l-purple-400 dark:border-l-purple-600',
    focusRing: 'focus:ring-purple-500/20 focus:border-purple-500',
    tipBg: 'bg-purple-50 dark:bg-purple-900/10',
    tipBorder: 'border-purple-200 dark:border-purple-800/50',
    tipText: 'text-purple-800 dark:text-purple-200',
    tipIcon: 'text-purple-500',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  green: {
    tabActive: 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300 shadow-sm',
    tabIcon: 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300',
    headerBg: 'bg-green-100 dark:bg-green-900/30',
    headerIcon: 'text-green-600 dark:text-green-400',
    cardIcon: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    cardIconDone: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    cardBg: 'bg-green-50/40 dark:bg-green-900/5',
    cardBorder: 'border-green-200/60 dark:border-green-800/30',
    cardLeftBorder: 'border-l-green-400 dark:border-l-green-600',
    focusRing: 'focus:ring-green-500/20 focus:border-green-500',
    tipBg: 'bg-green-50 dark:bg-green-900/10',
    tipBorder: 'border-green-200 dark:border-green-800/50',
    tipText: 'text-green-800 dark:text-green-200',
    tipIcon: 'text-green-500',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
}

/* ── Componente de dropzone individual ─────────────────────────── */
const FileDropZone: React.FC<{
  phaseId: string
  typeId: string
  accept: string
  onFileAccepted: (phaseId: string, typeId: string, file: File) => void
}> = ({ phaseId, typeId, accept, onFileAccepted }) => {
  const acceptObj: Record<string, string[]> = {}
  if (accept) {
    accept.split(',').forEach(ext => {
      const mime = ext.trim() === '.pdf' ? 'application/pdf'
        : ext.trim() === '.xlsx' || ext.trim() === '.xls' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : ext.trim() === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : ext.trim() === '.pptx' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
              : ext.trim() === '.zip' ? 'application/zip'
                : ext.trim() === '.txt' ? 'text/plain'
                  : ext.trim() === '.mp3' ? 'audio/mpeg'
                    : ext.trim() === '.mp4' ? 'video/mp4'
                      : ext.trim() === '.mov' ? 'video/quicktime'
                        : ext.trim() === '.stl' || ext.trim() === '.obj' ? 'model/*'
                          : ext.trim() === '.fig' ? 'application/octet-stream'
                            : `image/${ext.trim().replace('.', '')}`
      if (!acceptObj[mime]) acceptObj[mime] = []
    })
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach(f => onFileAccepted(phaseId, typeId, f))
    }
  }, [phaseId, typeId, onFileAccepted])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    ...(Object.keys(acceptObj).length > 0 ? { accept: acceptObj } : {}),
  })

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${isDragActive
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]'
        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
        }`}
    >
      <input {...getInputProps()} />
      <div className={`p-2.5 rounded-full mb-2 transition-colors ${isDragActive ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
        <FileUp className={`w-5 h-5 ${isDragActive ? 'text-blue-600' : 'text-gray-400'}`} />
      </div>
      <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
        {isDragActive ? 'Solte o arquivo aqui' : 'Arraste ou clique para enviar'}
      </p>
      {accept && (
        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
          {accept.replace(/\./g, '').toUpperCase().replace(/,/g, ', ')}
        </p>
      )}
    </div>
  )
}

/* ── Componente principal ──────────────────────────────────────── */
const MIN_DESC_CHARS = 50

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ data, projetoUuid, errors = {}, onUpdate }) => {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const [linkInputs, setLinkInputs] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('ideacao')
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  /* ── Verifica se a fase está bloqueada (anterior não concluída) ── */
  const isPhaseComplete = (phaseId: string): boolean => {
    const phaseData = (data[phaseId as keyof typeof data] as PhaseData) || { descricao: '', anexos: [] }
    const hasDesc = (phaseData.descricao?.length || 0) >= MIN_DESC_CHARS
    const hasAnexos = (phaseData.anexos?.length || 0) > 0
    // Todas as fases exigem ambos para estar "Concluída" e desbloquear a próxima
    return hasDesc && hasAnexos
  }

  const isPhaseBlocked = (phaseId: string): boolean => {
    if (phaseId === 'modelagem') return !isPhaseComplete('ideacao')
    if (phaseId === 'prototipagem') return !isPhaseComplete('modelagem')
    if (phaseId === 'implementacao') return !isPhaseComplete('prototipagem')
    return false
  }

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleFileUpload = useCallback((phaseId: string, typeId: string, file: File) => {
    const currentPhaseData = data[phaseId as keyof typeof data] as PhaseData
    const newAttachment: Attachment = {
      id: `${typeId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      file,
      type: typeId,
    }
    const updatedAnexos = [...(currentPhaseData.anexos || []), newAttachment]
    onUpdate(phaseId, { ...currentPhaseData, anexos: updatedAnexos })
  }, [data, onUpdate])

  const handleLinkAdd = (phaseId: string, typeId: string) => {
    const link = linkInputs[typeId]
    if (!link?.trim()) return
    const blob = new Blob([link], { type: 'text/plain' })
    const file = blob as any as File
    Object.defineProperty(file, 'name', { value: 'LINK: ' + link })
    handleFileUpload(phaseId, typeId, file)
    setLinkInputs(prev => ({ ...prev, [typeId]: '' }))
  }

  const removeAttachment = async (phaseId: string, attachmentId: string) => {
    // Verifica se é UUID do banco (formato UUID v4)
    const isPersistedAttachment = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(attachmentId)

    if (isPersistedAttachment && projetoUuid) {
      setDeletingIds(prev => new Set(prev).add(attachmentId))
      try {
        await deletarAnexoFase(projetoUuid, attachmentId)
      } catch (error) {
        console.error('Erro ao remover anexo:', error)
        setDeletingIds(prev => { const s = new Set(prev); s.delete(attachmentId); return s })
        return
      }
      setDeletingIds(prev => { const s = new Set(prev); s.delete(attachmentId); return s })
    }

    const currentPhaseData = data[phaseId as keyof typeof data] as PhaseData
    const updatedAnexos = currentPhaseData.anexos.filter(att => att.id !== attachmentId)
    onUpdate(phaseId, { ...currentPhaseData, anexos: updatedAnexos })
  }

  const handlePhaseUpdate = (phase: string, field: string, value: any) => {
    const currentData = (data[phase as keyof typeof data] as PhaseData) || { descricao: '', anexos: [] }
    onUpdate(phase, { ...currentData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">

        {/* ── Tabs Header ───────────────────────────────── */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2 p-4">
            {phases.map((phase) => {
              const Icon = phase.icon
              const isActive = activeTab === phase.id
              const hasError = !!errors[phase.id]
              const colors = phaseColors[phase.color]
              const phaseData = (data[phase.id as keyof typeof data] as PhaseData) || { descricao: '', anexos: [] }
              const attachCount = phaseData.anexos?.length || 0
              const hasDescComplete = (phaseData.descricao?.length || 0) >= 50
              const hasAnexos = attachCount > 0
              const isPhaseComplete = hasDescComplete && hasAnexos
              const isPhasePartial = (hasDescComplete && !hasAnexos) || (!hasDescComplete && hasAnexos)

              const blocked = isPhaseBlocked(phase.id)

              return (
                <button
                  key={phase.id}
                  onClick={() => setActiveTab(phase.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold transition-all duration-200 ${isActive
                    ? colors.tabActive
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    } ${hasError ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : ''}`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive ? colors.tabIcon : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                    {blocked ? <Lock className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-sm">{phase.title}</span>
                  {blocked && <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 ml-0.5" />}
                  {!blocked && attachCount > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                      {attachCount}
                    </span>
                  )}
                  {!blocked && isPhaseComplete && <Check className="w-4 h-4 text-green-500 ml-0.5" />}
                  {!blocked && isPhasePartial && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 ml-0.5" />}
                  {hasError && <Info className="w-4 h-4 text-red-500 ml-1" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Tab Content ───────────────────────────────── */}
        <div className="p-6">
          {phases.map((phase) => {
            if (phase.id !== activeTab) return null

            const phaseData = (data[phase.id as keyof typeof data] as PhaseData) || { descricao: '', anexos: [] }
            const hasError = !!errors[phase.id]
            const colors = phaseColors[phase.color]

            const blocked = isPhaseBlocked(phase.id)

            return (

              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Banner de Bloqueio */}
                {blocked && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl dark:bg-amber-900/20 dark:border-amber-600">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Lock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-amber-700 dark:text-amber-200 font-medium">
                          Modo de Visualização - Fase Bloqueada
                        </p>
                        <p className="text-sm text-amber-600 dark:text-amber-300/80 mt-1">
                          Para editar esta etapa, você precisa primeiro concluir a fase anterior
                          (preenchendo a descrição e enviando pelo menos um anexo).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Header da Fase */}
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-2xl ${colors.headerBg}`}>
                    <phase.icon className={`w-8 h-8 ${colors.headerIcon}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{phase.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{phase.description}</p>
                  </div>
                </div>

                {/* Descrição da Fase */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição da Fase</label>
                    <span className={`text-xs font-medium ${(phaseData.descricao?.length || 0) < 50 ? 'text-orange-500' : 'text-green-500'}`}>
                      {phaseData.descricao?.length || 0}/50 caracteres
                    </span>
                  </div>
                  <textarea
                    value={phaseData.descricao || ''}
                    onChange={(e) => handlePhaseUpdate(phase.id, 'descricao', e.target.value)}
                    placeholder={blocked ? 'Conclua a fase anterior para adicionar uma descrição...' : `Descreva o que foi feito na fase de ${phase.title.toLowerCase()}...`}
                    className={`w-full border rounded-xl px-4 py-3 text-sm ${colors.focusRing} focus:ring-2 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-colors ${hasError ? 'border-red-300' : 'border-gray-200'} ${blocked ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : ''}`}
                    rows={4}
                    disabled={blocked}
                  />
                  {hasError && <p className="text-red-500 text-sm mt-1">{errors[phase.id]}</p>}
                </div>

                {/* ── Lista de Modelos / Anexos ──────────── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Documentos e Anexos
                    </label>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {phaseData.anexos?.length || 0} anexo(s) adicionado(s)
                    </span>
                  </div>

                  <div className="space-y-3">
                    {phase.suggestions.map((suggestion, idx) => {
                      const SugIcon = suggestion.icon
                      const cardKey = `${phase.id}-${suggestion.id}`
                      const attachments = phaseData.anexos?.filter(att => att.type === suggestion.id) || []
                      const hasAttachment = attachments.length > 0
                      const isExpanded = expandedCards[cardKey]
                      const isLinkType = 'isLink' in suggestion && suggestion.isLink

                      return (
                        <motion.div
                          key={suggestion.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className={`border border-l-[3px] rounded-2xl transition-all duration-200 ${hasAttachment
                            ? `border-green-300 dark:border-green-700 border-l-green-500 dark:border-l-green-500 bg-green-50/50 dark:bg-green-900/10 shadow-sm`
                            : `${colors.cardBorder} ${colors.cardLeftBorder} ${colors.cardBg} hover:shadow-sm`
                            }`}
                        >
                          {/* Card Header */}
                          <div
                            className="flex items-center gap-3 p-4 cursor-pointer group"
                            onClick={() => toggleCard(cardKey)}
                          >
                            {/* Ícone */}
                            <div className={`p-2.5 rounded-xl flex-shrink-0 ${hasAttachment ? colors.cardIconDone : colors.cardIcon}`}>
                              {isLinkType ? <Globe className="w-5 h-5" /> : <SugIcon className="w-5 h-5" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                  {suggestion.label}
                                </h4>
                                {isLinkType && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                    Link
                                  </span>
                                )}
                                {hasAttachment && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-0.5">
                                    <Check className="w-3 h-3" />
                                    {attachments.length}
                                  </span>
                                )}
                              </div>
                              {!isExpanded && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                  {suggestion.description}
                                </p>
                              )}
                            </div>

                            {/* Botão Usar Modelo (visível sem expandir) */}
                            {suggestion.templateUrl && (
                              <a
                                href={suggestion.templateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-semibold text-xs transition-colors flex-shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Ver modelo
                              </a>
                            )}

                            {/* Chevron */}
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>

                          {/* Card Expandido */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 space-y-3 border-t border-gray-100 dark:border-gray-700/50 pt-3">
                                  {/* Descrição completa */}
                                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {suggestion.description}
                                  </p>

                                  {/* Banner modelo recomendado */}
                                  {suggestion.templateUrl && (
                                    <a
                                      href={suggestion.templateUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all group/modelo"
                                    >
                                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/50 flex-shrink-0">
                                        <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Ver modelo recomendado</p>
                                        <p className="text-[11px] text-blue-500 dark:text-blue-400/70">Use como referência para elaborar seu documento</p>
                                      </div>
                                      <ChevronDown className="w-4 h-4 text-blue-400 dark:text-blue-500 -rotate-90 group-hover/modelo:translate-x-0.5 transition-transform flex-shrink-0" />
                                    </a>
                                  )}

                                  {/* Arquivos anexados */}
                                  {hasAttachment && (
                                    <div className="space-y-2">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                        Arquivos anexados
                                      </span>
                                      {attachments.map(att => (
                                        <div key={att.id} className="flex items-center gap-2 text-xs bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-600 group/file">
                                          <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                          <span className="truncate flex-1 text-gray-700 dark:text-gray-300 font-medium">{att.file.name}</span>
                                          <button
                                            onClick={(e) => { e.stopPropagation(); removeAttachment(phase.id, att.id) }}
                                            disabled={deletingIds.has(att.id)}
                                            className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-60 group-hover/file:opacity-100 disabled:opacity-40"
                                          >
                                            {deletingIds.has(att.id) ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Upload ou Link */}
                                  {isLinkType ? (
                                    <div className="flex gap-2">
                                      <div className="relative flex-1">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                          type="url"
                                          placeholder="https://..."
                                          className={`w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${blocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                          value={linkInputs[suggestion.id] || ''}
                                          onChange={e => setLinkInputs(prev => ({ ...prev, [suggestion.id]: e.target.value }))}
                                          onKeyDown={e => { if (e.key === 'Enter') handleLinkAdd(phase.id, suggestion.id) }}
                                          disabled={blocked}
                                        />
                                      </div>
                                      <button
                                        onClick={() => handleLinkAdd(phase.id, suggestion.id)}
                                        disabled={!linkInputs[suggestion.id]?.trim() || blocked}
                                        className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                      >
                                        Adicionar
                                      </button>
                                    </div>
                                  ) : (
                                    blocked ? (
                                      <div className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 opacity-60">
                                        <Lock className="w-5 h-5 text-gray-400 mb-2" />
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 text-center">
                                          Upload bloqueado nesta fase
                                        </p>
                                      </div>
                                    ) : (
                                      <FileDropZone
                                        phaseId={phase.id}
                                        typeId={suggestion.id}
                                        accept={suggestion.accept}
                                        onFileAccepted={handleFileUpload}
                                      />
                                    )
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

                {/* ── Dica da Fase ──────────────────────────── */}
                <div className={`flex items-start gap-3 p-4 rounded-2xl border ${colors.tipBg} ${colors.tipBorder}`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 ${colors.tipBg}`}>
                    <Sparkles className={`w-5 h-5 ${colors.tipIcon}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${colors.tipText} mb-0.5`}>
                      Dica sobre a fase de {phase.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {phase.tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Modal removed as navigation is now allowed */}
    </div>
  )
}

export default AttachmentsSection
