import api from '@/services/api';

export interface AdminProjetosFilters {
  status?: string;
  fase_atual?: string;
  curso?: string;
  departamento_uuid?: string;
  busca?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: 'ASC' | 'DESC';
}

export const adminProjetosApi = {
  listarTodos: (filters: AdminProjetosFilters = {}) =>
    api.get('/admin/projetos', { params: filters }).then(r => r.data),

  alterarStatus: (uuid: string, status: string, observacao?: string) =>
    api.patch(`/admin/projetos/${uuid}/status`, { status, observacao }).then(r => r.data),

  alterarFase: (uuid: string, fase: string, observacao?: string) =>
    api.patch(`/admin/projetos/${uuid}/fase`, { fase, observacao }).then(r => r.data),

  removerIntegrante: (projetoUuid: string, usuarioUuid: string) =>
    api.delete(`/admin/projetos/${projetoUuid}/integrante/${usuarioUuid}`).then(r => r.data),

  alterarPapelIntegrante: (projetoUuid: string, usuarioUuid: string, papel: string) =>
    api.patch(`/admin/projetos/${projetoUuid}/integrante/${usuarioUuid}`, { papel }).then(r => r.data),

  excluirProjeto: (uuid: string) =>
    api.delete(`/admin/projetos/${uuid}`).then(r => r.data),
};
