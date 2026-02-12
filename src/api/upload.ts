/**
 * API de Upload - Sincronizado com API_DOCUMENTATION.md
 * Upload de arquivos (banner, avatar, anexos)
 */

import axiosInstance from '../services/axios-instance'
import { API_CONFIG, TipoAnexo } from './config'

// ============ INTERFACES ============

export interface UploadResponse {
  url: string
  mensagem: string
}

export interface TiposSuportados {
  banner: {
    extensoes: string[]
    maxSize: string
  }
  avatar: {
    extensoes: string[]
    maxSize: string
  }
  documento: {
    extensoes: string[]
    maxSize: string
  }
  imagem: {
    extensoes: string[]
    maxSize: string
  }
  video: {
    extensoes: string[]
    maxSize: string
  }
}

// ============ LIMITES DE UPLOAD ============

export const LIMITES_UPLOAD = {
  BANNER: {
    maxSize: 5 * 1024 * 1024, // 5MB
    extensoes: ['jpg', 'jpeg', 'png', 'webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  AVATAR: {
    maxSize: 2 * 1024 * 1024, // 2MB
    extensoes: ['jpg', 'jpeg', 'png', 'webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  },
  DOCUMENTO: {
    maxSize: 10 * 1024 * 1024, // 10MB
    extensoes: ['pdf', 'doc', 'docx', 'txt', 'xlsx', 'xls', 'pptx', 'ppt'],
    mimeTypes: [
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
  },
  IMAGEM: {
    maxSize: 5 * 1024 * 1024, // 5MB
    extensoes: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  },
  VIDEO: {
    maxSize: 50 * 1024 * 1024, // 50MB
    extensoes: ['mp4', 'avi', 'mov', 'webm'],
    mimeTypes: ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/webm']
  },
  ANEXO_GERAL: {
    maxSize: 50 * 1024 * 1024, // 50MB
    extensoes: [
      'pdf', 'doc', 'docx', 'txt', 'xlsx', 'xls', 'pptx', 'ppt',
      'jpg', 'jpeg', 'png', 'webp', 'gif',
      'mp4', 'webm', 'avi', 'mov',
      'mp3', 'zip', 'rar', '7z', 'tar', 'gz',
      'fig', 'stl', 'obj'
    ],
    mimeTypes: [
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/x-msvideo', 'video/quicktime',
      'audio/mpeg', 'audio/mp3',
      'application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed',
      'application/x-tar', 'application/gzip',
      'application/octet-stream', 'model/stl', 'model/obj'
    ]
  }
}

// ============ FUNÇÕES DE UPLOAD ============

/**
 * Upload de banner
 * POST /upload/banner
 */
export async function uploadBanner(file: File, context?: string): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.post(API_CONFIG.UPLOAD.BANNER, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: { context }
  })
  return response.data
}

/**
 * Upload de avatar
 * POST /upload/avatar
 */
export async function uploadAvatar(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.post(API_CONFIG.UPLOAD.AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

/**
 * Upload de anexo
 * POST /upload/anexo?tipo=DOCUMENTO|IMAGEM|VIDEO
 */
export async function uploadAnexo(file: File, tipo: TipoAnexo): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.post(API_CONFIG.UPLOAD.ANEXO, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    params: { tipo }
  })
  return response.data
}

/**
 * Buscar tipos suportados
 * GET /upload/tipos
 */
export async function getTiposSuportados(): Promise<TiposSuportados> {
  const response = await axiosInstance.get(API_CONFIG.UPLOAD.TIPOS)
  return response.data
}

// ============ UTILITÁRIOS ============

/**
 * Valida arquivo antes do upload
 */
export function validarArquivo(
  file: File,
  tipo: 'BANNER' | 'AVATAR' | 'DOCUMENTO' | 'IMAGEM' | 'VIDEO'
): { valido: boolean; erro?: string } {
  const limites = LIMITES_UPLOAD[tipo]

  // Verifica tamanho
  if (file.size > limites.maxSize) {
    const maxMB = limites.maxSize / (1024 * 1024)
    return {
      valido: false,
      erro: `Arquivo muito grande. Tamanho máximo: ${maxMB}MB`
    }
  }

  // Verifica tipo MIME
  if (!limites.mimeTypes.includes(file.type)) {
    return {
      valido: false,
      erro: `Tipo de arquivo não suportado. Tipos aceitos: ${limites.extensoes.join(', ')}`
    }
  }

  return { valido: true }
}

/**
 * Formata tamanho do arquivo
 */
export function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
