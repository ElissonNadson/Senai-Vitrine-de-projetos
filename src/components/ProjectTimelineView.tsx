import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Circle, 
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react'
import { useEtapasProjeto } from '../hooks/use-etapas-projeto'

interface ProjectTimelineViewProps {
  projetoUuid: string
}

const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({ projetoUuid }) => {
  const { etapas, loading, error, fetchEtapasByProjeto } = useEtapasProjeto()

  useEffect(() => {
    if (projetoUuid) {
      fetchEtapasByProjeto(projetoUuid)
    }
  }, [projetoUuid, fetchEtapasByProjeto])

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'há poucos segundos'
    if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`
    if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`
    if (diffInSeconds < 604800) return `há ${Math.floor(diffInSeconds / 86400)} dias`
    if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 604800)} semanas`
    return `há ${Math.floor(diffInSeconds / 2592000)} meses`
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'CONCLUIDA':
        return {
          color: 'from-green-500 to-emerald-600',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          icon: <CheckCircle className="w-6 h-6" />,
          label: 'Concluída'
        }
      case 'EM_ANDAMENTO':
        return {
          color: 'from-yellow-500 to-orange-600',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          icon: <TrendingUp className="w-6 h-6" />,
          label: 'Em Andamento'
        }
      default: // PENDENTE
        return {
          color: 'from-gray-400 to-gray-500',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700',
          icon: <Circle className="w-6 h-6" />,
          label: 'Pendente'
        }
    }
  }

  const calculateProgress = () => {
    if (etapas.length === 0) return 0
    const concluidas = etapas.filter(e => e.status === 'CONCLUIDA').length
    return Math.round((concluidas / etapas.length) * 100)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <p className="text-red-600 dark:text-red-400">
          ⚠️ Erro ao carregar timeline: {error}
        </p>
      </div>
    )
  }

  if (etapas.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          📊 Este projeto ainda não possui etapas cadastradas
        </p>
      </div>
    )
  }

  const progress = calculateProgress()

  return (
    <div className="space-y-6">
      {/* Header com Progresso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-3xl p-8 border-2 border-indigo-200 dark:border-indigo-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📊 Timeline do Projeto
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Acompanhe o progresso de desenvolvimento
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
              {progress}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Concluído
            </p>
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full"
          />
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {etapas.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total de Etapas
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {etapas.filter(e => e.status === 'CONCLUIDA').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Concluídas
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {etapas.filter(e => e.status === 'EM_ANDAMENTO').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Em Andamento
            </div>
          </div>
        </div>
      </motion.div>

      {/* Lista de Etapas */}
      <div className="relative">
        {/* Linha Vertical */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 to-blue-600 hidden md:block" />

        <div className="space-y-6">
          {etapas
            .sort((a, b) => a.ordem - b.ordem)
            .map((etapa, index) => {
              const config = getStatusConfig(etapa.status)
              
              return (
                <motion.div
                  key={etapa.uuid}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Ícone de Status */}
                  <div className={`absolute left-0 top-8 w-12 h-12 rounded-full bg-gradient-to-br ${config.color} md:flex items-center justify-center text-white shadow-lg hidden z-10`}>
                    {config.icon}
                  </div>

                  {/* Card da Etapa */}
                  <div className={`md:ml-20 bg-white dark:bg-gray-800 rounded-2xl border-2 ${config.borderColor} shadow-lg overflow-hidden hover:shadow-xl transition-all`}>
                    {/* Header */}
                    <div className={`${config.bgColor} p-6 border-b ${config.borderColor}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl font-bold text-gray-400 dark:text-gray-500">
                              {String(etapa.ordem).padStart(2, '0')}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {etapa.nomeEtapa}
                            </h3>
                          </div>
                          
                          {/* Metadados */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Criado {formatTimeAgo(etapa.criadoEm)}
                              </span>
                            </div>
                            {etapa.atualizadoEm !== etapa.criadoEm && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                  Atualizado {formatTimeAgo(etapa.atualizadoEm)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Badge de Status */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${config.color} text-white font-bold shadow-md`}>
                          {config.icon}
                          <span>{config.label}</span>
                        </div>
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {etapa.descricao}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export default ProjectTimelineView
