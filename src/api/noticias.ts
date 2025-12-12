import axiosInstance from '../services/axios-instance'

export interface Noticia {
    uuid: string
    titulo: string
    resumo: string
    conteudo: string
    banner_url: string
    data_evento?: string
    local_evento?: string
    categoria: string
    publicado: boolean
    destaque: boolean
    autor_uuid: string
    slug: string
    criado_em: string
    atualizado_em: string
    autor_nome?: string
    autor_avatar?: string
    visualizacoes: number
    curtidas: number
}

export interface NoticiaInput {
    titulo: string
    resumo: string
    conteudo: string
    bannerUrl: string
    dataEvento?: string
    localEvento?: string
    categoria?: string
    publicado?: boolean
    destaque?: boolean
}

export interface NoticiasResponse {
    data: Noticia[]
    total: number
    page: number
    limit: number
}

// === QUERIES ===

export const getNoticias = async (params?: { page?: number; limit?: number; search?: string; publicOnly?: boolean }): Promise<NoticiasResponse> => {
    const { data } = await axiosInstance.get('/noticias', { params })
    return data
}

export const getNoticiaBySlug = async (slugOrId: string): Promise<Noticia> => {
    const { data } = await axiosInstance.get(`/noticias/${slugOrId}`)
    return data
}

// === MUTATIONS ===

export const createNoticia = async (noticia: NoticiaInput): Promise<Noticia> => {
    const { data } = await axiosInstance.post('/noticias', noticia)
    return data
}

export const updateNoticia = async (uuid: string, noticia: Partial<NoticiaInput>): Promise<Noticia> => {
    const { data } = await axiosInstance.patch(`/noticias/${uuid}`, noticia)
    return data
}

export const deleteNoticia = async (uuid: string): Promise<void> => {
    await axiosInstance.delete(`/noticias/${uuid}`)
}

export const incrementView = async (uuid: string): Promise<Noticia> => {
    const { data } = await axiosInstance.post(`/noticias/${uuid}/view`)
    return data
}

export const likeNoticia = async (uuid: string): Promise<Noticia> => {
    const { data } = await axiosInstance.post(`/noticias/${uuid}/like`)
    return data
}

export const unlikeNoticia = async (uuid: string): Promise<Noticia> => {
    const { data } = await axiosInstance.post(`/noticias/${uuid}/unlike`)
    return data
}
