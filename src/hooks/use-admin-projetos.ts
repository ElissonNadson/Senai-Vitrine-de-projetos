import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProjetosApi } from '@/api/admin-projetos';
import toast from 'react-hot-toast';

export function useAdminProjetos(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['admin-projetos', params],
    queryFn: () => adminProjetosApi.listarTodos(params),
    staleTime: 30000,
  });
}

export function useAlterarStatusProjeto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, status, observacao }: { uuid: string; status: string; observacao?: string }) =>
      adminProjetosApi.alterarStatus(uuid, status, observacao),
    onSuccess: (_data, variables) => {
      toast.success(`Status alterado para ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['admin-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
    },
    onError: () => {
      toast.error('Erro ao alterar status');
    },
  });
}

export function useAlterarFaseProjeto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, fase, observacao }: { uuid: string; fase: string; observacao?: string }) =>
      adminProjetosApi.alterarFase(uuid, fase, observacao),
    onSuccess: (_data, variables) => {
      const labels: Record<string, string> = { IDEACAO: 'Ideação', MODELAGEM: 'Modelagem', PROTOTIPAGEM: 'Prototipagem', IMPLEMENTACAO: 'Implementação' };
      toast.success(`Fase alterada para ${labels[variables.fase] || variables.fase}`);
      queryClient.invalidateQueries({ queryKey: ['admin-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-distribuicao-fases'] });
    },
    onError: () => {
      toast.error('Erro ao alterar fase');
    },
  });
}

export function useRemoverIntegrante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projetoUuid, usuarioUuid }: { projetoUuid: string; usuarioUuid: string }) =>
      adminProjetosApi.removerIntegrante(projetoUuid, usuarioUuid),
    onSuccess: () => {
      toast.success('Integrante removido');
      queryClient.invalidateQueries({ queryKey: ['admin-projetos'] });
    },
    onError: () => {
      toast.error('Erro ao remover integrante');
    },
  });
}

export function useAlterarPapelIntegrante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projetoUuid, usuarioUuid, papel }: { projetoUuid: string; usuarioUuid: string; papel: string }) =>
      adminProjetosApi.alterarPapelIntegrante(projetoUuid, usuarioUuid, papel),
    onSuccess: () => {
      toast.success('Papel alterado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['admin-projetos'] });
    },
    onError: () => {
      toast.error('Erro ao alterar papel');
    },
  });
}

export function useExcluirProjeto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => adminProjetosApi.excluirProjeto(uuid),
    onSuccess: () => {
      toast.success('Projeto excluído com sucesso');
      queryClient.invalidateQueries({ queryKey: ['admin-projetos'] });
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
    },
    onError: () => {
      toast.error('Erro ao excluir projeto');
    },
  });
}
