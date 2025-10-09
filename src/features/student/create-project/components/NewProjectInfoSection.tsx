import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, Users, Lightbulb } from 'lucide-react'
import { ProjectFormSectionProps } from '../types'
import { useFormData } from '../hooks/useFormData'
import AuthorManager from './AuthorManager'
import OrientadorManager from './OrientadorManager'

const ProjectInfoSection: React.FC<ProjectFormSectionProps> = ({
  data,
  updateData,
  errors = {}
}) => {
  const { 
    cursosDisponiveis,
    unidadesCurricularesOptions,
    loadingUCs,
    getTurmasByCurso,
    getDefaultCourse,
    userInfo
  } = useFormData()

  // Pré-popular com dados do usuário logado
  useEffect(() => {
    if (userInfo.curso && !data.curso) {
      const defaultCourse = getDefaultCourse()
      if (defaultCourse) {
        updateData({ curso: defaultCourse })
      }
    }
    
    // Pré-popular email do líder
    if (userInfo.email && !data.liderEmail) {
      updateData({ 
        liderEmail: userInfo.email,
        isLeader: true 
      })
    }
  }, [userInfo, data.curso, data.liderEmail, getDefaultCourse, updateData])

  const handleInputChange = (field: string, value: string | boolean) => {
    updateData({ [field]: value })
  }

  const handleAddAuthor = (email: string) => {
    updateData({
      autores: [...data.autores, email]
    })
  }

  const handleRemoveAuthor = (index: number) => {
    const newAutores = data.autores.filter((_, i) => i !== index)
    updateData({ autores: newAutores })
  }

  const handleSetOrientador = (email: string) => {
    updateData({ orientador: email })
  }

  const handleRemoveOrientador = () => {
    updateData({ orientador: '' })
  }

  return (
    <div className="space-y-6">
      {/* Formulário em grid responsivo */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Coluna esquerda - Informações acadêmicas */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-xl">
                <Book className="w-5 h-5 text-primary-dark dark:text-primary-light" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Informações Acadêmicas
              </h3>
            </div>

            <div className="space-y-5">
              {/* Curso */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Curso <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="cursos-list"
                  value={data.curso}
                  onChange={e => handleInputChange('curso', e.target.value)}
                  placeholder="Digite ou selecione o curso"
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.curso 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                />
                <datalist id="cursos-list">
                  {cursosDisponiveis.map((curso: any) => (
                    <option key={curso.value} value={curso.value}>
                      {curso.label}
                    </option>
                  ))}
                </datalist>
                {errors.curso && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 dark:text-red-400 text-xs mt-2 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.curso}
                  </motion.p>
                )}
              </div>

              {/* Grid de 2 colunas para Turma e UC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Turma */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Turma <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    list="turmas-list"
                    value={data.turma}
                    onChange={e => handleInputChange('turma', e.target.value)}
                    placeholder="Digite a turma"
                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                      errors.turma
                        ? 'border-red-500 dark:border-red-500'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  />
                  <datalist id="turmas-list">
                    {data.curso && getTurmasByCurso(data.curso).map(turma => (
                      <option key={turma.value} value={turma.value}>
                        {turma.label}
                      </option>
                    ))}
                  </datalist>
                  {errors.turma && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 dark:text-red-400 text-xs mt-2 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
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
                    list="unidades-curriculares-list"
                    value={data.unidadeCurricular}
                    onChange={e => handleInputChange('unidadeCurricular', e.target.value)}
                    placeholder={loadingUCs ? "Carregando..." : "Selecione a UC"}
                    disabled={loadingUCs}
                    className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                      errors.unidadeCurricular 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    } ${loadingUCs ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                  <datalist id="unidades-curriculares-list">
                    {!loadingUCs && unidadesCurricularesOptions.map((uc: any) => (
                      <option key={uc.value} value={uc.value}>
                        {uc.label}
                      </option>
                    ))}
                  </datalist>
                  {errors.unidadeCurricular && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 dark:text-red-400 text-xs mt-2 flex items-center gap-1"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.unidadeCurricular}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Opções adicionais com radio buttons modernos */}
              <div className="space-y-4 pt-4">
                {/* Itinerário de Projetos */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Faz parte do Itinerário de Projetos?
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 dark:hover:border-primary/50 has-[:checked]:border-primary dark:has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="itinerario"
                        value="Sim"
                        checked={data.itinerario === 'Sim'}
                        onChange={e => handleInputChange('itinerario', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sim</span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 dark:hover:border-primary/50 has-[:checked]:border-primary dark:has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="itinerario"
                        value="Não"
                        checked={data.itinerario === 'Não'}
                        onChange={e => handleInputChange('itinerario', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Não</span>
                    </label>
                  </div>
                </motion.div>

                {/* SENAI Lab */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Utilizou o SENAI Lab?
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 dark:hover:border-primary/50 has-[:checked]:border-primary dark:has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="senaiLab"
                        value="Sim"
                        checked={data.senaiLab === 'Sim'}
                        onChange={e => handleInputChange('senaiLab', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sim</span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 dark:hover:border-primary/50 has-[:checked]:border-primary dark:has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="senaiLab"
                        value="Não"
                        checked={data.senaiLab === 'Não'}
                        onChange={e => handleInputChange('senaiLab', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Não</span>
                    </label>
                  </div>
                </motion.div>

                {/* SAGA SENAI */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Participou do SAGA SENAI?
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 dark:hover:border-primary/50 has-[:checked]:border-primary dark:has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="sagaSenai"
                        value="Sim"
                        checked={data.sagaSenai === 'Sim'}
                        onChange={e => handleInputChange('sagaSenai', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sim</span>
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 dark:hover:border-primary/50 has-[:checked]:border-primary dark:has-[:checked]:border-primary has-[:checked]:bg-primary/5 dark:has-[:checked]:bg-primary/10 border-gray-200 dark:border-gray-600">
                      <input
                        type="radio"
                        name="sagaSenai"
                        value="Não"
                        checked={data.sagaSenai === 'Não'}
                        onChange={e => handleInputChange('sagaSenai', e.target.value)}
                        className="accent-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Não</span>
                    </label>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Coluna direita - Detalhes do projeto */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Informações do Projeto */}
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-xl">
                <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Detalhes do Projeto
              </h3>
            </div>

            <div className="space-y-5">
              {/* Título */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Título do Projeto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.titulo}
                  onChange={e => handleInputChange('titulo', e.target.value)}
                  placeholder="Digite o título do seu projeto"
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                    errors.titulo 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                />
                {errors.titulo && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 dark:text-red-400 text-xs mt-2 flex items-center gap-1"
                  >
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
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
                  value={data.descricao}
                  onChange={e => handleInputChange('descricao', e.target.value)}
                  placeholder="Descreva o objetivo, funcionalidades e tecnologias utilizadas no projeto"
                  rows={4}
                  maxLength={500}
                  className={`w-full border-2 rounded-xl px-4 py-3 transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 resize-none ${
                    errors.descricao 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                />
                <div className="flex items-center justify-between mt-2">
                  {errors.descricao ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1"
                    >
                      <span className="w-1 h-1 bg-red-500 rounded-full" />
                      {errors.descricao}
                    </motion.p>
                  ) : (
                    <span></span>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {data.descricao.length}/500 caracteres
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pessoas Envolvidas */}
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-green-500/10 dark:bg-green-500/20 rounded-xl">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Pessoas Envolvidas
              </h3>
            </div>

            <div className="space-y-6">
              {/* Autores */}
              <AuthorManager
                autores={data.autores}
                onAddAuthor={handleAddAuthor}
                onRemoveAuthor={handleRemoveAuthor}
                error={errors.autores}
              />

              {/* Orientador */}
              <OrientadorManager
                orientador={data.orientador}
                onSetOrientador={handleSetOrientador}
                onRemoveOrientador={handleRemoveOrientador}
                error={errors.orientador}
              />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default ProjectInfoSection
