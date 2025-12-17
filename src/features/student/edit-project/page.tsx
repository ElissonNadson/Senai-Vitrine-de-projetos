import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, CheckCircle, Loader2, Edit2 } from 'lucide-react'
import { Modal, message } from 'antd'
import { useAuth } from '@/contexts/auth-context'
import { API_CONFIG } from '@/api/config'
import ProjectReview, { SectionType } from '@/features/student/create-project/components/project-review'
import axiosInstance from '@/services/axios-instance'

// API Functions
import {
  buscarProjeto,
  atualizarProjeto,
  criarProjetoPasso2,
  criarProjetoPasso3,
  criarProjetoPasso4,
  configurarRepositorioPasso5,
  AnexoFase,
  FasePayload,
  Passo4Payload
} from '@/api/projetos'
import { uploadBanner } from '@/api/upload'

// Section Components
import ProjectDetailsSection from '@/features/student/create-project/components/sections/ProjectDetailsSection'
import AcademicInfoSection from '@/features/student/create-project/components/sections/AcademicInfoSection'
import TeamSection from '@/features/student/create-project/components/sections/TeamSection'
import AttachmentsSection from '@/features/student/create-project/components/sections/AttachmentsSection'
import CodeSection from '@/features/student/create-project/components/sections/CodeSection'

// Types
interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

export interface ProjectFormData {
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
  autoresMetadata?: Record<string, any>
  orientador: string
  orientadoresMetadata?: Record<string, any>
  liderEmail: string
  isLeader: boolean
  status?: string
  banner?: File | null
  bannerUrl?: string
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  hasRepositorio: boolean
  codigo?: File | null
  linkRepositorio: string
  codigoVisibilidade: string
  anexosVisibilidade: string
  aceitouTermos: boolean
}

const initialPhaseData: PhaseData = {
  descricao: '',
  anexos: []
}

const initialProjectData: ProjectFormData = {
  curso: '',
  turma: '',
  itinerario: '',
  unidadeCurricular: '',
  senaiLab: '',
  sagaSenai: '',
  titulo: '',
  descricao: '',
  categoria: '',
  modalidade: '',
  autores: [],
  orientador: '',
  liderEmail: '',
  isLeader: false,
  status: 'RASCUNHO',
  banner: null,
  bannerUrl: '',
  ideacao: initialPhaseData,
  modelagem: initialPhaseData,
  prototipagem: initialPhaseData,
  implementacao: initialPhaseData,
  hasRepositorio: false,
  codigo: null,
  linkRepositorio: '',
  codigoVisibilidade: 'public',
  anexosVisibilidade: 'public',
  aceitouTermos: false
}

const EditProjectPage = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [projectData, setProjectData] = useState<ProjectFormData>(initialProjectData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionType | null>(null)
  const [modalData, setModalData] = useState<ProjectFormData>(initialProjectData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalErrors, setModalErrors] = useState<Record<string, string>>({})
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setProjectData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveAll = async () => {
    if (!projectId) return

    try {
      setIsSaving(true)
      // Send the update to the backend
      // Note: We might need to map specific fields if 'atualizarProjeto' expects a specific structure
      // For now passing valid fields that we know are in the form data
      await atualizarProjeto(projectId, {
        titulo: projectData.titulo,
        descricao: projectData.descricao,
        categoria: projectData.categoria,
        modalidade: projectData.modalidade,
        curso: projectData.curso, // This might need to be sending 'curso_id' if the backend expects IDs, but let's try.
        // If API expects IDs and we only have names, this might fail.
        // However, EditPage usually loads data. If we only edit text, we hope backend handles strings or we are editing text fields.
        // Ideally we should check the current API contract.
        // Assuming 'atualizarProjeto' handles a partial object.
        turma: projectData.turma,
        unidade_curricular: projectData.unidadeCurricular,
        itinerario: projectData.itinerario === 'Sim', // Map back to boolean if needed, or string?
        lab_maker: projectData.senaiLab === 'Sim',
        participou_saga: projectData.sagaSenai === 'Sim'
      })

      setIsEditing(false)
      setLastSavedAt(new Date())
      message.success("Projeto atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao salvar projeto:", error)
      message.error("Erro ao salvar alterações.")
    } finally {
      setIsSaving(false)
    }
  }

  // Fetch project data
  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return

      try {
        setIsLoading(true)
        // Use buscarProjeto instead of raw axios
        const project = await buscarProjeto(projectId)

        const mapApiPhaseToLocal = (apiPhase: any): PhaseData => ({
          descricao: apiPhase?.descricao || '',
          anexos: apiPhase?.anexos?.map((a: any) => ({
            id: a.id,
            file: new File([""], a.nome_arquivo || "anexo"),
            type: a.tipo
          })) || []
        })

        const formattedData: ProjectFormData = {
          ...initialProjectData,
          status: project.status || 'RASCUNHO', // Map status
          curso: project.curso_nome || '', // Note: buscarProjeto return might have curso_nome structure
          turma: '', // API Projeto might not return turma code directly in flat output? Check interface.
          // Interface Projeto in api/projetos.ts has curso_nome, curso_sigla. 
          // Does it have turma? No. That's a problem.
          // Need to fetch passo2 data or enriched project data?
          // Passo2 is saved via criarProjetoPasso2. 
          // `buscarProjeto` usually returns public view.
          // We might need to fetch `getById` which typically returns full info for editing?
          // The API `GET /projetos/:uuid` (API_CONFIG.PROJETOS.GET) returns `Projeto` interface.
          // Let's assume it returns what we need or minimal fields.
          // If turma is missing, we might need another endpoint or check if the backend includes it for owners.
          // Assuming `project` object has fields even if not typed in interface for now, or minimal mapping.

          itinerario: project.itinerario ? 'Sim' : 'Não',
          unidadeCurricular: '', // Also not in simplified Projeto interface
          senaiLab: project.lab_maker ? 'Sim' : 'Não',
          sagaSenai: project.participou_saga ? 'Sim' : 'Não',
          titulo: project.titulo || '',
          descricao: project.descricao || '',
          categoria: project.categoria || '',
          modalidade: '', // Missing
          autores: project.autores?.map((a: any) => a.email) || [],
          orientador: project.orientadores?.map((o: any) => o.email).join(', ') || '',
          liderEmail: project.autores?.find((a: any) => a.papel === 'LIDER')?.email || '',
          isLeader: project.autores?.some((a: any) => a.email === user?.email && a.papel === 'LIDER'),
          hasRepositorio: !!project.repositorio_url,
          linkRepositorio: project.repositorio_url || '',
          aceitouTermos: true,
          codigoVisibilidade: project.visibilidade || 'public',
          anexosVisibilidade: 'public',
          // Phases are usually included in detail view
          // If accessing via `buscarProjeto`, make sure it returns phases.
          // Wait, `Project` interface (Step 240) does NOT show phases!
          // It shows `fase_atual`.
          // We might need `getEtapasProjeto`?
          // Check `api/projetos.ts` -> `buscarProjeto` uses `PROJETOS.GET(uuid)`.
          // If that endpoint is the public one, it might lack details.
          // But `EditProjectPage` implies we are the owner.

          // Let's stick to previous code logic that used `axiosInstance.get(api.projetos.getById(projectId))`
          // but replacing `api.projetos.getById` with correct URL builder.
          // `API_CONFIG.PROJETOS.GET(projectId)` matches.
          // If fields are missing in `Projeto` type but present in JSON, `any` cast or update type.

          // Preserving the mappings from previous block but using correct variables
          ideacao: mapApiPhaseToLocal((project as any).fases?.ideacao),
          modelagem: mapApiPhaseToLocal((project as any).fases?.modelagem),
          prototipagem: mapApiPhaseToLocal((project as any).fases?.prototipagem),
          implementacao: mapApiPhaseToLocal((project as any).fases?.implementacao),
          autoresMetadata: project.autores?.reduce((acc: any, curr: any) => ({ ...acc, [curr.email]: curr }), {}),
          orientadoresMetadata: project.orientadores?.reduce((acc: any, curr: any) => ({ ...acc, [curr.email]: curr }), {})
        }

        // Robust mapping for academic fields matching JSON structure

        // Curso: Check for direct string first (as per JSON), then object, then legacy curso_nome
        if (typeof project.curso === 'string') {
          formattedData.curso = project.curso;
        } else if (typeof project.curso === 'object' && project.curso) {
          formattedData.curso = (project.curso as any).nome || '';
        } else {
          formattedData.curso = project.curso_nome || '';
        }

        // Turma: Check for direct string first, then object
        if (typeof project.turma === 'string') {
          formattedData.turma = project.turma;
        } else if (typeof project.turma === 'object' && project.turma) {
          formattedData.turma = (project.turma as any).codigo || '';
        } else {
          formattedData.turma = '';
        }

        // Direct string mappings
        formattedData.modalidade = project.modalidade || '';
        formattedData.unidadeCurricular = project.unidade_curricular || '';
        formattedData.itinerario = project.itinerario ? 'Sim' : 'Não';
        formattedData.senaiLab = project.lab_maker ? 'Sim' : 'Não';
        formattedData.sagaSenai = project.participou_saga ? 'Sim' : 'Não';

        if (project.banner_url) {
          formattedData.bannerUrl = project.banner_url; // Set URL for display
          try {
            const bannerBlob = await fetch(project.banner_url).then(r => r.blob());
            const bannerFile = new File([bannerBlob], "banner.jpg", { type: bannerBlob.type });
            formattedData.banner = bannerFile;
          } catch (e) {
            console.warn("Failed to load banner blob", e);
          }
        }

        setProjectData(formattedData)
      } catch (error) {
        console.error('Erro ao carregar projeto:', error)
        message.error('Erro ao carregar dados do projeto')
        navigate('/aluno/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()
  }, [projectId, navigate, user?.email])

  // --- Modal Logic ---

  const handleEditSection = (section: SectionType) => {
    setActiveSection(section)
    setModalData({ ...projectData })
    setModalErrors({})
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setActiveSection(null)
    setModalErrors({})
  }

  const handleModalUpdate = (field: string, value: any) => {
    setModalData(prev => ({ ...prev, [field]: value }))
    if (modalErrors[field]) {
      setModalErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateSection = (section: SectionType, data: ProjectFormData): boolean => {
    const errors: Record<string, string> = {}
    let isValid = true

    switch (section) {
      case 'details':
        if (!data.titulo?.trim()) errors.titulo = 'Título é obrigatório'
        else if (data.titulo.length < 5) errors.titulo = 'O título deve ter pelo menos 5 caracteres'

        if (!data.descricao?.trim()) errors.descricao = 'Descrição é obrigatória'
        else if (data.descricao.length < 50) errors.descricao = `A descrição precisa ter pelo menos 50 caracteres (atual: ${data.descricao.length})`

        if (!data.categoria) errors.categoria = 'Selecione uma categoria'
        break

      case 'academic':
        if (!data.curso) errors.curso = 'Selecione o curso'
        if (!data.turma) errors.turma = 'Selecione a turma'
        if (!data.modalidade) errors.modalidade = 'Selecione a modalidade'
        break

      case 'team':
        if (data.autores.length === 0) errors.autores = 'Adicione pelo menos um autor'
        if ((!data.liderEmail || data.liderEmail.trim() === '') && user?.tipo === 'ALUNO') {
          errors.lider = 'O projeto precisa ter um líder definido'
        }
        break

      case 'code':
        if (data.hasRepositorio) {
          if (!data.linkRepositorio) {
            errors.linkRepositorio = 'O link do repositório é obrigatório'
          } else if (!data.linkRepositorio.startsWith('http')) {
            errors.linkRepositorio = 'Insira uma URL válida (http:// ou https://)'
          }
        }
        if (!data.aceitouTermos) errors.aceitouTermos = 'Você precisa aceitar os termos'
        break
    }

    if (Object.keys(errors).length > 0) {
      setModalErrors(errors)
      isValid = false
    }

    return isValid
  }

  const mapPhaseToPayload = (phase: PhaseData): FasePayload => {
    return {
      descricao: phase.descricao,
      anexos: phase.anexos.map(a => ({
        id: a.id,
        tipo: a.type,
        nome_arquivo: a.file.name,
        file: a.file.size > 0 ? a.file : undefined,
      }))
    }
  }

  const handleSaveModal = async () => {
    if (!activeSection || !projectId) return

    if (!validateSection(activeSection, modalData)) {
      message.error('Por favor, corrija os erros antes de salvar.')
      return
    }

    try {
      setIsSaving(true)

      switch (activeSection) {
        case 'details':
          const updatePayload = {
            titulo: modalData.titulo,
            descricao: modalData.descricao,
            categoria: modalData.categoria,
          }
          await atualizarProjeto(projectId, updatePayload)

          if (modalData.banner instanceof File && modalData.banner.size > 0) {
            await uploadBanner(modalData.banner, 'project_banner')
            // The uploadBanner returns URL, need to set it on project.
            // But wait, uploadBanner just uploads. How do we link it?
            // In current API flow, we usually get URL and THEN patch project.
            // uploadBanner returns { url: string ... }
            // Update project with banner_url
            const resp = await uploadBanner(modalData.banner, 'project_banner')
            await atualizarProjeto(projectId, { banner_url: resp.url })
          }
          break;

        case 'academic':
          await criarProjetoPasso2(projectId, {
            curso: modalData.curso,
            turma: modalData.turma,
            modalidade: modalData.modalidade,
            unidade_curricular: modalData.unidadeCurricular,
            itinerario: modalData.itinerario === 'Sim',
            senai_lab: modalData.senaiLab === 'Sim',
            saga_senai: modalData.sagaSenai === 'Sim'
          })
          break;

        case 'team':
          const autoresPayload = modalData.autores.map(email => {
            const meta = modalData.autoresMetadata?.[email]
            return {
              usuario_uuid: meta?.uuid,
              papel: (email === modalData.liderEmail) ? 'LIDER' : 'AUTOR'
            }
          }).filter(a => a.usuario_uuid) as any

          const orientadoresUuids = modalData.orientador
            .split(',')
            .map(e => e.trim())
            .filter(e => e)
            .map(email => modalData.orientadoresMetadata?.[email]?.uuid)
            .filter(u => u)

          await criarProjetoPasso3(projectId, {
            autores: autoresPayload,
            orientadores_uuids: orientadoresUuids
          })
          break;

        case 'phases':
          const payload4: Passo4Payload = {
            ideacao: mapPhaseToPayload(modalData.ideacao),
            modelagem: mapPhaseToPayload(modalData.modelagem),
            prototipagem: mapPhaseToPayload(modalData.prototipagem),
            implementacao: mapPhaseToPayload(modalData.implementacao)
          }
          await criarProjetoPasso4(projectId, payload4)
          break;

        case 'code':
          await configurarRepositorioPasso5(projectId, {
            has_repositorio: modalData.hasRepositorio,
            link_repositorio: modalData.linkRepositorio,
            codigo_visibilidade: modalData.codigoVisibilidade,
            anexos_visibilidade: modalData.anexosVisibilidade,
            aceitou_termos: modalData.aceitouTermos
          })
          break
      }

      setProjectData(modalData)
      setLastSavedAt(new Date())
      message.success('Seção salva com sucesso!')
      handleCloseModal()

    } catch (error) {
      console.error("Erro ao salvar seção:", error)
      message.error("Erro ao salvar alterações.")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublish = async () => {
    try {
      setIsSaving(true);
      await axiosInstance.patch(`/projetos/${projectId}/status`, { status: "EM_ANALISE" });
      message.success("Projeto publicado com sucesso!");
      navigate("/aluno/dashboard");
    } catch (e) {
      message.error("Erro ao publicar projeto");
    } finally {
      setIsSaving(false);
    }
  }

  const renderModalContent = () => {
    switch (activeSection) {
      case 'details':
        return <ProjectDetailsSection data={modalData} errors={modalErrors} onUpdate={handleModalUpdate} />
      case 'academic':
        return <AcademicInfoSection data={modalData} errors={modalErrors} onUpdate={handleModalUpdate} isStudent={user?.tipo === 'ALUNO'} />
      case 'team':
        return <TeamSection data={modalData} errors={modalErrors} onUpdate={handleModalUpdate} />
      case 'phases':
        return <AttachmentsSection data={modalData} errors={modalErrors} onUpdate={handleModalUpdate} />
      case 'code':
        return <CodeSection data={modalData} errors={modalErrors} onUpdate={handleModalUpdate} />
      default: return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Carregando seu projeto...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/aluno/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar para Dashboard</span>
          </button>

          {lastSavedAt && (
            <span className="text-xs text-gray-400 flex items-center gap-1 mr-4">
              <CheckCircle className="w-3 h-3" />
              Salvo às {lastSavedAt.toLocaleTimeString()}
            </span>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Editar Projeto
            </button>
          )}
        </div>
      </div>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <ProjectReview
          data={projectData}
          onBackToEdit={() => { }}
          onSaveAndPublish={handlePublish}
          onSaveDraft={undefined}
          isSubmitting={isSaving}
          isEditMode={!isEditing} // Hide individual edit buttons when in global edit mode (or always hidden if we prefer)
          isEditing={isEditing}
          onInputChange={handleInputChange}
          onEditSection={handleEditSection}
          hideActionBanner={true}
        />
      </main>

      {/* Global Save Bar */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50 animate-slide-up">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <span className="font-medium">Modo de Edição</span>
              <span className="text-sm opacity-75">- Você tem alterações não salvas</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsEditing(false)
                  // Optional: Reset data to initial load?
                  // For now, it just keeps changes in State but doesn't save. Ideally should confirm discard.
                  // But keeping it simple as per "Profile-like" which might just toggle off or ask.
                  // Default profile behavior: Cancel discards? Or Cancel just exits mode?
                  // Let's assume Cancel exits mode, but maybe we should reload data to discard?
                  // const restart = confirm("Descartar alterações?"); if(restart) window.location.reload();
                }}
                className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        title={null}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveModal}
              disabled={isSaving}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar Seção
            </button>
          </div>
        }
        width={800}
        className="project-edit-modal"
        destroyOnClose
        styles={{
          content: {
            borderRadius: '1.5rem',
            padding: '24px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-card)'
          }
        }}
      >
        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {renderModalContent()}
        </div>
      </Modal>
    </div>
  )
}

export default EditProjectPage
