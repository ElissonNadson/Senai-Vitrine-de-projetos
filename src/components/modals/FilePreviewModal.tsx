import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, FileText, Image as ImageIcon, FileCode, PlaySquare } from 'lucide-react'
import { FormEvent, useEffect } from 'react'

// Interface para o anexo, espelhando o que temos em project-timeline
interface Anexo {
    id: string;
    nome?: string;
    nomeArquivo?: string;
    url?: string;
    etapa_id?: number | string;
}

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    anexo: Anexo | null;
}

export function FilePreviewModal({ isOpen, onClose, anexo }: FilePreviewModalProps) {
    // Fecha com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!isOpen || !anexo || !anexo.url) return null

    // Helper para determinar displayName (mesma lógica do timeline)
    const getAnexoDisplayName = (an: Anexo) => {
        if (an.nome && !an.nome.startsWith('anexo_etapa_')) {
            return an.nome;
        }
        return an.nomeArquivo || 'Anexo';
    }

    const displayName = getAnexoDisplayName(anexo)
    const originalFileName = anexo.nomeArquivo || anexo.nome || 'anexo'

    // Auxiliar estrito para evitar vazar nome na UI quando indesejado
    // Mas como estamos dentro do visualizador que o user explicitamente pediu pra abrir:
    // Renderizamos apenas o "displayName" para titulo e se for download forçamos a aba/download.

    // Tentar inferir o tipo do arquivo pela extensão
    const extensionMatch = originalFileName.match(/\.([^.]+)$/)
    const extension = extensionMatch ? extensionMatch[1].toLowerCase() : ''

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)
    const isVideo = ['mp4', 'webm', 'ogg', 'mov'].includes(extension)
    const isPdf = ['pdf'].includes(extension)

    // Tipagem não suportada nativamente para preview embedado
    const isUnsupportedPreview = !isImage && !isVideo && !isPdf

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    // Prevenir que cliques no conteúdo fechem o modal
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

    function getFallbackIcon() {
        if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) return <FileText className="w-16 h-16 text-blue-400" />
        if (['zip', 'rar', 'tar', 'gz'].includes(extension)) return <FileCode className="w-16 h-16 text-amber-500" />
        return <FileText className="w-16 h-16 text-gray-400" />
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleBackdropClick}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={stopPropagation}
                    className="relative w-[96vw] h-[96vh] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4">
                            {displayName}
                        </h3>

                        <div className="flex items-center gap-2">
                            <a
                                href={anexo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                // Importante: No caso de AWS S3 o target _blank serve de fallback caseado.
                                download={originalFileName} // Tenta forçar o header de download no client
                                className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                title="Fazer Download do Arquivo"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Baixar</span>
                            </a>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Fechar"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-8 min-h-[50vh]">

                        {isImage && (
                            <img
                                src={anexo.url}
                                alt={displayName}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-sm"
                            />
                        )}

                        {isVideo && (
                            <video
                                src={anexo.url}
                                controls
                                className="w-full max-h-[70vh] rounded-lg shadow-sm bg-black"
                                controlsList="nodownload"
                            >
                                Seu navegador não suporta a tag de vídeo.
                            </video>
                        )}

                        {isPdf && (
                            <iframe
                                src={`${anexo.url}#toolbar=0`}
                                className="w-full h-full rounded-lg border-0 shadow-sm"
                                title={displayName}
                            />
                        )}

                        {isUnsupportedPreview && (
                            <div className="flex flex-col items-center justify-center text-center max-w-sm p-8 bg-white dark:bg-gray-900 rounded-xl shadow border border-gray-200 dark:border-gray-800">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                                    {getFallbackIcon()}
                                </div>
                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    Pré-visualização Indisponível
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Não é possível visualizar arquivos com extensão <strong>.{extension}</strong> diretamente no navegador.
                                </p>
                                <a
                                    href={anexo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-xl transition-all"
                                >
                                    <Download className="w-5 h-5" />
                                    Baixar Arquivo para Visualizar
                                </a>
                            </div>
                        )}

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
