import React from 'react'
import AcademicInfoSection from './sections/AcademicInfoSection'
import ProjectDetailsSection from './sections/ProjectDetailsSection'
import TeamSection from './sections/TeamSection'
import AttachmentsSection from './sections/AttachmentsSection'
import CodeSection from './sections/CodeSection'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

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
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  hasRepositorio: boolean
  tipoRepositorio: 'arquivo' | 'link'
  codigo?: File | null
  linkRepositorio: string
  codigoVisibilidade: string
  anexosVisibilidade: string
  aceitouTermos: boolean
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
  const handleInputChange = (field: string, value: string | boolean | string[] | File | null) => {
    updateData({ [field]: value as any })
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

      {/* 1. Conte-nos sobre seu Projeto! (Detalhes + Banner) */}
      <ProjectDetailsSection
        data={{
          titulo: data.titulo,
          descricao: data.descricao,
          categoria: data.categoria,
          modalidade: data.modalidade,
          banner: data.banner
        }}
        onUpdate={handleInputChange}
      />

      {/* 2. Informações Acadêmicas */}
      <AcademicInfoSection
        data={{
          curso: data.curso,
          turma: data.turma,
          itinerario: data.itinerario,
          unidadeCurricular: data.unidadeCurricular,
          senaiLab: data.senaiLab,
          sagaSenai: data.sagaSenai
        }}
        onUpdate={handleInputChange}
      />

      {/* 3. Equipe do Projeto */}
      <TeamSection
        data={{
          autores: data.autores,
          orientador: data.orientador,
          liderEmail: data.liderEmail,
          isLeader: data.isLeader
        }}
        onUpdate={handleInputChange}
      />

      {/* 4. Timeline do Projeto (Fases de Desenvolvimento) */}
      <AttachmentsSection
        data={{
          banner: data.banner,
          ideacao: data.ideacao,
          modelagem: data.modelagem,
          prototipagem: data.prototipagem,
          implementacao: data.implementacao
        }}
        onUpdate={(field, value) => updateData({ [field]: value })}
      />

      {/* 5. Código Fonte e Privacidade */}
      <CodeSection
        data={{
          hasRepositorio: data.hasRepositorio,
          tipoRepositorio: data.tipoRepositorio,
          codigo: data.codigo,
          linkRepositorio: data.linkRepositorio,
          codigoVisibilidade: data.codigoVisibilidade,
          anexosVisibilidade: data.anexosVisibilidade,
          aceitouTermos: data.aceitouTermos
        }}
        onUpdate={(field, value) => updateData({ [field]: value })}
      />

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
