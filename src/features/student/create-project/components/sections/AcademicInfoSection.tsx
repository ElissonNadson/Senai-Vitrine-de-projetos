import React from 'react'
import { FileText, GraduationCap, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

interface AcademicInfoSectionProps {
  data: {
    curso: string
    turma: string
    itinerario: string
    unidadeCurricular: string
    senaiLab: string
    sagaSenai: string
  }
  onUpdate: (field: string, value: string) => void
}

const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({ data, onUpdate }) => {
  const cursosDisponiveis = [
    'Administração',
    'Biotecnologia',
    'Desenvolvimento de Sistemas',
    'Eletromecânica',
    'Eletrotécnica',
    'Logística',
    'Manutenção Automotiva',
    'Mecânica',
    'Química',
    'Segurança do Trabalho'
  ]

  return (
    <>
      {/* Informações Acadêmicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <GraduationCap className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Informações Acadêmicas
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
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
                className="w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:border-gray-300"
              >
                <option value="">Selecione um curso</option>
                {cursosDisponiveis.map(curso => (
                  <option key={curso} value={curso}>{curso}</option>
                ))}
              </select>
            </div>

            {/* Turma */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Turma <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.turma}
                onChange={e => onUpdate('turma', e.target.value)}
                placeholder="Ex: 2024-DS-01"
                className="w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300"
              />
            </div>
          </div>

          {/* Unidade Curricular */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Unidade Curricular
            </label>
            <input
              type="text"
              value={data.unidadeCurricular}
              onChange={e => onUpdate('unidadeCurricular', e.target.value)}
              placeholder="Ex: Programação Web"
              className="w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 border-gray-200 dark:border-gray-600 hover:border-gray-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Programas e Iniciativas SENAI */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <BookOpen className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Programas e Iniciativas
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Seu projeto participou de alguma iniciativa do SENAI?
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
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  data.itinerario === 'Sim'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                Sim
              </button>
              <button
                onClick={() => onUpdate('itinerario', 'Não')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  data.itinerario === 'Não'
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
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  data.senaiLab === 'Sim'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-300'
                }`}
              >
                Sim
              </button>
              <button
                onClick={() => onUpdate('senaiLab', 'Não')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  data.senaiLab === 'Não'
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
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  data.sagaSenai === 'Sim'
                    ? 'bg-pink-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-pink-300'
                }`}
              >
                Sim
              </button>
              <button
                onClick={() => onUpdate('sagaSenai', 'Não')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                  data.sagaSenai === 'Não'
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
    </>
  )
}

export default AcademicInfoSection
