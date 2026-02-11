import { useState, useCallback } from 'react'

export type ErrorCategory =
    | 'TITULO_DUPLICADO'
    | 'SEM_PERMISSAO'
    | 'VALIDACAO_DADOS'
    | 'EQUIPE_INVALIDA'
    | 'LIDER_NAO_DEFINIDO'
    | 'TERMOS_NAO_ACEITOS'
    | 'PROJETO_NAO_ENCONTRADO'
    | 'ERRO_REDE'
    | 'ERRO_SERVIDOR'

export interface ErrorModalState {
    isOpen: boolean
    category: ErrorCategory
    title: string
    subtitle: string
    message: string
    details?: string[]
    actionLabel: string
    actionType: 'close' | 'navigate' | 'retry'
    navigateTarget?: number // step index para navegação
}

const defaultState: ErrorModalState = {
    isOpen: false,
    category: 'ERRO_SERVIDOR',
    title: '',
    subtitle: '',
    message: '',
    actionLabel: 'Entendi',
    actionType: 'close',
}

/**
 * Classifica o erro da API pelo status HTTP e conteúdo da mensagem
 */
function classifyError(status: number, msg: string): ErrorModalState {
    const msgLower = msg.toLowerCase()

    // 409 — Título duplicado
    if (status === 409 || msgLower.includes('já existe um projeto com este título')) {
        return {
            isOpen: true,
            category: 'TITULO_DUPLICADO',
            title: 'Título já existe',
            subtitle: 'Conflito detectado',
            message: 'Já existe outro projeto publicado com este título. Por favor, escolha um título diferente para o seu projeto.',
            actionLabel: 'Alterar Título',
            actionType: 'navigate',
            navigateTarget: 1, // Step 1 - Informações Básicas
        }
    }

    // 404 — Projeto não encontrado
    if (status === 404 || msgLower.includes('projeto não encontrado')) {
        return {
            isOpen: true,
            category: 'PROJETO_NAO_ENCONTRADO',
            title: 'Projeto não encontrado',
            subtitle: 'Recurso indisponível',
            message: 'O projeto que você está tentando acessar não foi encontrado. Ele pode ter sido removido ou o link está incorreto.',
            actionLabel: 'Voltar',
            actionType: 'close',
        }
    }

    // 403 — Sem permissão
    if (status === 403) {
        if (msgLower.includes('apenas alunos') || msgLower.includes('apenas docentes')) {
            return {
                isOpen: true,
                category: 'SEM_PERMISSAO',
                title: 'Ação não permitida',
                subtitle: 'Tipo de usuário incompatível',
                message: 'Seu tipo de conta não possui permissão para esta ação. Apenas alunos, docentes e administradores podem criar projetos.',
                actionLabel: 'Entendi',
                actionType: 'close',
            }
        }
        return {
            isOpen: true,
            category: 'SEM_PERMISSAO',
            title: 'Sem permissão',
            subtitle: 'Acesso negado',
            message: 'Você não tem permissão para editar este projeto. Apenas o líder, membros da equipe e orientadores podem fazer alterações.',
            actionLabel: 'Entendi',
            actionType: 'close',
        }
    }

    // 400 — Validações diversas
    if (status === 400) {
        // Líder não definido (para publicação)
        if (msgLower.includes('aluno líder') || msgLower.includes('exatamente 1 líder')) {
            return {
                isOpen: true,
                category: 'LIDER_NAO_DEFINIDO',
                title: 'Líder não definido',
                subtitle: 'Equipe incompleta',
                message: 'Para publicar o projeto, é obrigatório definir um Aluno Líder. Volte para a etapa de "Equipe" e selecione um líder.',
                actionLabel: 'Definir Líder',
                actionType: 'navigate',
                navigateTarget: 3, // Step 3 - Equipe
            }
        }

        // Alunos/Docentes não encontrados
        if (msgLower.includes('alunos não foram encontrados') || msgLower.includes('docentes não foram encontrados')) {
            const emailsMatch = msg.match(/: (.+)$/)
            const emails = emailsMatch ? emailsMatch[1].split(', ') : []
            return {
                isOpen: true,
                category: 'EQUIPE_INVALIDA',
                title: 'Membros não encontrados',
                subtitle: 'Problema na equipe',
                message: 'Alguns membros da equipe não foram encontrados no sistema. Verifique se os e-mails estão corretos.',
                details: emails.length > 0 ? emails : undefined,
                actionLabel: 'Revisar Equipe',
                actionType: 'navigate',
                navigateTarget: 3, // Step 3 - Equipe
            }
        }

        // Termos de uso
        if (msgLower.includes('termos de uso') || msgLower.includes('aceitar os termos')) {
            return {
                isOpen: true,
                category: 'TERMOS_NAO_ACEITOS',
                title: 'Termos não aceitos',
                subtitle: 'Ação necessária',
                message: 'Para publicar o projeto, você deve aceitar os Termos de Uso e Política de Privacidade na tela de revisão.',
                actionLabel: 'Aceitar Termos',
                actionType: 'close',
            }
        }

        // Usuários não encontrados (resolução de e-mails)
        if (msgLower.includes('usuários não encontrados') || msgLower.includes('não foi encontrado')) {
            const emailsMatch = msg.match(/: (.+)\./)
            const emails = emailsMatch ? emailsMatch[1].split(', ') : []
            return {
                isOpen: true,
                category: 'EQUIPE_INVALIDA',
                title: 'E-mails não encontrados',
                subtitle: 'Problema na equipe',
                message: 'Alguns e-mails informados não correspondem a usuários cadastrados na plataforma. Verifique se estão corretos.',
                details: emails.length > 0 ? emails : undefined,
                actionLabel: 'Revisar Equipe',
                actionType: 'navigate',
                navigateTarget: 3,
            }
        }

        // Docente não pode ser autor
        if (msgLower.includes('é um docente') && msgLower.includes('não pode ser autor')) {
            return {
                isOpen: true,
                category: 'EQUIPE_INVALIDA',
                title: 'Tipo de membro incorreto',
                subtitle: 'Problema na equipe',
                message: msg,
                actionLabel: 'Revisar Equipe',
                actionType: 'navigate',
                navigateTarget: 3,
            }
        }

        // Validação genérica de DTO (campos obrigatórios, tamanhos, etc.)
        // A API retorna um array de mensagens em caso de validação
        const validationMessages = extractValidationMessages(msg)
        return {
            isOpen: true,
            category: 'VALIDACAO_DADOS',
            title: 'Dados inválidos',
            subtitle: 'Corrija os campos abaixo',
            message: 'Alguns campos não atendem aos requisitos mínimos. Revise as informações e tente novamente.',
            details: validationMessages.length > 0 ? validationMessages : [msg],
            actionLabel: 'Corrigir',
            actionType: 'close',
        }
    }

    // Erro de rede (sem status ou status 0)
    if (status === 0 || !status) {
        return {
            isOpen: true,
            category: 'ERRO_REDE',
            title: 'Sem conexão',
            subtitle: 'Erro de rede',
            message: 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.',
            actionLabel: 'Tentar Novamente',
            actionType: 'retry',
        }
    }

    // 5xx — Erro do servidor
    if (status >= 500) {
        return {
            isOpen: true,
            category: 'ERRO_SERVIDOR',
            title: 'Erro no servidor',
            subtitle: 'Erro interno',
            message: 'Ocorreu um erro inesperado no servidor. Por favor, tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.',
            actionLabel: 'Tentar Novamente',
            actionType: 'retry',
        }
    }

    // Fallback genérico
    return {
        isOpen: true,
        category: 'ERRO_SERVIDOR',
        title: 'Erro inesperado',
        subtitle: 'Algo deu errado',
        message: msg || 'Ocorreu um erro inesperado. Tente novamente.',
        actionLabel: 'Entendi',
        actionType: 'close',
    }
}

