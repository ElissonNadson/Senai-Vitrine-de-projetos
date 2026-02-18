import api from '@/services/api';

export interface ReportFilters {
  periodo_inicio?: string;
  periodo_fim?: string;
  departamento_uuid?: string;
  status?: string;
  fase_atual?: string;
  curso?: string;
  modalidade?: string;
  turma?: string;
  unidade_curricular?: string;
}

function toParams(filters: ReportFilters) {
  const params: Record<string, string> = {};
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') params[key] = value;
  });
  return params;
}

export const adminReportsApi = {
  getOverview: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/overview', { params: toParams(filters) }).then(r => r.data),

  getProjetosPorCurso: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/projetos-por-curso', { params: toParams(filters) }).then(r => r.data),

  getProjetosPorModalidade: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/projetos-por-modalidade', { params: toParams(filters) }).then(r => r.data),

  getProjetosPorUnidadeCurricular: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/projetos-por-unidade-curricular', { params: toParams(filters) }).then(r => r.data),

  getProjetosPorTurma: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/projetos-por-turma', { params: toParams(filters) }).then(r => r.data),

  getDistribuicaoFases: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/distribuicao-fases', { params: toParams(filters) }).then(r => r.data),

  getTaxaAvancoFases: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/taxa-avanco-fases', { params: toParams(filters) }).then(r => r.data),

  getProjetosPorDocente: (filters: ReportFilters = {}, limit = 10) =>
    api.get('/admin/reports/projetos-por-docente', { params: { ...toParams(filters), limit: String(limit) } }).then(r => r.data),

  getTaxaParticipacao: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/taxa-participacao', { params: toParams(filters) }).then(r => r.data),

  getSenaiLabPorFase: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/senai-lab-por-fase', { params: toParams(filters) }).then(r => r.data),

  getTimelineCriacao: (filters: ReportFilters = {}, agrupamento: 'mensal' | 'semanal' = 'mensal') =>
    api.get('/admin/reports/timeline-criacao', { params: { ...toParams(filters), agrupamento } }).then(r => r.data),

  getComportamentoOrientadores: (filters: ReportFilters = {}) =>
    api.get('/admin/reports/comportamento-orientadores', { params: toParams(filters) }).then(r => r.data),

  getHistoricoOrientador: (orientadorUuid: string, filters: ReportFilters = {}) =>
    api.get('/admin/reports/historico-orientador', { params: { ...toParams(filters), orientador_uuid: orientadorUuid } }).then(r => r.data),

  getNoticiasOverview: () =>
    api.get('/admin/reports/noticias-overview').then(r => r.data),

  getNoticiasPorCategoria: () =>
    api.get('/admin/reports/noticias-por-categoria').then(r => r.data),

  getNoticiasEngajamento: (limit = 20) =>
    api.get('/admin/reports/noticias-engajamento', { params: { limit: String(limit) } }).then(r => r.data),

  getNoticiasTimeline: () =>
    api.get('/admin/reports/noticias-timeline').then(r => r.data),

  getFilterOptions: () =>
    api.get('/admin/reports/filter-options').then(r => r.data),

  exportExcel: (indicadores: string[], filters: ReportFilters = {}) =>
    api.get('/admin/reports/export', {
      params: { ...toParams(filters), indicadores },
      responseType: 'blob',
    }).then(r => {
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-admin-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }),
};
