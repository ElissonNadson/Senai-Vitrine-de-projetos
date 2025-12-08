import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cropper from 'react-easy-crop'
import { X, Check, ZoomIn, RotateCw, Move, Sliders, Crop as CropIcon, Trash2, Camera, RefreshCw } from 'lucide-react'

interface Point {
  x: number
  y: number
}

interface Area {
  width: number
  height: number
  x: number
  y: number
}

interface ImageCropModalProps {
  isOpen: boolean
  imageSrc: string
  onClose: () => void
  onSave: (croppedImageBlob: Blob) => void
  aspect?: number
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onSave,
  aspect = 16 / 9
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust'>('crop')

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', (error) => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: Area,
    rotation = 0
  ): Promise<Blob> => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    const maxSize = Math.max(image.width, image.height)
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2))

    canvas.width = safeArea
    canvas.height = safeArea

    ctx.translate(safeArea / 2, safeArea / 2)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.translate(-safeArea / 2, -safeArea / 2)

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    )

    const data = ctx.getImageData(0, 0, safeArea, safeArea)

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas is empty'))
        }
      }, 'image/jpeg', 0.95)
    })
  }

  const handleSave = async () => {
    if (!croppedAreaPixels) return

    setIsSaving(true)
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
      onSave(croppedImageBlob)
    } catch (error) {
      console.error('Erro ao recortar imagem:', error)
      alert('Erro ao processar a imagem. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setCrop({ x: 0, y: 0 })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col md:flex-row overflow-hidden"
          >
            {/* Left Side - Image Area */}
            <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                showGrid={true}
                objectFit="contain"
              />

              {/* Mobile View Toggle (could be improved, but keeps layout simple) */}
              <div className="absolute top-4 left-4 md:hidden z-10">
                <span className="px-3 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
            </div>

            {/* Right Side - Controls Sidebar */}
            <div className="w-full md:w-[320px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editar imagem</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('crop')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'crop'
                      ? 'border-green-600 text-green-700 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  Recortar
                </button>
                <button
                  onClick={() => setActiveTab('adjust')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'adjust'
                      ? 'border-green-600 text-green-700 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  Ajustar
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {activeTab === 'crop' ? (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">
                          <ZoomIn className="w-4 h-4" /> Zoom
                        </span>
                        <span className="text-xs text-gray-500">{Math.round(zoom * 100)}%</span>
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">
                          <RotateCw className="w-4 h-4" /> Rotação Direita
                        </span>
                        <span className="text-xs text-gray-500">{rotation}°</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={rotation}
                        onChange={(e) => setRotation(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Arraste a imagem para posicionar. A área destacada será salva.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sliders className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">
                      Filtros e ajustes avançados em breve.
                    </p>
                  </div>
                )}

              </div>

              {/* Footer Buttons */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar alterações'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageCropModal
