import React, { useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SectionLayout from '../layout/SectionLayout'
import { useNoticia, useNoticias, useIncrementView, useLikeNoticia, useUnlikeNoticia } from '@/hooks/use-noticias'
import { Facebook, Linkedin, Twitter, MessageCircle, Calendar, Heart } from 'lucide-react'
import DOMPurify from 'dompurify'
import { message } from 'antd'

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const viewIncremented = useRef(false)
  const [hasLiked, setHasLiked] = React.useState(false)

  // Check if liked on mount
  useEffect(() => {
    const likedKey = `liked_news_${slug}`
    const alreadyLiked = localStorage.getItem(likedKey)
    if (alreadyLiked) {
      setHasLiked(true)
    }
  }, [slug])

  // Fetch single news item
  const { data: newsItem, isLoading, isError, refetch } = useNoticia(slug || '')

  // Custom hooks for interactions
  const incrementView = useIncrementView()
  const likeNoticia = useLikeNoticia()
  const unlikeNoticia = useUnlikeNoticia()

  // Increment view on mount
  useEffect(() => {
    if (newsItem?.uuid && !viewIncremented.current) {
      incrementView.mutate(newsItem.uuid)
      viewIncremented.current = true
    }
  }, [newsItem?.uuid, incrementView])

  const handleLike = () => {
    if (!newsItem?.uuid) return

    if (hasLiked) {
      // Unlike
      unlikeNoticia.mutate(newsItem.uuid, {
        onSuccess: () => {
          message.success('Curtida removida')
          localStorage.removeItem(`liked_news_${slug}`)
          setHasLiked(false)
          refetch()
        }
      })
    } else {
      // Like
      likeNoticia.mutate(newsItem.uuid, {
        onSuccess: () => {
          message.success('Você curtiu esta notícia!')
          localStorage.setItem(`liked_news_${slug}`, 'true')
          setHasLiked(true)
          refetch()
        }
      })
    }
  }

  // Fetch related news (just general list for now, ideally filtered by category)
  const { data: relatedData } = useNoticias({ limit: 3, publicOnly: true })
  const relatedNews = relatedData?.data?.filter(item => item.uuid !== newsItem?.uuid).slice(0, 3) || []

  const shareUrl = window.location.href

  if (isLoading) {
    return (
      <SectionLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aceb]"></div>
        </div>
      </SectionLayout>
    )
  }

  if (isError || !newsItem) {
    return (
      <SectionLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Notícia não encontrada</h1>
          <button
            onClick={() => navigate('/noticias')}
            className="px-6 py-2 bg-[#00aceb] text-white rounded-lg hover:bg-[#008fc5] transition-colors"
          >
            Voltar para Notícias
          </button>
        </div>
      </SectionLayout>
    )
  }

  return (
    <SectionLayout>
      <div className="min-h-screen bg-[#f8f9fa]">
        <div className="framer-root" style={{ width: 'auto', minHeight: '100vh' }}>

          {/* Banner / Hero Section */}
          <div className="relative w-full h-[50vh] min-h-[400px]">
            <div className="absolute inset-0">
              <img
                src={newsItem.banner_url || '/placeholder-news.jpg'}
                alt="Banner Notícia"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x600?text=SENAI+News'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto px-6 py-12 -mt-32 relative z-10">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-t-4 border-[#00aceb]">

              {/* Header */}
              <div className="text-center mb-10 border-b border-gray-100 pb-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {newsItem.titulo}
                </h1>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6 text-gray-500 font-medium flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#00aceb]" />
                    {new Date(newsItem.data_evento || newsItem.criado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 uppercase">
                      {newsItem.categoria}
                    </div>
                  </div>

                  {/* Inline Social Share */}
                  <div className="flex items-center gap-2 border-l border-gray-200 pl-6 ml-2">
                    <span className="text-xs uppercase tracking-wide text-gray-400 mr-2">Compartilhar:</span>
                    <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')} className="hover:text-[#1877F2] transition-colors"><Facebook size={18} /></button>
                    <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${newsItem.titulo}`, '_blank')} className="hover:text-[#1DA1F2] transition-colors"><Twitter size={18} /></button>
                    <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')} className="hover:text-[#0A66C2] transition-colors"><Linkedin size={18} /></button>
                    <button onClick={() => window.open(`https://wa.me/?text=${newsItem.titulo} - ${shareUrl}`, '_blank')} className="hover:text-[#25D366] transition-colors"><MessageCircle size={18} /></button>
                  </div>
                </div>
              </div>

              {/* Body Text */}
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6 leading-relaxed">
                {/* Summary */}
                <p className="font-medium text-xl text-gray-800 border-l-4 border-[#00aceb] pl-4 italic">
                  {newsItem.resumo}
                </p>

                {/* HTML Content */}
                <div
                  className="whitespace-pre-line rich-text-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(newsItem.conteudo) }}
                />

                {/* Author */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleLike}
                        className={`p-3 rounded-full transition-all transform hover:scale-110 ${hasLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-100 hover:text-red-500 hover:bg-red-50'}`}
                        title={hasLiked ? "Descurtir" : "Curtir"}
                      >
                        <Heart size={24} className={hasLiked ? "fill-red-500" : ""} />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500">
                      Publicado por <span className="font-semibold text-gray-700 ml-2">{newsItem.autor_nome || 'Assessoria SENAI CIMATEC'}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related News */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-gray-900 border-l-4 border-[#00aceb] pl-4">
                Outras Notícias
              </h3>
              <Link to="/noticias" className="text-[#00aceb] font-bold hover:underline">
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedNews.map((item) => (
                <Link to={`/noticias/${item.uuid}`} key={item.uuid} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col hover:-translate-y-1 duration-300">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.banner_url || '/placeholder-news.jpg'}
                        alt={item.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#00aceb] transition-colors">
                        {item.titulo}
                      </h4>
                      <div className="mt-auto">
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00aceb]"></span>
                          {new Date(item.data_evento || item.criado_em).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  )
}

export default NewsDetailPage
