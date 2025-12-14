
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import {
    getNoticias,
    getNoticiaBySlug,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    NoticiaInput
} from '../api/noticias'

// === HOOKS ===

export function useNoticias(params?: { page?: number; limit?: number; search?: string; publicOnly?: boolean; admin?: boolean }) {
    return useQuery({
        queryKey: ['noticias', params],
        queryFn: () => getNoticias(params),
        placeholderData: keepPreviousData
    })
}

export function useNoticia(slugOrId: string) {
    return useQuery({
        queryKey: ['noticia', slugOrId],
        queryFn: () => getNoticiaBySlug(slugOrId),
        enabled: !!slugOrId
    })
}

export function useCreateNoticia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: NoticiaInput) => createNoticia(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['noticias'] })
        }
    })
}

export function useUpdateNoticia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ uuid, data }: { uuid: string; data: Partial<NoticiaInput> }) => updateNoticia(uuid, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['noticias'] })
            queryClient.invalidateQueries({ queryKey: ['noticia', data.uuid] })
            queryClient.invalidateQueries({ queryKey: ['noticia', data.slug] })
        }
    })
}

export function useDeleteNoticia() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (uuid: string) => deleteNoticia(uuid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['noticias'] })
        }
    })
}

export function useIncrementView() {
    return useMutation({
        mutationFn: (uuid: string) => import('../api/noticias').then(mod => mod.incrementView(uuid))
    })
}

export function useLikeNoticia() {
    return useMutation({
        mutationFn: (uuid: string) => import('../api/noticias').then(mod => mod.likeNoticia(uuid))
    })
}

export function useUnlikeNoticia() {
    return useMutation({
        mutationFn: (uuid: string) => import('../api/noticias').then(mod => mod.unlikeNoticia(uuid))
    })
}
