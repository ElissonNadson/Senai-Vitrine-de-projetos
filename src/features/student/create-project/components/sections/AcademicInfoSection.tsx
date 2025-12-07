import React, { useState, useEffect, useMemo } from 'react'
import { FileText, GraduationCap, BookOpen, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCursos, useTurmasByCurso } from '@/hooks/use-queries'

interface AcademicInfoSectionProps {
  data: {
    curso: string
    turma: string
    modalidade: string
    itinerario: string
    unidadeCurricular: string
    senaiLab: string
    sagaSenai: string
  }
  onUpdate: (field: string, value: string) => void
  isStudent?: boolean
}

const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({ data, onUpdate, isStudent = false }) => {
  // Queries
  const { data: cursosData = [], isLoading: isLoadingCursos } = useCursos()

  // Encontrar UUID do curso selecionado para buscar turmas
  const selectedCursoUuid = useMemo(() => {
    if (!data.curso || !cursosData) return null
    const curso = cursosData.find((c: any) => c.nome === data.curso)
    return curso?.uuid
  }, [data.curso, cursosData])

  const { data: turmasData = [], isLoading: isLoadingTurmas } = useTurmasByCurso(selectedCursoUuid!, {
    enabled: !!selectedCursoUuid
  })

  // Fallback hardcoded APENAS para Unidades Curriculares (já que a API não fornece ainda)
  const cursosHardcoded = [
    {
      nome: "Técnico em Administração",
      turmas: ["93626", "96167", "99151"],
      unidades: [
        "Criatividade e ideação em projetos",
        "Fundamentos de Administração",
        "Gestão Ambiental e da Qualidade",
        "Introdução a Indústria 4.0",
        "Introdução a Processos de Melhoria e Inovação",
        "Introdução a Qualidade e Produtividade",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Introdução ao Desenvolvimento de Projetos",
        "Introdução à Gestão Organizacional",
        "Modelagem de Projetos",
        "Planejamento e Monitoramento de Atividades Administrativas",
        "Processos Administrativos de Apoio Contábil e Financeiro",
        "Processos Administrativos de Marketing e Vendas",
        "Processos Administrativos de RH e DP",
        "Processos Administrativos na Produção e Logística",
        "Processos Administrativos no Apoio a Projetos",
        "Prototipagem de Projetos",
        "Saúde e Segurança no Trabalho",
        "Sustentabilidade nos Processos Industriais"
      ]
    },
    {
      nome: "Técnico em Desenvolvimento de Sistemas",
      turmas: ["91133", "91134", "91135", "93627", "93629", "96168", "96170", "99162", "99165"],
      unidades: [
        "Banco de Dados",
        "Criatividade e ideação em projetos",
        "Desenvolvimento de Sistemas",
        "Fundamentos de Eletroeletrônica Aplicada",
        "Implantação de Sistemas",
        "Implementação de Projetos",
        "Interface Homem-Computador",
        "Internet das Coisas",
        "Introdução a Indústria 4.0",
        "Introdução a Qualidade e Produtividade",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Introdução ao Desenvolvimento de Projetos",
        "Lógica de Programação",
        "Manutenção de Sistemas",
        "Modelagem de Projetos",
        "Modelagem de Sistemas",
        "Prototipagem de Projetos",
        "Programação de Aplicativos",
        "Saúde e Segurança no Trabalho",
        "Sustentabilidade nos Processos Industriais",
        "Teste de Sistemas"
      ]
    },
    {
      nome: "Técnico em Eletromecânica",
      turmas: ["91382", "91383", "91463", "93630", "93631", "96172", "96173", "99169", "99171"],
      unidades: [
        "Controladores Lógicos Programáveis",
        "Criatividade e Ideação em Projetos",
        "Elementos de Máquinas",
        "Fabricação Mecânica Aplicada à Manutenção e à Montagem",
        "Fundamentos da Eletricidade Industrial",
        "Fundamentos da Tecnologia Mecânica",
        "Implementação de Projetos",
        "Introdução a Indústria 4.0",
        "Introdução a Qualidade e Produtividade",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Introdução ao Desenvolvimento de Projetos",
        "Introdução à Fabricação Mecânica",
        "Manutenção de Sistemas Automatizados",
        "Manutenção Elétrica de Máquinas e Equipamentos",
        "Manutenção Mecânica de Máquinas e Equipamentos",
        "Modelagem de Projetos",
        "Montagem de Sistemas Elétricos",
        "Montagem de Sistemas Mecânicos",
        "Organização da Produção Mecânica",
        "Planejamento e Controle da Manutenção",
        "Projeto de Inovação em Eletromecânica",
        "Prototipagem de Projetos",
        "Saúde e Segurança no Trabalho",
        "Sustentabilidade nos Processos Industriais"
      ]
    },
    {
      nome: "Técnico em Eletrotécnica",
      turmas: ["91140", "91141", "92378", "93633", "93634", "96174", "96175", "96181", "99175", "100440"],
      unidades: [
        "Criatividade e ideação em Projetos",
        "Desenho Técnico Aplicado a Projetos Elétricos",
        "Eficiência Energética",
        "Fundamentos de Eletricidade",
        "Fundamentos de Sistemas Elétricos",
        "Gestão Operacional Integrada",
        "Implementação de Projetos",
        "Instalação e Manutenção Elétrica Predial",
        "Instalações de Sistemas Elétricos de Potencia - SEP",
        "Instalações e Acionamentos Elétricos Industriais",
        "Integração de Sistemas de Energias Renováveis",
        "Integração de Sistemas Elétricos Automatizados",
        "Introdução a Indústria 4.0",
        "Introdução a Qualidade e Produtividade",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Introdução ao Desenvolvimento de Projetos",
        "Manutenção e Operação de Sistemas Elétricos de Potência - SEP",
        "Manutenção Elétrica Industrial",
        "Modelagem de Projetos",
        "Projetos de Instalações Elétricas de Potencia",
        "Projetos Elétricos Industriais",
        "Projetos Elétricos Prediais",
        "Prototipagem de Projetos",
        "Saúde e Segurança no Trabalho",
        "Sustentabilidade nos Processos Industriais"
      ]
    },
    {
      nome: "Técnico em Logística",
      turmas: ["93635", "96176", "99177"],
      unidades: [
        "Criatividade e ideação em projetos",
        "Gestão da Produção",
        "Gestão de Suprimentos",
        "Gestão de Transporte e Distribuição",
        "Implementação de Projetos",
        "Introdução a Indústria 4.0",
        "Introdução a Qualidade e Produtividade",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Introdução ao Desenvolvimento de Projetos",
        "Introdução aos Processos Logísticos",
        "Logística Integrada",
        "Logística Sustentável",
        "Métodos Quantitativos Aplicados à Logística",
        "Modelagem de Projetos",
        "Processos de Armazenagem",
        "Prototipagem de Projetos",
        "Saúde e Segurança no Trabalho",
        "Sustentabilidade nos Processos Industriais"
      ]
    },
    {
      nome: "Técnico em Manutenção Automotiva",
      turmas: ["91384", "93637", "96177", "99182", "100523"],
      unidades: [
        "Criatividade e ideação em projetos",
        "Diagnósticos Avançados em Sistemas Automotivos",
        "Fundamentos e Tecnologias da Carroceria Automotiva",
        "Gestão da Manutenção Automotiva",
        "Implementação de Projetos",
        "Inspeção Veicular",
        "Introdução a Indústria 4.0",
        "Introdução a Qualidade e Produtividade",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Introdução à Eletromobilidade",
        "Introdução ao Desenvolvimento de Projetos",
        "Introdução às Tecnologias e Processos da Manutenção Eletromecânica Automotiva",
        "Modelagem de Projetos",
        "Motores de Combustão Interna",
        "Prototipagem de Projetos",
        "Saúde e Segurança no Trabalho",
        "Sistemas de Freios, Suspensão e Direção",
        "Sistemas de Transmissão de Veículos",
        "Sistemas Eletroeletrônicos Automotivos",
        "Sustentabilidade nos Processos Industriais",
        "Vistoria de Sinistros e Cautelar"
      ]
    },
    {
      nome: "Técnico em Química",
      turmas: ["91386", "96183", "99184"],
      unidades: [
        "Análises Instrumentais",
        "Análises Microbiológicas",
        "Ciências Aplicadas à Segurança e Saúde do Trabalho",
        "Criatividade e Ideação em Projetos",
        "Desenvolvimento de Métodos Analíticos, Produtos e Processos",
        "Físico-química Aplicada",
        "Fundamentos das Técnicas Laboratoriais",
        "Fundamentos de Bioquímica e Microbiologia",
        "Fundamentos de Matemática e Física",
        "Fundamentos de Processos Químicos Industriais",
        "Fundamentos de Química Geral e Inorgânica",
        "Fundamentos de Química Orgânica",
        "Gestão de Pessoas",
        "Implementação de Projetos",
        "Introdução a Indústria 4.0",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Modelagem de Projetos",
        "Química Analítica",
        "Química Orgânica Experimental",
        "Saúde e Segurança no Trabalho",
        "Sustentabilidade nos Processos Industriais"
      ]
    },
    {
      nome: "Técnico em Segurança do Trabalho",
      turmas: ["91143", "93640", "96180", "99185"],
      unidades: [
        "Assessoria e Consultoria em Saúde, Segurança e Meio Ambiente do Trabalho",
        "Ciências Aplicadas à Segurança e Saúde do Trabalho",
        "Comunicação e Informação aplicadas à Segurança e Saúde do Trabalho",
        "Coordenação de Programas e Procedimentos de Saúde e Segurança do Trabalho",
        "Criatividade e ideação em projetos",
        "Ergonomia",
        "Fundamentos de Segurança e Saúde do Trabalho",
        "Gestão de Auditorias em de Segurança e Saúde do Trabalho",
        "Gestão de Emergências em SST",
        "Gestão de Pessoas aplicada à Segurança e Saúde do Trabalho",
        "Higiene Ocupacional",
        "Implementação de Projetos",
        "Introdução a Indústria 4.0",
        "Introdução a Qualidade e Produtividade",
        "Introdução a Tecnologia da Informação e Comunicação",
        "Introdução ao Desenvolvimento de Projetos",
        "Leitura e Interpretação de Desenho Técnico",
        "Modelagem de Projetos",
        "Monitoramento dos Programas e Documentos de Segurança e Saúde do Trabalho",
        "Planejamento e Execução de Ações Educativas",
        "Prototipagem de Projetos",
        "Rotinas de Segurança e Saúde do Trabalho",
        "Saúde e Segurança no Trabalho",
        "Sustentabilidade nos Processos Industriais"
      ]
    }
  ]



  // Atualizar unidades quando o curso mudar (usando fallback hardcoded)
  useEffect(() => {
    if (data.curso) {
      const cursoSelecionado = cursosHardcoded.find(c => c.nome === data.curso)
      if (cursoSelecionado) {
        setUnidadesDisponiveis(cursoSelecionado.unidades)
        if (!cursoSelecionado.unidades.includes(data.unidadeCurricular)) {
          onUpdate('unidadeCurricular', '')
        }
      } else {
        setUnidadesDisponiveis([])
      }
    } else {
      setUnidadesDisponiveis([])
    }
  }, [data.curso])

  // Estado local para unidades (já que vem do hardcoded)
  const [unidadesDisponiveis, setUnidadesDisponiveis] = useState<string[]>([])

  return (
    <div className="space-y-6">
      {/* Informações Acadêmicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 md:p-10 shadow-lg border-2 border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Informações Acadêmicas
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Dados do seu curso e turma no SENAI
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Grid de 2 colunas - Curso e Turma */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Curso */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Curso <span className="text-red-500">*</span>
              </label>
              <select
                value={data.curso}
                onChange={e => onUpdate('curso', e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:border-gray-300 ${isStudent ? 'opacity-70 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''}`}
                disabled={isStudent}
              >
                <option value="">Selecione um curso</option>
                {cursosData.map((curso: any) => (
                  <option key={curso.uuid} value={curso.nome}>{curso.nome}</option>
                ))}
              </select>
            </div>

            {/* Turma */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Turma <span className="text-red-500">*</span>
              </label>
              <select
                value={data.turma}
                onChange={e => onUpdate('turma', e.target.value)}
                disabled={!data.curso}
                className="w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {data.curso ? (isLoadingTurmas ? 'Carregando turmas...' : 'Selecione uma turma') : 'Selecione um curso primeiro'}
                </option>
                {turmasData.map((turma: any) => (
                  <option key={turma.uuid} value={turma.codigo}>{turma.codigo}</option>
                ))}
              </select>
              {data.curso && turmasData.length === 0 && !isLoadingTurmas && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Nenhuma turma disponível para este curso
                </p>
              )}
            </div>
          </div>

          {/* Grid de 2 colunas - Modalidade e Unidade Curricular */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Modalidade */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                Modalidade
                <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:border-gray-300"
                value={data.modalidade}
                onChange={e => onUpdate('modalidade', e.target.value)}
              >
                <option value="">Selecione a modalidade</option>
                <option value="Presencial">Presencial</option>
                <option value="Semipresencial">Semipresencial</option>
              </select>
            </div>

            {/* Unidade Curricular */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Unidade Curricular
              </label>
              <select
                value={data.unidadeCurricular}
                onChange={e => onUpdate('unidadeCurricular', e.target.value)}
                disabled={!data.curso}
                className="w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {data.curso ? 'Selecione uma unidade curricular' : 'Selecione um curso primeiro'}
                </option>
                {unidadesDisponiveis.map(unidade => (
                  <option key={unidade} value={unidade}>{unidade}</option>
                ))}
              </select>
              {data.curso && unidadesDisponiveis.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  Nenhuma unidade curricular disponível para este curso
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Programas e Iniciativas SENAI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-8 md:p-10 shadow-lg border-2 border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Programas e Iniciativas SENAI
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Seu projeto participou de alguma iniciativa especial?
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Itinerário de Projetos */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-2">
              Faz parte do Itinerário de Projetos?
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              O Itinerário de Projetos integra as Unidades Curriculares Criatividade e Ideação em Projetos, Modelagem de Projetos, Prototipagem de Projetos e Implementação de Projetos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onUpdate('itinerario', 'Sim')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${data.itinerario === 'Sim'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
              >
                Sim
              </button>
              <button
                onClick={() => onUpdate('itinerario', 'Não')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${data.itinerario === 'Não'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* SENAI Lab */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-2">
              Utilizou o SENAI Lab?
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              O SENAI Lab é um espaço de inovação equipado com tecnologias avançadas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onUpdate('senaiLab', 'Sim')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${data.senaiLab === 'Sim'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
              >
                Sim
              </button>
              <button
                onClick={() => onUpdate('senaiLab', 'Não')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${data.senaiLab === 'Não'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                  }`}
              >
                Não
              </button>
            </div>
          </div>

          {/* SAGA SENAI */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-2">
              Participou da SAGA SENAI?
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A SAGA SENAI é uma competição de inovação e empreendedorismo.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onUpdate('sagaSenai', 'Sim')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${data.sagaSenai === 'Sim'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-pink-300'
                  }`}
              >
                Sim
              </button>
              <button
                onClick={() => onUpdate('sagaSenai', 'Não')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${data.sagaSenai === 'Não'
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-pink-300'
                  }`}
              >
                Não
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AcademicInfoSection
