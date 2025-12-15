import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon, Sparkles, FileWarning, Edit2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageCropModal from '../ImageCropModal'

interface ModernBannerUploaderProps {
    currentBanner: string | null
    onBannerChange: (file: File) => void
    onRemove: () => void
    className?: string
    aspect?: number
}

export const ModernBannerUploader: React.FC<ModernBannerUploaderProps> = ({
    currentBanner,
    onBannerChange,
    onRemove,
    className = '',
    aspect = 16 / 9
}) => {
    const [error, setError] = useState<string | null>(null)
    const [isCropModalOpen, setIsCropModalOpen] = useState(false)
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null)
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null)
    const [tempFileName, setTempFileName] = useState<string>('banner.jpg')

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        setError(null)

        // Handle rejections
        if (fileRejections.length > 0) {
            const rejection = fileRejections[0]
            if (rejection.errors[0].code === 'file-too-large') {
                setError('Arquivo muito grande. Máximo de 5MB.')
            } else if (rejection.errors[0].code === 'file-invalid-type') {
                setError('Tipo de arquivo inválido. Use JPG, JPEG ou PNG.')
            } else {
                setError('Erro ao carregar arquivo. Tente novamente.')
            }
            return
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0]
            setTempFileName(file.name)

            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                setTempImageSrc(result)
                setOriginalImageSrc(result) // Store original for re-editing
                setIsCropModalOpen(true)
            }
            reader.readAsDataURL(file)
        }
    }, [])

    const handleCropSave = (croppedBlob: Blob) => {
        const file = new File([croppedBlob], tempFileName, { type: 'image/jpeg' })
        onBannerChange(file)
        setIsCropModalOpen(false)
        setTempImageSrc(null)
    }

    const handleRemove = () => {
        setOriginalImageSrc(null)
        onRemove()
    }

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': [],
            'image/webp': []
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false
    })

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        // Se temos a imagem original (da sessão atual), usamos ela.
        // Se não, usamos o currentBanner (caso seja edição de algo já salvo, melhor que nada)
        const srcToEdit = originalImageSrc || currentBanner

        if (srcToEdit) {
            setTempImageSrc(srcToEdit)
            setIsCropModalOpen(true)
        }
    }

    return (
        <div className={`w-full ${className}`}>
            {/* Crop Modal */}
            {tempImageSrc && (
                <ImageCropModal
                    isOpen={isCropModalOpen}
                    imageSrc={tempImageSrc}
                    onClose={() => setIsCropModalOpen(false)}
                    onSave={handleCropSave}
                    aspect={aspect}
                />
            )}

            <AnimatePresence mode="wait">
                {currentBanner ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group rounded-2xl overflow-hidden shadow-lg border-2 border-indigo-100 dark:border-indigo-900"
                    >
                        <div className="h-64 md:h-80 w-full bg-gray-100 dark:bg-gray-800 relative">
                            <img
                                src={currentBanner}
                                alt="Banner do projeto"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Overlay with actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                <button
                                    onClick={handleEditClick}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/90 hover:bg-blue-600 text-white rounded-xl shadow-lg transition-transform hover:scale-105 font-medium backdrop-blur-md"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </button>
                                <div {...getRootProps()} className="cursor-pointer">
                                    <input {...getInputProps()} />
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-gray-900 rounded-xl shadow-lg transition-transform hover:scale-105 font-medium backdrop-blur-md">
                                        <Upload className="w-4 h-4" />
                                        Trocar
                                    </div>
                                </div>
                                <button
                                    onClick={handleRemove}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-xl shadow-lg transition-transform hover:scale-105 font-medium backdrop-blur-md"
                                >
                                    <X className="w-4 h-4" />
                                    Remover
                                </button>
                            </div>
                        </div>

                        {/* Success Badge */}
                        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-green-500/90 text-white text-xs font-semibold rounded-lg shadow-sm backdrop-blur-md flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Banner Carregado
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div
                            {...getRootProps()}
                            className={`
                                relative cursor-pointer group
                                border-2 border-dashed rounded-2xl p-8 md:p-12
                                flex flex-col items-center justify-center text-center
                                transition-all duration-300 ease-in-out
                                ${isDragActive
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 scale-[1.02]'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                }
                                ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : ''}
                                ${error ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : ''}
                            `}
                        >
                            <input {...getInputProps()} />

                            {/* Icon Container */}
                            <div className={`
                                w-16 h-16 mb-6 rounded-2xl flex items-center justify-center
                                transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
                                ${isDragActive
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400'
                                }
                                ${isDragReject || error ? 'bg-red-100 text-red-500' : ''}
                            `}>
                                {isDragReject || error ? (
                                    <FileWarning className="w-8 h-8" />
                                ) : (
                                    <Upload className="w-8 h-8" />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="space-y-2 max-w-sm">
                                <h3 className={`text-lg font-bold transition-colors ${isDragActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'
                                    }`}>
                                    {isDragActive ? 'Solte a imagem aqui!' : 'Arraste e solte seu banner'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Ou clique para selecionar um arquivo do seu computador
                                </p>
                            </div>

                            {/* Specs Badges */}
                            <div className="flex flex-wrap justify-center gap-3 mt-8">
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                                    JPG, ATE 5MB
                                </span>
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full">
                                    1920x1080px (Recomendado)
                                </span>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute bottom-4 left-0 right-0 mx-auto w-fit px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg flex items-center gap-2"
                                    >
                                        <FileWarning className="w-4 h-4" />
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
