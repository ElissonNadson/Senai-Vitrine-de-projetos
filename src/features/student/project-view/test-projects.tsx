import React from 'react'
import { useNavigate } from 'react-router-dom'
import mockProjectsData from '@/data/mockProjects.json'
import { ExternalLink, Eye, Award } from 'lucide-react'

const TestProjectsList: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🎨 Projetos Mockados - Teste
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Clique em qualquer projeto para ver a página de visualização completa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjectsData.projects.map((project: any) => (
            <div
              key={project.id}
              onClick={() => navigate(`/app/projetos/${project.id}/visualizar`)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-blue-500"
            >
              {/* Banner */}
              <div className="relative h-48 overflow-hidden">
                {project.bannerUrl ? (
                  <img
                    src={project.bannerUrl}
                    alt={project.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600" />
                )}

                {/* Overlay com fase */}
                <div className="absolute top-3 right-3">
                  <div className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Fase {project.faseAtual}
                    </span>
                  </div>
                </div>

                {/* Badge Owner */}
                {project.isOwner && (
                  <div className="absolute top-3 left-3">
                    <div className="px-3 py-1 bg-yellow-400 rounded-full shadow-lg">
                      <span className="text-xs font-bold text-gray-900">👑 Meu Projeto</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {project.nome}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {project.descricao}
                </p>

                {/* Info Grid */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Curso:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 truncate ml-2">
                      {project.curso}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Turma:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {project.turma}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Categoria:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 truncate ml-2">
                      {project.categoria}
                    </span>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.itinerario && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-semibold">
                      Itinerário
                    </span>
                  )}
                  {project.labMaker && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-semibold">
                      Lab Maker
                    </span>
                  )}
                  {project.participouSaga && (
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full font-semibold flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      SAGA
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Eye className="w-4 h-4" />
                    <span>{project.visualizacoes}</span>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    Ver Projeto
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-3">
            📊 Informações sobre os Projetos Mockados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-700 dark:text-blue-400 font-semibold mb-1">Total de Projetos:</p>
              <p className="text-blue-900 dark:text-blue-200 font-bold text-2xl">{mockProjectsData.projects.length}</p>
            </div>
            <div>
              <p className="text-blue-700 dark:text-blue-400 font-semibold mb-1">Fases Representadas:</p>
              <p className="text-blue-900 dark:text-blue-200">Ideação, Modelagem, Prototipagem, Implementação</p>
            </div>
            <div>
              <p className="text-blue-700 dark:text-blue-400 font-semibold mb-1">Contextos:</p>
              <p className="text-blue-900 dark:text-blue-200">Visitante, Dashboard e Owner</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              <strong>Projetos "Meu Projeto" (isOwner: true):</strong> EduManager
            </p>
            <p className="text-blue-800 dark:text-blue-300 text-sm mt-2">
              <strong>Projetos Públicos (isOwner: false):</strong> EcoMarket, UrbanGo, AgroTech IoT, EduPlay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestProjectsList
