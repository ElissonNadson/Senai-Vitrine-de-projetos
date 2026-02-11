import type { TeamMember, Advisor } from '@/components/project/ProjectTeam'
import { Lightbulb, FileText, Wrench, Rocket } from 'lucide-react'

interface Attachment {
  id: string
  file: File
  type: string
}

interface PhaseData {
  descricao: string
  anexos: Attachment[]
}

export interface ReviewFormData {
  status?: string
  curso: string
  turma: string
  itinerario: string
  unidadeCurricular: string
  senaiLab: string
  sagaSenai: string
  participouEdital: string
  ganhouPremio: string
  titulo: string
  descricao: string
  categoria: string
  modalidade: string
  autores: string[]
  orientador: string
  liderEmail: string
  isLeader: boolean
  banner?: File | null
  bannerUrl?: string
  ideacao: PhaseData
  modelagem: PhaseData
  prototipagem: PhaseData
  implementacao: PhaseData
  codigo?: File | null
  linkRepositorio: string
  hasRepositorio: boolean
  codigoVisibilidade: string
  anexosVisibilidade: string
  autoresMetadata?: Record<string, any>
  orientadoresMetadata?: Record<string, any>
}

/**
 * Gera a URL do banner a partir dos dados do formulário.
 * Para File usa createObjectURL, para string usa a URL diretamente.
 */
export function adaptBannerUrl(data: ReviewFormData): string | undefined {
  if (data.banner && data.banner instanceof File) {
    return URL.createObjectURL(data.banner)
  }
  return data.bannerUrl || undefined
}

/**
 * Converte a lista de emails de autores para TeamMember[] (formato do ProjectTeam).
 * Usa autoresMetadata se disponível para obter nomes reais.
 */
export function adaptTeamMembers(data: ReviewFormData): TeamMember[] {
  return data.autores.map(email => {
    const meta = data.autoresMetadata?.[email]
    return {
      nome: meta?.nome || email,
      email,
      papel: email === data.liderEmail ? 'LIDER' : 'AUTOR',
      usuario_uuid: meta?.usuario_uuid
    }
  })
}

/**
 * Converte o campo orientador (string de emails separados por vírgula) para Advisor[].
 */
export function adaptAdvisors(data: ReviewFormData): Advisor[] {
  if (!data.orientador) return []

  const emails = data.orientador.split(',').map(e => e.trim()).filter(Boolean)
  return emails.map(email => {
    const meta = data.orientadoresMetadata?.[email]
    return {
      nome: meta?.nome || email,
      email
    }
  })
}

/**
 * Converte as 4 fases do formulário para o formato Phase[] esperado pelo ProjectTimeline.
 */
export function adaptPhases(data: ReviewFormData) {
  const phaseDefs = [
    { id: 1, name: 'Ideação', key: 'ideacao' as const, icon: Lightbulb, gradient: 'from-yellow-400 to-amber-500', badge: 'bg-yellow-600', solidColor: 'bg-yellow-500', color: 'yellow' },
    { id: 2, name: 'Modelagem', key: 'modelagem' as const, icon: FileText, gradient: 'from-blue-500 to-indigo-600', badge: 'bg-blue-600', solidColor: 'bg-blue-500', color: 'blue' },
    { id: 3, name: 'Prototipagem', key: 'prototipagem' as const, icon: Wrench, gradient: 'from-purple-500 to-pink-600', badge: 'bg-purple-600', solidColor: 'bg-purple-500', color: 'purple' },
    { id: 4, name: 'Implementação', key: 'implementacao' as const, icon: Rocket, gradient: 'from-emerald-500 to-green-600', badge: 'bg-green-600', solidColor: 'bg-green-500', color: 'green' }
  ]

  // Determinar a fase atual baseado em qual tem conteúdo
  let currentPhaseId = 1
  for (const def of phaseDefs) {
    const phase = data[def.key]
    if (phase.descricao || phase.anexos.length > 0) {
      currentPhaseId = def.id
    }
  }

  const phases = phaseDefs.map(def => {
    const phaseData = data[def.key]
    const hasContent = phaseData.descricao || phaseData.anexos.length > 0

    const stages = hasContent ? [{
      id: `review-${def.key}`,
      nome: phaseData.descricao || `Documentação da fase de ${def.name}`,
      descricao: phaseData.descricao,
      anexos: phaseData.anexos.map(anexo => ({
        id: anexo.id,
        nome: anexo.file.name,
        url: URL.createObjectURL(anexo.file),
        tipo: anexo.type
      }))
    }] : []

    return {
      id: def.id,
      name: def.name,
      icon: def.icon,
      gradient: def.gradient,
      badge: def.badge,
      solidColor: def.solidColor,
      color: def.color,
      stages
    }
  })

  return { phases, currentPhaseId }
}
