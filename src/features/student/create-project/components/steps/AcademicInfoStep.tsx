import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, AlertCircle } from 'lucide-react'

interface AcademicInfoStepProps {
  formData: any
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

const AcademicInfoStep: React.FC<AcademicInfoStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const cursosDisponiveis = [
    { value: 'Técnico em Desenvolvimento de Sistemas', label: 'Técnico em Desenvolvimento de Sistemas' },
    { value: 'Técnico em Redes de Computadores', label: 'Técnico em Redes de Computadores' },
    { value: 'Técnico em Mecatrônica', label: 'Técnico em Mecatrônica' },
    { value: 'Técnico em Eletroeletrônica', label: 'Técnico em Eletroeletrônica' },
    { value: 'Técnico em Automação Industrial', label: 'Técnico em Automação Industrial' },
  ]

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      
      {/* Informações Acadêmicas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Informações Acadêmicas 🎓
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Dados do seu curso e turma no SENAI
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Curso */}
          <div>
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
              Curso <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.curso}
              onChange={e => handleInputChange('curso', e.target.value)}
              className={`w-full border-2 rounded-xl px-5 py-4 text-base font-medium transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white ${
                errors.curso
                  ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <option value="">Selecione seu curso</option>
              {cursosDisponiveis.map(curso => (
                <option key={curso.value} value={curso.value}>
                  {curso.label}
                </option>
              ))}
            </select>
            {errors.curso && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-2 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                {errors.curso}
              </motion.p>
            )}
          </div>

          {/* Grid de 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Turma */}
            <div>
              <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                Turma <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.turma}
                onChange={e => handleInputChange('turma', e.target.value)}
                placeholder="Ex: 2024-DS-01"
                className={`w-full border-2 rounded-xl px-5 py-4 text-base transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                  errors.turma
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              />
              {errors.turma && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.turma}
                </motion.p>
              )}
            </div>

            {/* Unidade Curricular */}
            <div>
              <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                Unidade Curricular <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.unidadeCurricular}
                onChange={e => handleInputChange('unidadeCurricular', e.target.value)}
                placeholder="Ex: Programação Web"
                className={`w-full border-2 rounded-xl px-5 py-4 text-base transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                  errors.unidadeCurricular
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              />
              {errors.unidadeCurricular && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.unidadeCurricular}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Opções Adicionais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 md:p-10 shadow-lg border-2 border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Programas e Iniciativas ✨
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Seu projeto participou de alguma iniciativa do SENAI?
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Itinerário de Projetos */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6">
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
              Faz parte do Itinerário de Projetos?
            </label>
            <div className="flex gap-3">
              {['Sim', 'Não'].map(option => (
                <label 
                  key={option} 
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/70 hover:shadow-md has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:has-[:checked]:bg-primary/20 has-[:checked]:shadow-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="itinerario"
                    value={option}
                    checked={formData.itinerario === option}
                    onChange={e => handleInputChange('itinerario', e.target.value)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SENAI Lab */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6">
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
              Utilizou o SENAI Lab?
            </label>
            <div className="flex gap-3">
              {['Sim', 'Não'].map(option => (
                <label 
                  key={option} 
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/70 hover:shadow-md has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:has-[:checked]:bg-primary/20 has-[:checked]:shadow-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="senaiLab"
                    value={option}
                    checked={formData.senaiLab === option}
                    onChange={e => handleInputChange('senaiLab', e.target.value)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* SAGA SENAI */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6">
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
              Participou do SAGA SENAI?
            </label>
            <div className="flex gap-3">
              {['Sim', 'Não'].map(option => (
                <label 
                  key={option} 
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/70 hover:shadow-md has-[:checked]:border-primary has-[:checked]:bg-primary/10 dark:has-[:checked]:bg-primary/20 has-[:checked]:shadow-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="sagaSenai"
                    value={option}
                    checked={formData.sagaSenai === option}
                    onChange={e => handleInputChange('sagaSenai', e.target.value)}
                    className="w-5 h-5 accent-primary"
                  />
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default AcademicInfoStep