/**
 * Extrai mensagens de validação do NestJS (pode vir como array ou string)
 */
function extractValidationMessages(msg: string): string[] {
    // NestJS retorna validações como array ou string separada por vírgulas
    try {
        const parsed = JSON.parse(msg)
        if (Array.isArray(parsed)) return parsed
    } catch {
        // Se não é JSON, tenta split por vírgula ou ponto-e-vírgula
        if (msg.includes(';')) return msg.split(';').map(s => s.trim()).filter(Boolean)
    }
    return []
}

export function useErrorModal() {
    const [errorState, setErrorState] = useState<ErrorModalState>(defaultState)

    const showError = useCallback((error: unknown) => {
        const axiosError = error as {
            response?: { status?: number; data?: { message?: string | string[] } }
            message?: string
            code?: string
        }

        let status = axiosError?.response?.status || 0
        let msg = ''

        // Extrair mensagem
        const responseMessage = axiosError?.response?.data?.message
        if (Array.isArray(responseMessage)) {
            msg = responseMessage.join('; ')
        } else if (typeof responseMessage === 'string') {
            msg = responseMessage
        } else if (axiosError?.message) {
            msg = axiosError.message
        }

        // Detectar erros de rede (axios codes)
        if (axiosError?.code === 'ERR_NETWORK' || axiosError?.code === 'ECONNABORTED') {
            status = 0
        }

        const errorModal = classifyError(status, msg)
        setErrorState(errorModal)
    }, [])

    const clearError = useCallback(() => {
        setErrorState(defaultState)
    }, [])

    return {
        errorState,
        showError,
        clearError,
    }
}
