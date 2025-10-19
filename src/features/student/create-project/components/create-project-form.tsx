import React from 'react'
import { User, X, Plus, Lightbulb, FileText, Wrench, Rocket } from 'lucide-react'

interface ProjectFormData {
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
  timelineFiles: (FileList | null)[]
  codigo?: File | null
  codigoVisibilidade: string
  anexosVisibilidade: string
}

interface CreateProjectFormProps {
  data: ProjectFormData
  updateData: (update: Partial<ProjectFormData>) => void
  onGoToReview: () => void
}

const CreateProjectForm: React.FC<CreateProjectFormProps> = ({
  data,
  updateData,
  onGoToReview
}) => {
  const timelineStages = [
    { name: 'Ideação', icon: Lightbulb, color: 'yellow' },
    { name: 'Modelagem', icon: FileText, color: 'blue' },
    { name: 'Prototipagem', icon: Wrench, color: 'purple' },
    { name: 'Implementação', icon: Rocket, color: 'green' }
  ]

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

  const handleInputChange = (field: string, value: string | boolean) => {
    updateData({ [field]: value })
  }

  const handleAddAuthor = () => {
    const email = prompt('Digite o email do autor:')
    if (email && email.trim()) {
      updateData({
        autores: [...data.autores, email.trim()]
      })
    }
  }

  const handleRemoveAuthor = (index: number) => {
    const newAutores = data.autores.filter((_, i) => i !== index)
    updateData({ autores: newAutores })
  }

  const handleAddOrientador = () => {
    const email = prompt('Digite o email do orientador:')
    if (email && email.trim()) {
      updateData({ orientador: email.trim() })
    }
  }

  const handleRemoveOrientador = () => {
    updateData({ orientador: '' })
  }

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    updateData({ banner: file })
  }

  const handleTimelineFileUpload = (index: number, file: FileList | null) => {
    const newTimelineFiles = [...data.timelineFiles]
    newTimelineFiles[index] = file
    updateData({ timelineFiles: newTimelineFiles })
  }

  const handleCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    updateData({ codigo: file })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Criar Novo Projeto
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Preencha os dados do seu projeto abaixo
        </p>
      </div>

      {/* Informações Acadêmicas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          Informações Acadêmicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Curso *
            </label>
            <select
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.curso}
              onChange={e => handleInputChange('curso', e.target.value)}
            >
              <option value="">Selecione um curso</option>
              {cursosDisponiveis.map(curso => (
                <option key={curso} value={curso}>{curso}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Turma *
            </label>
            <input
              type="text"
              placeholder="Ex: 2024.1"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.turma}
              onChange={e => handleInputChange('turma', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Unidade Curricular
            </label>
            <input
              type="text"
              placeholder="Digite a unidade curricular"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.unidadeCurricular}
              onChange={e => handleInputChange('unidadeCurricular', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Itinerário de Projetos?</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="itinerario"
                  value="Sim"
                  checked={data.itinerario === 'Sim'}
                  onChange={e => handleInputChange('itinerario', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sim</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="itinerario"
                  value="Não"
                  checked={data.itinerario === 'Não'}
                  onChange={e => handleInputChange('itinerario', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Não</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 dark:text-gray-300">Desenvolvido no SENAI Lab?</span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="senaiLab"
                  value="Sim"
                  checked={data.senaiLab === 'Sim'}
                  onChange={e => handleInputChange('senaiLab', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sim</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="senaiLab"
                  value="Não"
                  checked={data.senaiLab === 'Não'}
                  onChange={e => handleInputChange('senaiLab', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Não</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-sm text-gray-700 dark:text-gray-300">Participou da SAGA SENAI?</span>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sagaSenai"
                value="Sim"
                checked={data.sagaSenai === 'Sim'}
                onChange={e => handleInputChange('sagaSenai', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Sim</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sagaSenai"
                value="Não"
                checked={data.sagaSenai === 'Não'}
                onChange={e => handleInputChange('sagaSenai', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Não</span>
            </label>
          </div>
        </div>
      </div>

      {/* Detalhes do Projeto */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
            <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          Detalhes do Projeto
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título do Projeto *
            </label>
            <input
              type="text"
              placeholder="Digite o título do projeto"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={data.titulo}
              onChange={e => handleInputChange('titulo', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição do Projeto * (máx. 500 caracteres)
            </label>
            <textarea
              placeholder="Descreva seu projeto..."
              maxLength={500}
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              value={data.descricao}
              onChange={e => handleInputChange('descricao', e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
              {data.descricao.length}/500
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.categoria}
                onChange={e => handleInputChange('categoria', e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Inovação">Inovação</option>
                <option value="Sustentabilidade">Sustentabilidade</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Modalidade
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.modalidade}
                onChange={e => handleInputChange('modalidade', e.target.value)}
              >
                <option value="">Selecione a modalidade</option>
                <option value="Presencial">Presencial</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Equipe do Projeto */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
            <User className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          Equipe do Projeto
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Autores */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Autores
            </label>
            <div className="space-y-2">
              {data.autores.map((autor, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">{autor}</span>
                  <button
                    onClick={() => handleRemoveAutor(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddAutor}
                className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Adicionar Autor
              </button>
            </div>
          </div>

          {/* Orientador e Líder */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Orientador
              </label>
              {data.orientador ? (
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{data.orientador}</span>
                  <button
                    onClick={handleRemoveOrientador}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddOrientador}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Orientador
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email do Líder
              </label>
              <input
                type="email"
                placeholder="lider@exemplo.com"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.liderEmail}
                onChange={e => handleInputChange('liderEmail', e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="text-sm text-gray-700 dark:text-gray-300">Eu sou o líder do projeto</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isLeader}
                  onChange={e => handleInputChange('isLeader', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Banner e Anexos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
          Banner e Anexos
        </h2>

        {/* Banner */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Banner do Projeto
          </label>
          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {data.banner ? (
              <div className="relative h-48">
                <img
                  src={URL.createObjectURL(data.banner)}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => updateData({ banner: null })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <Plus className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Clique para adicionar banner</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">(Recomendado: 1920x1080)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Linha do Tempo */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
            Etapas do Projeto (Timeline)
          </label>
          
          {/* Timeline Visual */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex justify-between items-center relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 z-0"></div>
              {timelineStages.map((stage, idx) => {
                const Icon = stage.icon
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10 flex-1">
                    <div className={`w-8 h-8 rounded-full bg-${stage.color}-500 flex items-center justify-center mb-2`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs text-center text-gray-700 dark:text-gray-300 max-w-20">
                      {stage.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {timelineStages.map((stage, idx) => (
              <div key={idx}>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {stage.name}
                </label>
                <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors min-h-[100px]">
                  <Plus className="h-6 w-6 text-gray-400 dark:text-gray-500 mb-1" />
                  <span className="text-xs text-center text-gray-600 dark:text-gray-400">
                    Adicionar arquivos
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={e => handleTimelineFileUpload(idx, e.target.files)}
                    className="hidden"
                  />
                </label>
                {data.timelineFiles[idx] && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {data.timelineFiles[idx]?.length} arquivo(s) selecionado(s)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Código e Configurações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Código Fonte e Configurações
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload de Código */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código Fonte (Opcional)
            </label>
            {data.codigo ? (
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {data.codigo.name}
                </span>
                <button
                  onClick={() => updateData({ codigo: null })}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                <Plus className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Clique para adicionar código</span>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">(ZIP, RAR, etc.)</span>
                <input
                  type="file"
                  onChange={handleCodeUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Configurações de Visibilidade */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visibilidade do Código
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.codigoVisibilidade}
                onChange={e => handleInputChange('codigoVisibilidade', e.target.value)}
              >
                <option value="Público">Público</option>
                <option value="Privado">Privado</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Visibilidade dos Anexos
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={data.anexosVisibilidade}
                onChange={e => handleInputChange('anexosVisibilidade', e.target.value)}
              >
                <option value="Público">Público</option>
                <option value="Privado">Privado</option>
              </select>
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Revisão */}
      <div className="flex justify-end">
        <button
          onClick={onGoToReview}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          Ir para Revisão
        </button>
      </div>
    </div>
  )
}

export default CreateProjectForm
