import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, BookOpen, AlertCircle, MapPin, Loader2, Info } from 'lucide-react'
import { PROJECT_MODALITIES } from '../../types'
import { useAuth } from '@/contexts/auth-context'
import { buscarPerfil } from '@/api/perfil'
import { useCursos, useTurmasByCurso } from '@/hooks/use-queries'

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
  const { user } = useAuth()
  const isProfessor = user?.tipo?.toUpperCase() === 'PROFESSOR'
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileLoaded, setProfileLoaded] = useState(false)
  
  // Hooks para buscar cursos e turmas
  const { data: cursos = [], isLoading: isLoadingCursos } = useCursos()
  const { data: turmas = [], isLoading: isLoadingTurmas } = useTurmasByCurso(formData.curso_uuid || '')

  // Auto-preencher dados do perfil do estudante
  useEffect(() => {
    const loadProfileData = async () => {
      // Só auto-preenche se for aluno e ainda não carregou
      if (isProfessor || profileLoaded) return
      
      try {
        setIsLoadingProfile(true)
        const perfil = await buscarPerfil()
        
        // Preencher automaticamente os campos do estudante
        const updates: any = {}
        
        if (perfil.curso?.nome && !formData.curso) {
          updates.curso = perfil.curso.nome
          updates.curso_uuid = perfil.curso.uuid
        }
        
        if (perfil.turma?.codigo && !formData.turma) {
          updates.turma = perfil.turma.codigo
          updates.turma_uuid = perfil.turma.uuid
        }
        
        if (Object.keys(updates).length > 0) {
          updateFormData(updates)
        }
        
        setProfileLoaded(true)
      } catch (error) {
        console.error('Erro ao carregar perfil para auto-preenchimento:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }
    
    loadProfileData()
  }, [isProfessor, profileLoaded])

  const handleInputChange = (field: string, value: string) => {
    updateFormData({ [field]: value })
  }

  const handleCursoChange = (cursoUuid: string) => {
    const cursoSelecionado = cursos.find((c: any) => c.uuid === cursoUuid)
    updateFormData({ 
      curso_uuid: cursoUuid,
      curso: cursoSelecionado?.nome || '',
      turma_uuid: '', // Limpar turma ao mudar curso
      turma: ''
    })
  }

  const handleTurmaChange = (turmaUuid: string) => {
    const turmaSelecionada = turmas.find((t: any) => t.uuid === turmaUuid)
    updateFormData({ 
      turma_uuid: turmaUuid,
      turma: turmaSelecionada?.codigo || turmaSelecionada?.nome || ''
    })
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

        {/* Aviso de auto-preenchimento para alunos */}
        {!isProfessor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Auto-preenchimento ativo
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Os campos de Curso, Turma e Modalidade foram preenchidos automaticamente com base no seu perfil.
              </p>
            </div>
          </motion.div>
        )}

        {/* Aviso para professores */}
        {isProfessor && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Modo Professor
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Como professor, você pode selecionar qualquer curso e turma para cadastrar o projeto.
              </p>
            </div>
          </motion.div>
        )}

        {isLoadingProfile && (
          <div className="flex items-center justify-center py-4 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Carregando dados do perfil...</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Grid de 2 colunas - Curso e Modalidade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Curso */}
            <div>
              <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                Curso <span className="text-red-500">*</span>
              </label>
              {isLoadingCursos ? (
                <div className="flex items-center gap-2 py-4 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando cursos...
                </div>
              ) : (
              <select
                value={formData.curso_uuid || ''}
                onChange={e => handleCursoChange(e.target.value)}
                disabled={!isProfessor && profileLoaded && !!formData.curso}
                className={`w-full border-2 rounded-xl px-5 py-4 text-base font-medium transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-800 dark:text-white ${
                  errors.curso
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } ${!isProfessor && profileLoaded && !!formData.curso ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
              >
                <option value="">Selecione um curso</option>
                {cursos.map((curso: any) => (
                  <option key={curso.uuid} value={curso.uuid}>
                    {curso.sigla} - {curso.nome}
                  </option>
                ))}
              </select>
              )}
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

            {/* Modalidade */}
            <div>
              <label className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white mb-3">
                <MapPin className="w-4 h-4 text-green-600" />
                Modalidade <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.modalidade}
                onChange={e => handleInputChange('modalidade', e.target.value)}
                className={`w-full border-2 rounded-xl px-5 py-4 text-base font-medium transition-all focus:ring-2 focus:ring-green-500/20 focus:border-green-500 dark:bg-gray-800 dark:text-white ${
                  errors.modalidade
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <option value="">Selecione a modalidade</option>
                {PROJECT_MODALITIES.map((modality) => (
                  <option key={modality} value={modality}>
                    {modality}
                  </option>
                ))}
              </select>
              {errors.modalidade && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.modalidade}
                </motion.p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                📍 Presencial ou semipresencial
              </p>
            </div>
          </div>

          {/* Grid de 2 colunas - Turma e UC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Turma */}
            <div>
              <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                Turma <span className="text-red-500">*</span>
              </label>
              {isLoadingTurmas ? (
                <div className="flex items-center gap-2 py-4 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Carregando turmas...
                </div>
              ) : !formData.curso_uuid && isProfessor ? (
                <div className="py-4 px-5 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 text-sm">
                  Selecione um curso primeiro
                </div>
              ) : (
              <select
                value={formData.turma_uuid || ''}
                onChange={e => handleTurmaChange(e.target.value)}
                disabled={!isProfessor && profileLoaded && !!formData.turma}
                className={`w-full border-2 rounded-xl px-5 py-4 text-base transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
                  errors.turma
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                } ${!isProfessor && profileLoaded && !!formData.turma ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''}`}
              >
                <option value="">Selecione uma turma</option>
                {turmas.map((turma: any) => (
                  <option key={turma.uuid} value={turma.uuid}>
                    {turma.codigo} {turma.nome ? `- ${turma.nome}` : ''}
                  </option>
                ))}
              </select>
              )}
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
                className={`w-full border-2 rounded-xl px-5 py-4 text-base transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 ${
                  errors.unidadeCurricular
                    ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
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
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-2">
              Faz parte do Itinerário de Projetos?
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              O Itinerário de Projetos integra as Unidades Curriculares Criatividade e Ideação em Projetos, Modelagem de Projetos, Prototipagem de Projetos e Implementação de Projetos.
            </p>
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
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-2">
              Utilizou o SENAI Lab?
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Indique se o projeto foi criado ou desenvolvido em algum laboratório do SENAI, como o LabMaker, Biblioteca Maker ou outros espaços de inovação da instituição.
            </p>
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
            <label className="block text-base font-bold text-gray-900 dark:text-white mb-2">
              Participou do SAGA SENAI?
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A SAGA SENAI de Inovação é uma iniciativa nacional que reúne ações como o Grand Prix SENAI de Inovação, o DSPI (Desafio SENAI de Projetos Integradores) e o Inova SENAI. Indique se o projeto participou de alguma dessas etapas.
            </p>
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
