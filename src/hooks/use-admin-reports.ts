import { useQuery } from '@tanstack/react-query';
import { adminReportsApi, ReportFilters } from '@/api/admin-reports';

export function useAdminOverview(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-overview', filters],
    queryFn: () => adminReportsApi.getOverview(filters),
    staleTime: 60000,
  });
}

export function useProjetosPorCurso(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-projetos-curso', filters],
    queryFn: () => adminReportsApi.getProjetosPorCurso(filters),
    staleTime: 60000,
  });
}

export function useProjetosPorModalidade(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-projetos-modalidade', filters],
    queryFn: () => adminReportsApi.getProjetosPorModalidade(filters),
    staleTime: 60000,
  });
}

export function useProjetosPorUnidadeCurricular(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-projetos-uc', filters],
    queryFn: () => adminReportsApi.getProjetosPorUnidadeCurricular(filters),
    staleTime: 60000,
  });
}

export function useProjetosPorTurma(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-projetos-turma', filters],
    queryFn: () => adminReportsApi.getProjetosPorTurma(filters),
    staleTime: 60000,
  });
}

export function useDistribuicaoFases(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-distribuicao-fases', filters],
    queryFn: () => adminReportsApi.getDistribuicaoFases(filters),
    staleTime: 60000,
  });
}

export function useTaxaAvancoFases(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-taxa-avanco', filters],
    queryFn: () => adminReportsApi.getTaxaAvancoFases(filters),
    staleTime: 60000,
  });
}

export function useProjetosPorDocente(filters: ReportFilters = {}, limit = 10) {
  return useQuery({
    queryKey: ['admin-projetos-docente', filters, limit],
    queryFn: () => adminReportsApi.getProjetosPorDocente(filters, limit),
    staleTime: 60000,
  });
}

export function useTaxaParticipacao(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-taxa-participacao', filters],
    queryFn: () => adminReportsApi.getTaxaParticipacao(filters),
    staleTime: 60000,
  });
}

export function useSenaiLabPorFase(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-senai-lab-fase', filters],
    queryFn: () => adminReportsApi.getSenaiLabPorFase(filters),
    staleTime: 60000,
  });
}

export function useTimelineCriacao(filters: ReportFilters = {}, agrupamento: 'mensal' | 'semanal' = 'mensal') {
  return useQuery({
    queryKey: ['admin-timeline-criacao', filters, agrupamento],
    queryFn: () => adminReportsApi.getTimelineCriacao(filters, agrupamento),
    staleTime: 60000,
  });
}

export function useComportamentoOrientadores(filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-comportamento-orientadores', filters],
    queryFn: () => adminReportsApi.getComportamentoOrientadores(filters),
    staleTime: 60000,
  });
}

export function useHistoricoOrientador(orientadorUuid: string, filters: ReportFilters = {}) {
  return useQuery({
    queryKey: ['admin-historico-orientador', orientadorUuid, filters],
    queryFn: () => adminReportsApi.getHistoricoOrientador(orientadorUuid, filters),
    enabled: !!orientadorUuid,
    staleTime: 60000,
  });
}

export function useNoticiasOverview() {
  return useQuery({
    queryKey: ['admin-noticias-overview'],
    queryFn: () => adminReportsApi.getNoticiasOverview(),
    staleTime: 60000,
  });
}

export function useNoticiasPorCategoria() {
  return useQuery({
    queryKey: ['admin-noticias-categoria'],
    queryFn: () => adminReportsApi.getNoticiasPorCategoria(),
    staleTime: 60000,
  });
}

export function useNoticiasEngajamento(limit = 20) {
  return useQuery({
    queryKey: ['admin-noticias-engajamento', limit],
    queryFn: () => adminReportsApi.getNoticiasEngajamento(limit),
    staleTime: 60000,
  });
}

export function useNoticiasTimeline() {
  return useQuery({
    queryKey: ['admin-noticias-timeline'],
    queryFn: () => adminReportsApi.getNoticiasTimeline(),
    staleTime: 60000,
  });
}

export function useFilterOptions() {
  return useQuery({
    queryKey: ['admin-filter-options'],
    queryFn: () => adminReportsApi.getFilterOptions(),
    staleTime: 300000,
  });
}
