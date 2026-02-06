import React, { useState } from 'react'
import {
  Search,
  HelpCircle,
  FileText,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  PlayCircle,
  Book,
  PlusCircle,
  Edit,
  Eye,
  Palette,
  UserCircle,
  Target,
  TrendingUp,
  Download,
  ChevronDown,
  Play,
  BookOpen,
  Video,
  Users,
  Lightbulb
} from 'lucide-react'
import { PageBanner } from '@/components/common/PageBanner'

// Tipos
interface HelpSection {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  content: React.ReactNode
}

interface FAQ {
  question: string
  answer: string
}

interface VideoGuide {
  id: string
  title: string
  duration: string
  thumbnail: string
  description: string
  videoUrl: string
}

const HelpPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Vídeos tutoriais
  const videoGuides: VideoGuide[] = [
    {
      id: '1',
      title: 'Como Criar seu Primeiro Projeto',
      duration: '5:30',
      thumbnail: 'bg-gradient-to-br from-blue-500 to-purple-600',
      description: 'Aprenda passo a passo como criar e publicar seu primeiro projeto na vitrine.',
      videoUrl: 'https://www.youtube.com/watch?v=zpQ-x7P1tRU'
    },
    {
      id: '2',
      title: 'Editando e Melhorando seu Projeto',
      duration: '7:15',
      thumbnail: 'bg-gradient-to-br from-green-500 to-teal-600',
      description: 'Descubra como editar informações, adicionar imagens e melhorar a apresentação.',
      videoUrl: 'https://www.youtube.com/watch?v=EsSfLlcYwIY'
    },
    {
      id: '3',
      title: 'Navegando pelos Projetos da Comunidade',
      duration: '4:45',
      thumbnail: 'bg-gradient-to-br from-orange-500 to-red-600',
      description: 'Explore projetos de outros alunos, deixe comentários e curtidas.',
      videoUrl: 'https://www.youtube.com/watch?v=eDjIG4XV-TQ'
    },
    {
      id: '4',
      title: 'Gerenciando as Etapas do Projeto',
      duration: '6:20',
      thumbnail: 'bg-gradient-to-br from-purple-500 to-pink-600',
      description: 'Entenda como organizar e completar cada etapa do desenvolvimento.',
      videoUrl: 'https://www.youtube.com/watch?v=Uv7o-7nhFC8'
    }
  ]

  // FAQs
  const faqs: FAQ[] = [
    {
      question: 'O que é a Vitrine de Projetos SENAI?',
      answer: 'A Vitrine de Projetos SENAI é uma plataforma digital onde alunos podem documentar, compartilhar e apresentar seus projetos desenvolvidos durante o curso. É um portfólio online que permite mostrar suas habilidades e conquistas para colegas, docentes e potenciais empregadores.'
    },
    {
      question: 'Como faço para criar um novo projeto?',
      answer: 'Clique no botão "Novo Projeto" no menu lateral ou no dashboard. Preencha as informações básicas como título, descrição, tecnologias utilizadas e faça o upload de imagens. Você pode salvar como rascunho e publicar quando estiver pronto.'
    },
    {
      question: 'Posso editar meu projeto depois de publicado?',
      answer: 'Sim! Você pode editar seu projeto a qualquer momento. Acesse "Meus Projetos", selecione o projeto desejado e clique em "Editar". As alterações serão salvas imediatamente.'
    },
    {
      question: 'Como funcionam as etapas do projeto?',
      answer: 'Cada projeto é dividido em etapas que seguem a metodologia de desenvolvimento: Planejamento, Desenvolvimento, Testes, Apresentação, etc. Complete cada etapa marcando como concluída e anexando documentos relevantes.'
    },
    {
      question: 'O que é um CANVAS de Modelo de Negócio?',
      answer: 'O Canvas de Modelo de Negócio é utilizado para organizar e visualizar, de forma colaborativa, os principais elementos do projeto — como proposta de valor, público-alvo, recursos, atividades e parcerias — favorecendo o alinhamento da equipe, a análise da viabilidade e o aprimoramento da ideia antes de sua implementação.'
    },
    {
      question: 'O que é uma Persona?',
      answer: 'Persona é um personagem fictício criado para representar seu público-alvo. Inclui informações como idade, profissão, necessidades e desafios. Criar personas ajuda a entender melhor para quem você está desenvolvendo o projeto.'
    },
    {
      question: 'Como visualizo projetos de outros alunos?',
      answer: 'Vá até a seção "Explorar Projetos" no menu. Você pode filtrar por categoria, tecnologia ou curso. Clique em qualquer projeto para ver detalhes completos, deixar comentários e curtidas.'
    },
    {
      question: 'Como anexo documentos e arquivos?',
      answer: 'Na edição do projeto ou nas etapas, você encontrará áreas de upload. Clique em "Adicionar Arquivo" e selecione documentos (PDF, Word, etc.) ou imagens. Cada etapa pode ter seus próprios anexos.'
    },
    {
      question: 'Meu projeto aparece para todos?',
      answer: 'Projetos publicados são visíveis para toda a comunidade SENAI (alunos e docentes). Se preferir, pode manter como rascunho ou privado até estar pronto para compartilhar.'
    }
  ]

  // Seções de ajuda
  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: 'Visão Geral',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Conheça a plataforma e seus recursos',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Bem-vindo à Vitrine de Projetos SENAI! 🎓
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              A Vitrine de Projetos é sua plataforma para documentar, compartilhar e destacar todos os projetos que você desenvolve durante sua jornada no SENAI. Aqui você pode:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                  <PlusCircle className="h-5 w-5 text-primary dark:text-primary-light" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Criar Projetos
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Documente seus projetos com descrições, imagens e tecnologias utilizadas.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Edit className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Editar e Atualizar
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mantenha seus projetos sempre atualizados com as últimas melhorias.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Explorar Projetos
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Veja projetos incríveis de outros alunos e se inspire.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Colaborar
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Trabalhe em equipe e participe de projetos colaborativos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-lg p-6 border border-primary/30">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Dica Importante
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Use a Vitrine de Projetos como seu portfólio profissional! Empregadores valorizam candidatos que conseguem demonstrar suas habilidades através de projetos reais. Mantenha seus projetos organizados e bem documentados.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'videos',
      title: 'Vídeos Tutoriais',
      icon: <Video className="h-5 w-5" />,
      description: 'Assista guias em vídeo passo a passo',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Tutoriais em Vídeo 🎥
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Assista nossos vídeos tutoriais para aprender rapidamente como usar a plataforma.
            </p>
          </div>

          {/* Vídeo em Destaque */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md">
            <div className="bg-gradient-to-r from-primary to-blue-600 dark:from-primary-light dark:to-blue-500 p-4">
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                <Play className="h-5 w-5" />
                Vídeo em Destaque
              </h4>
              <p className="text-white/90 text-sm mt-1">Como Criar seu Primeiro Projeto</p>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/zpQ-x7P1tRU?si=q7qv00gXfEnqEgMx"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Aprenda passo a passo como criar e publicar seu primeiro projeto na vitrine SENAI.
              </p>
            </div>
          </div>

          {/* Título dos outros vídeos */}
          <div className="pt-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Mais Tutoriais
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoGuides.map((video) => (
              <div
                key={video.id}
                className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Video Embed */}
                <div className="relative aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${video.videoUrl.split('v=')[1]}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                    {video.duration}
                  </div>
                </div >

                {/* Content */}
                < div className="p-4" >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {video.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {video.description}
                  </p>
                </div >
              </div >
            ))}
          </div >
        </div >
      )
    },
    {
      id: 'guides',
      title: 'Guias e Documentação',
      icon: <FileText className="h-5 w-5" />,
      description: 'Materiais de referência e guias detalhados',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Materiais de Apoio 📚
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Baixe nossos guias em PDF para consulta offline e referência rápida.
            </p>
          </div>

          <div className="grid gap-4">
            {/* Canvas Guide */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                  <Palette className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Guia Completo: Canvas de Projeto
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Aprenda a criar um Canvas efetivo para planejar seu projeto. Inclui template editável e exemplos práticos de projetos SENAI.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">PDF • 2.5 MB • 15 páginas</span>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Persona Guide */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                  <UserCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Como Criar Personas Efetivas
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Entenda o que são personas, por que são importantes e como criar personas realistas para seu projeto. Inclui templates e exemplos.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">PDF • 1.8 MB • 10 páginas</span>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Project Stages Guide */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex-shrink-0">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Etapas do Projeto: Guia Completo
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Documentação detalhada sobre cada etapa do desenvolvimento: planejamento, execução, testes e apresentação. Com checklists e dicas.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">PDF • 3.2 MB • 20 páginas</span>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Melhores Práticas para Documentação
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Dicas e técnicas para documentar seus projetos de forma profissional. Aprenda a escrever descrições impactantes e apresentar resultados.
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 dark:text-gray-400">PDF • 1.5 MB • 12 páginas</span>
                  </div>
                  <button className="mt-3 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Perguntas Frequentes',
      icon: <HelpCircle className="h-5 w-5" />,
      description: 'Respostas para dúvidas comuns',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Perguntas Frequentes ❓
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Encontre respostas rápidas para as dúvidas mais comuns sobre a plataforma.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {expandedFAQ === index ? (
                    <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )
    }
  ]

  const activeContent = helpSections.find(section => section.id === activeSection)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <PageBanner
        title="Central de Ajuda"
        subtitle="Tudo que você precisa saber sobre a Vitrine de Projetos"
        icon={<HelpCircle />}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8 relative z-20">

        {/* Search Bar - Moved to card overlapping banner */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar ajuda..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Content */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1 sticky top-8">
              {helpSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${activeSection === section.id
                    ? 'bg-primary dark:bg-primary-light text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                >
                  <span className={activeSection === section.id ? 'text-white' : ''}>
                    {section.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{section.title}</div>
                    <div className={`text-xs mt-0.5 truncate ${activeSection === section.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {section.description}
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
              {activeContent?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
