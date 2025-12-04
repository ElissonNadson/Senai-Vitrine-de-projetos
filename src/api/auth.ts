/**
 * API de Autenticação - Sincronizado com API_DOCUMENTATION.md
 * Nota: Login/Registro por email não está disponível na nova API
 * Apenas Google OAuth é suportado
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG } from './config'

// Interfaces para as requisições de autenticação
export interface LoginRequest {
  login: string
  senha: string
}

export interface RegisterRequest {
  login: string
  senha: string
  nome: string
  tipo: 'PROFESSOR' | 'ALUNO'
  aceiteTermos: boolean
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  usuariosEntity: {
    uuid: string
    nome: string
    email: string
    tipo: 'PROFESSOR' | 'ALUNO'
    status?: string
    primeiroAcesso?: boolean
  }
}

// API de autenticação
export const authApi = {
  // Login com Google OAuth (redireciona para o Google)
  loginWithGoogle: () => {
    window.location.href = `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH.GOOGLE_OAUTH}`
  },

  // Verificar se o usuário está autenticado
  me: async (): Promise<AuthResponse['usuariosEntity']> => {
    console.log('👤 Verificando usuário autenticado...')
    
    try {
      const response = await axiosInstance.get(API_CONFIG.AUTH.ME)
      console.log('✅ Usuário autenticado:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Erro ao verificar autenticação:', error.response?.data || error.message)
      throw new Error('Sessão expirada. Faça login novamente.')
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    console.log('🚪 Fazendo logout...')
    
    try {
      await axiosInstance.post(API_CONFIG.AUTH.LOGOUT)
      console.log('✅ Logout bem-sucedido')
    } catch (error: any) {
      console.error('❌ Erro no logout:', error.response?.data || error.message)
    }
  },

  // Refresh token
  refreshToken: async (token: string): Promise<AuthResponse> => {
    console.log('🔄 Renovando token...')
    
    try {
      const response = await axiosInstance.post(API_CONFIG.AUTH.REFRESH, { token })
      console.log('✅ Token renovado com sucesso')
      return response.data
    } catch (error: any) {
      console.error('❌ Erro ao renovar token:', error.response?.data || error.message)
      throw new Error('Sessão expirada. Faça login novamente.')
    }
  },

  // Login com email/senha (não implementado na nova API - mantido para compatibilidade)
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.warn('⚠️ Login com email/senha não está disponível. Use Google OAuth.')
    throw new Error('Login com email/senha não está disponível. Por favor, use o login com Google.')
  },

  // Registro (não implementado na nova API - mantido para compatibilidade)
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    console.warn('⚠️ Registro não está disponível. Use Google OAuth.')
    throw new Error('Registro não está disponível. Por favor, use o login com Google.')
  }
}
