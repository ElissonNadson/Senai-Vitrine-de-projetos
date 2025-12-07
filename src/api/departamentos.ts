/**
 * API de Departamentos - Sincronizado com API_DOCUMENTATION.md
 * Gerenciamento de departamentos
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG } from './config'

// ============ INTERFACES ============

export interface Departamento {
  uuid: string
  nome: string
  sigla: string
  cor_hex?: string
  total_professores?: number
  total_projetos?: number
}

// ============ FUNÇÕES ============

/**
 * Listar todos os departamentos
 * GET /departamentos
 */
export async function getDepartamentos(): Promise<Departamento[]> {
  const response = await axiosInstance.get(API_CONFIG.DEPARTAMENTOS.LIST)
  return response.data
}

/**
 * Buscar departamento por UUID
 * GET /departamentos/:uuid
 */
export async function getDepartamentoByUuid(uuid: string): Promise<Departamento> {
  const response = await axiosInstance.get(API_CONFIG.DEPARTAMENTOS.GET(uuid))
  return response.data
}

/**
 * Buscar departamento por sigla
 * GET /departamentos/sigla/:sigla
 */
export async function getDepartamentoBySigla(sigla: string): Promise<Departamento> {
  const response = await axiosInstance.get(API_CONFIG.DEPARTAMENTOS.GET_BY_SIGLA(sigla))
  return response.data
}
