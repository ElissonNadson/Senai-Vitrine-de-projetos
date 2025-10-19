import React from 'react'
import { CheckCircle, Edit2, User, FileText, Lightbulb, Code, Eye } from 'lucide-react'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

interface ProjectReviewData {
  curso: string
  turma: string
  itinerario: string
  unidadeCurricular: string
  senaiLab: string
  sagaSenai: string
  titulo: string
  descricao: string
  categoria: string
  modalidade: string
  autores: string[]
  orientador: string
  liderEmail: string
  isLeader: boolean
  banner?: File | null
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  codigo?: File | null
  codigoVisibilidade: string
  anexosVisibilidade: string
}

interface ProjectReviewProps {
  data: ProjectReviewData
  onBackToEdit: () => void
  onSaveAndPublish: () => void
}

const ProjectReview: React.FC<ProjectReviewProps> = ({
  data,
  onBackToEdit,
  onSaveAndPublish
}) => {
  const InfoItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm text-gray-900 dark:text-white font-medium">
        {value || 'Não informado'}
      </span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              Revisão do Projeto
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Revise todas as informações antes de publicar
            </p>
          </div>
          <button
            onClick={onBackToEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Voltar para Edição
          </button>
        </div>
      </div>

      {/* Banner Preview */}
      {data.banner && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <img
            src={URL.createObjectURL(data.banner)}
            alt="Banner do Projeto"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Informações Principais */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informações do Projeto
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {data.titulo || 'Sem título'}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.descricao || 'Sem descrição'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem label="Categoria" value={data.categoria} />
            <InfoItem label="Modalidade" value={data.modalidade} />
            <InfoItem label="Curso" value={data.curso} />
          </div>
        </div>
      </div>

      {/* Informações Acadêmicas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Informações Acadêmicas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label="Turma" value={data.turma} />
          <InfoItem label="Unidade Curricular" value={data.unidadeCurricular} />
          <InfoItem label="Itinerário de Projetos" value={data.itinerario} />
          <InfoItem label="Desenvolvido no SENAI Lab" value={data.senaiLab} />
          <InfoItem label="Participou da SAGA SENAI" value={data.sagaSenai} />
        </div>
      </div>

      {/* Equipe */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Equipe do Projeto
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Autores ({data.autores.length})
            </h3>
            {data.autores.length > 0 ? (
              <div className="space-y-2">
                {data.autores.map((autor, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{autor}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum autor adicionado</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orientador
              </h3>
              {data.orientador ? (
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{data.orientador}</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum orientador adicionado</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Líder do Projeto
              </h3>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {data.liderEmail || 'Não informado'}
                </p>
                {data.isLeader && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Você é o líder deste projeto
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Anexos e Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Etapas do Projeto
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Ideação', data: data.ideacao },
            { name: 'Modelagem', data: data.modelagem },
            { name: 'Prototipagem', data: data.prototipagem },
            { name: 'Implementação', data: data.implementacao }
          ].map((stage, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {stage.name}
              </h4>
              {stage.data.anexos.length > 0 ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs">
                    {stage.data.anexos.length} anexo(s)
                  </span>
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">Sem anexos</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Código e Configurações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
            <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Código Fonte e Configurações
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código Fonte
            </h3>
            {data.codigo ? (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{data.codigo.name}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum código adicionado</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Código:</span>
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {data.codigoVisibilidade}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Anexos:</span>
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                {data.anexosVisibilidade}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            Tudo pronto?
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Revise as informações e publique seu projeto
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBackToEdit}
            className="px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
          >
            Editar
          </button>
          <button
            onClick={onSaveAndPublish}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg transition-all transform hover:scale-105"
          >
            Salvar e Publicar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectReview
