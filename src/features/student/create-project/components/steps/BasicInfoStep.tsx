import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, GraduationCap, Lightbulb, AlertCircle } from 'lucide-react'

interface BasicInfoStepProps {
  formData: any
  updateFormData: (updates: any) => void
  errors: Record<string, string>
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const cursosDisponiveis = [
    { value: 'Técnico em Desenvolvimento de Sistemas', label: 'Técnico em Desenvolvimento de Sistemas' },
    { value: 'Técnico em Redes de Computadores', label: 'Técnico em Redes de Computadores' },
    { value: 'Técnico em Mecatrônica', label: 'Técnico em Mecatrônica' },
    { value: 'Técnico em Eletroeletrônica', label: 'Técnico em Eletroeletrônica' }
  ]

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Grid de 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Coluna 1: Informações Acadêmicas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Informações Acadêmicas
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Dados do seu curso
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Curso */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Curso <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.curso}
                onChange={e => handleInputChange('curso', e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white ${
                  errors.curso
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              >
                <option value="">Selecione o curso</option>
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
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.curso}
                </motion.p>
              )}
            </div>

            {/* Turma e UC em grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Turma */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Turma <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.turma}
                  onChange={e => handleInputChange('turma', e.target.value)}
                  placeholder="Ex: 2024-DS-01"
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.turma
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                />
                {errors.turma && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.turma}
                  </motion.p>
                )}
              </div>

              {/* Unidade Curricular */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Unidade Curricular <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.unidadeCurricular}
                  onChange={e => handleInputChange('unidadeCurricular', e.target.value)}
                  placeholder="Ex: Programação Web"
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.unidadeCurricular
                      ? 'border-red-500 dark:border-red-500'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                />
                {errors.unidadeCurricular && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-2 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.unidadeCurricular}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Opções com radio buttons */}
            <div className="space-y-4 pt-2">
              {/* Itinerário de Projetos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Faz parte do Itinerário de Projetos?
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  O Itinerário de Projetos integra as Unidades Curriculares Criatividade e Ideação em Projetos, Modelagem de Projetos, Prototipagem de Projetos e Implementação de Projetos.
                </p>
                <div className="flex gap-3">
                  {['Sim', 'Não'].map(option => (
                    <label key={option} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="itinerario"
                        value={option}
                        checked={formData.itinerario === option}
                        onChange={e => handleInputChange('itinerario', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SENAI Lab */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Utilizou o SENAI Lab?
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Indique se o projeto foi criado ou desenvolvido em algum laboratório do SENAI, como o LabMaker, Biblioteca Maker ou outros espaços de inovação da instituição.
                </p>
                <div className="flex gap-3">
                  {['Sim', 'Não'].map(option => (
                    <label key={option} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="senaiLab"
                        value={option}
                        checked={formData.senaiLab === option}
                        onChange={e => handleInputChange('senaiLab', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SAGA SENAI */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Participou do SAGA SENAI?
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  A SAGA SENAI de Inovação é uma iniciativa nacional que reúne ações como o Grand Prix SENAI de Inovação, o DSPI (Desafio SENAI de Projetos Integradores) e o Inova SENAI. Indique se o projeto participou de alguma dessas etapas.
                </p>
                <div className="flex gap-3">
                  {['Sim', 'Não'].map(option => (
                    <label key={option} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="sagaSenai"
                        value={option}
                        checked={formData.sagaSenai === option}
                        onChange={e => handleInputChange('sagaSenai', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coluna 2: Detalhes do Projeto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl">
              <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalhes do Projeto
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Informações principais
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Título do Projeto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={e => handleInputChange('titulo', e.target.value)}
                placeholder="Digite um título atraente para seu projeto"
                className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                  errors.titulo
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              />
              {errors.titulo && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  {errors.titulo}
                </motion.p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Descrição do Projeto <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.descricao}
                onChange={e => handleInputChange('descricao', e.target.value)}
                placeholder="Descreva o objetivo, funcionalidades e tecnologias utilizadas no projeto. Seja detalhado e claro!"
                rows={8}
                maxLength={500}
                className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none ${
                  errors.descricao
                    ? 'border-red-500 dark:border-red-500'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                }`}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.descricao ? (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.descricao}
                  </motion.p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mínimo de 50 caracteres
                  </p>
                )}
                <p className={`text-xs font-medium ${
                  formData.descricao.length >= 50
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formData.descricao.length}/500
                </p>
              </div>
            </div>

            {/* Dica */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
            >
              <div className="flex gap-3">
                <Book className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Dica para uma boa descrição
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                    Mencione o problema que seu projeto resolve, as tecnologias utilizadas e os principais recursos implementados. Isso ajudará visitantes a entenderem melhor seu trabalho!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default BasicInfoStep
