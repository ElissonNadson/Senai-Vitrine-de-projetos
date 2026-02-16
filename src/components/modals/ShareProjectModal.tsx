import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Share2, X, Facebook, Twitter, Linkedin, MessageCircle,
  Link, Code, Copy, Check, Lightbulb, Sparkles
} from 'lucide-react'

interface ShareProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  projectUuid: string
  bannerUrl?: string | null
  description?: string | null
  phase?: string | null
}

const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  projectTitle,
  projectUuid,
  bannerUrl,
  description,
  phase,
}) => {
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null)
  const [sharedPlatform, setSharedPlatform] = useState<string | null>(null)

  // Sempre compartilhar via rota pública /vitrine/:uuid
  const shareUrl = `${window.location.origin}/vitrine/${projectUuid}`

  // Mensagens convidativas por plataforma
  const getShareText = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    const frases = [
      `Confira o projeto "${projectTitle}" desenvolvido no SENAI! Inovação e tecnologia feitas por quem constrói o futuro.`,
      `Dá uma olhada nesse projeto incrível: "${projectTitle}"! Feito por alunos do SENAI-BA.`,
      `Venha conhecer "${projectTitle}" — um projeto inovador da Vitrine Tecnológica SENAI!`,
    ]
    const frase = frases[Math.floor(Math.random() * frases.length)]

    switch (platform) {
      case 'whatsapp':
        return `${frase}\n\nAcesse aqui: ${shareUrl}`
      case 'twitter':
        return `${frase} #SENAI #Inovação #Tecnologia`
      case 'linkedin':
        return `${frase}\n\nConfira na Vitrine de Projetos SENAI-BA:`
      case 'facebook':
      default:
        return frase
    }
  }

  const getFullImageUrl = (url?: string | null) => {
    if (!url) return null
    if (url.startsWith('http')) return url
    const apiUrl = import.meta.env.VITE_API_URL || '/api'
    const baseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
  }

  const fullBannerUrl = getFullImageUrl(bannerUrl)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied('link')
      setTimeout(() => setCopied(null), 2500)
    } catch { /* fallback */ }
  }

  const handleCopyEmbed = async () => {
    const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`
    try {
      await navigator.clipboard.writeText(embedCode)
      setCopied('embed')
      setTimeout(() => setCopied(null), 2500)
    } catch { /* fallback */ }
  }

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp') => {
    const text = getShareText(platform)
    let url = ''
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
        break
    }
    window.open(url, '_blank', 'width=600,height=400')
    setSharedPlatform(platform)
    setTimeout(() => setSharedPlatform(null), 2000)
  }

  const socialButtons = [
    { id: 'facebook' as const, label: 'Facebook', icon: Facebook, bg: 'bg-[#1877F2]', hover: 'hover:bg-[#0c63d4]', lightBg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'twitter' as const, label: 'Twitter', icon: Twitter, bg: 'bg-[#1DA1F2]', hover: 'hover:bg-[#0c8bd9]', lightBg: 'bg-sky-50 dark:bg-sky-900/20' },
    { id: 'linkedin' as const, label: 'LinkedIn', icon: Linkedin, bg: 'bg-[#0A66C2]', hover: 'hover:bg-[#004c8e]', lightBg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'whatsapp' as const, label: 'WhatsApp', icon: MessageCircle, bg: 'bg-[#25D366]', hover: 'hover:bg-[#1da851]', lightBg: 'bg-green-50 dark:bg-green-900/20' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50"
              onClick={e => e.stopPropagation()}
            >
              {/* Banner Preview */}
              <div className="relative h-52 overflow-hidden">
                {fullBannerUrl ? (
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    src={fullBannerUrl}
                    alt={projectTitle}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                    >
                      <Lightbulb className="w-20 h-20 text-white/30" />
                    </motion.div>
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>

                {/* Share icon badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20"
                >
                  <Share2 className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-semibold text-white">Compartilhar</span>
                </motion.div>

                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg font-bold text-white leading-tight line-clamp-2"
                  >
                    {projectTitle}
                  </motion.h3>
                  {phase && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-1.5 mt-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-white/80 font-medium">{phase}</span>
                    </motion.div>
                  )}
                  {description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 }}
                      className="text-xs text-white/60 mt-1 line-clamp-1"
                    >
                      {description}
                    </motion.p>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                {/* Social Buttons */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Redes sociais
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {socialButtons.map((social, i) => {
                      const Icon = social.icon
                      const isShared = sharedPlatform === social.id
                      return (
                        <motion.button
                          key={social.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.06, type: 'spring', damping: 20 }}
                          onClick={() => handleSocialShare(social.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300 group ${social.lightBg} hover:shadow-md`}
                        >
                          <div className={`w-10 h-10 ${social.bg} ${social.hover} rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-active:scale-95`}>
                            {isShared ? (
                              <motion.div
                                initial={{ scale: 0, rotate: -90 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: 'spring', damping: 15 }}
                              >
                                <Check className="w-5 h-5" />
                              </motion.div>
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                            {social.label}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Copy Link */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Link do projeto
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-600 dark:text-gray-300 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-1.5 ${
                        copied === 'link'
                          ? 'bg-green-500 text-white shadow-lg shadow-green-200 dark:shadow-green-900/30'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-xl'
                      }`}
                    >
                      {copied === 'link' ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>Copiado!</span>
                        </motion.div>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Embed Option (Less Prominent) */}
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ delay: 0.5 }}
                   className="pt-2 border-t border-gray-100 dark:border-gray-800"
                >
                  <button
                    onClick={() => {
                       const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`
                       navigator.clipboard.writeText(embedCode)
                       setCopied('embed')
                       setTimeout(() => setCopied(null), 2000)
                    }}
                    className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mx-auto"
                  >
                    {copied === 'embed' ? (
                      <>
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-green-500">Copiado para área de transferência!</span>
                      </>
                    ) : (
                      <>
                        <Code className="w-3 h-3" />
                        <span>Incorporar em site ou blog</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ShareProjectModal
