import React, { useState, useEffect, useMemo } from 'react'
import { FileText, GraduationCap, BookOpen, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCursos, useTurmasByCurso, useUnidadesByCurso } from '@/hooks/use-queries'

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

  const { data: unidadesData = [], isLoading: isLoadingUnidades } = useUnidadesByCurso(selectedCursoUuid!, {
    enabled: !!selectedCursoUuid
  })

  // Limpar unidade selecionada se não existir mas nas novas opções (quando mudar curso)
  useEffect(() => {
    if (data.unidadeCurricular && unidadesData.length > 0) {
      const exists = unidadesData.some((u: any) => u.nome === data.unidadeCurricular)
      if (!exists) {
        onUpdate('unidadeCurricular', '')
      }
    }
  }, [unidadesData, data.unidadeCurricular])

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
                  {data.curso ? (isLoadingUnidades ? 'Carregando unidades...' : 'Selecione uma unidade curricular') : 'Selecione um curso primeiro'}
                </option>
                {unidadesData.map((unidade: any) => (
                  <option key={unidade.id || unidade.nome || unidade} value={unidade.nome || unidade}>{unidade.nome || unidade}</option>
                ))}
              </select>
              {data.curso && unidadesData.length === 0 && !isLoadingUnidades && (
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
