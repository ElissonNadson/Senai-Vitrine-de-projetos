import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import {
  LoginMutation,
  RegisterMutation,
  CreateAlunoMutation,
  CreateEnderecoMutation,
  CreateDocenteMutation,
  CreateUnidadeCurricularMutation,
  CreateProjetoMutation,
  CreateDisciplinaMutation,
  CreateDisciplinaProjetoMutation,
  CreateProjetoAlunoMutation,
  CreateProjetoDocenteMutation,
  CreateEtapaProjetoMutation,
  CreateAnexoEtapaMutation
} from '../types/types-mutations'
import {
  Login,
  Register,
  createAluno,
  createEndereco,
  createDocente,
  createUnidadeCurricular,
  createProjeto,
  createDisciplina,
  createDisciplinaProjeto,
  createProjetoAluno,
  createProjetoDocente,
  createEtapaProjeto,
  createAnexoEtapa
} from '../api/mutations'

export function useLoginAuth(
  options?: UseMutationOptions<any, Error, LoginMutation>
) {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: (payload: LoginMutation) => Login(payload),
    retry: 0,
    ...options
  })
}

export function useRegisterAuth(
  options?: UseMutationOptions<any, Error, RegisterMutation>
) {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: (payload: RegisterMutation) => Register(payload),
    retry: 0,
    ...options
  })
}

// Aluno
export function useCreateAluno(
  options?: UseMutationOptions<any, Error, CreateAlunoMutation>
) {
  return useMutation({
    mutationKey: ['createAluno'],
    mutationFn: (payload: CreateAlunoMutation) => createAluno(payload),
    retry: 0,
    ...options
  })
}

// Endereço
export function useCreateEndereco(
  options?: UseMutationOptions<any, Error, CreateEnderecoMutation>
) {
  return useMutation({
    mutationKey: ['createEndereco'],
    mutationFn: (payload: CreateEnderecoMutation) => createEndereco(payload),
    retry: 0,
    ...options
  })
}

// Docente
export function useCreateDocente(
  options?: UseMutationOptions<any, Error, CreateDocenteMutation>
) {
  return useMutation({
    mutationKey: ['createDocente'],
    mutationFn: (payload: CreateDocenteMutation) => createDocente(payload),
    retry: 0,
    ...options
  })
}

// Unidade Curricular
export function useCreateUnidadeCurricular(
  options?: UseMutationOptions<any, Error, CreateUnidadeCurricularMutation>
) {
  return useMutation({
    mutationKey: ['createUnidadeCurricular'],
    mutationFn: (payload: CreateUnidadeCurricularMutation) =>
      createUnidadeCurricular(payload),
    retry: 0,
    ...options
  })
}

// Projeto
export function useCreateProjeto(
  options?: UseMutationOptions<any, Error, CreateProjetoMutation>
) {
  return useMutation({
    mutationKey: ['createProjeto'],
    mutationFn: (payload: CreateProjetoMutation) => createProjeto(payload),
    retry: 0,
    ...options
  })
}

// Disciplina
export function useCreateDisciplina(
  options?: UseMutationOptions<any, Error, CreateDisciplinaMutation>
) {
  return useMutation({
    mutationKey: ['createDisciplina'],
    mutationFn: (payload: CreateDisciplinaMutation) =>
      createDisciplina(payload),
    retry: 0,
    ...options
  })
}

// Disciplina Projeto
export function useCreateDisciplinaProjeto(
  options?: UseMutationOptions<any, Error, CreateDisciplinaProjetoMutation>
) {
  return useMutation({
    mutationKey: ['createDisciplinaProjeto'],
    mutationFn: (payload: CreateDisciplinaProjetoMutation) =>
      createDisciplinaProjeto(payload),
    retry: 0,
    ...options
  })
}

// Projeto Aluno
export function useCreateProjetoAluno(
  options?: UseMutationOptions<any, Error, CreateProjetoAlunoMutation>
) {
  return useMutation({
    mutationKey: ['createProjetoAluno'],
    mutationFn: (payload: CreateProjetoAlunoMutation) =>
      createProjetoAluno(payload),
    retry: 0,
    ...options
  })
}

// Projeto Docente
export function useCreateProjetoDocente(
  options?: UseMutationOptions<any, Error, CreateProjetoDocenteMutation>
) {
  return useMutation({
    mutationKey: ['createProjetoDocente'],
    mutationFn: (payload: CreateProjetoDocenteMutation) =>
      createProjetoDocente(payload),
    retry: 0,
    ...options
  })
}

// Etapa Projeto
export function useCreateEtapaProjeto(
  options?: UseMutationOptions<any, Error, CreateEtapaProjetoMutation>
) {
  return useMutation({
    mutationKey: ['createEtapaProjeto'],
    mutationFn: (payload: CreateEtapaProjetoMutation) =>
      createEtapaProjeto(payload),
    retry: 0,
    ...options
  })
}

// Anexo Etapa
export function useCreateAnexoEtapa(
  options?: UseMutationOptions<any, Error, CreateAnexoEtapaMutation>
) {
  return useMutation({
    mutationKey: ['createAnexoEtapa'],
    mutationFn: (payload: CreateAnexoEtapaMutation) =>
      createAnexoEtapa(payload),
    retry: 0,
    ...options
  })
}
