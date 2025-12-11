import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import SectionLayout from '../layout/SectionLayout'
import { mockNews } from '@/data/mockNews'
import { Facebook, Linkedin, Twitter, MessageCircle } from 'lucide-react'

const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  // Find the news item based on ID
  const newsItem = mockNews.find(item => item.id.toString() === slug)

  // Handle not found
  if (!newsItem) {
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

  // Get other news for "Related" section (excluding current one)
  const relatedNews = mockNews.filter(item => item.id !== newsItem.id).slice(0, 3)

  const shareUrl = window.location.href

  return (
    <SectionLayout>
      <div className="min-h-screen bg-[#f8f9fa]">
        {/* Main Content Container matching Framer structure */}
        <div className="framer-root" style={{ width: 'auto', minHeight: '100vh' }}>

          {/* Banner / Hero Section */}
          <div className="relative w-full h-[50vh] min-h-[400px]">
            <div className="absolute inset-0">
              <img
                src={newsItem.imageUrl}
                alt="Banner Notícia"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x600?text=SENAI+News'
                }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-4xl mx-auto px-6 py-12 -mt-32 relative z-10">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-t-4 border-[#00aceb]">

              {/* Header */}
              <div className="text-center mb-10 border-b border-gray-100 pb-10">

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {newsItem.title}
                </h1>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 text-gray-500 font-medium">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#00aceb]">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {new Date(newsItem.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>

                  {/* Social Share Buttons - Top Right */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden md:block">Compartilhe:</span>
                    <div className="flex gap-2">
                      <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')} className="p-2 rounded-full bg-gray-50 hover:bg-[#1877F2] hover:text-white transition-colors" title="Facebook">
                        <Facebook size={16} />
                      </button>
                      <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${newsItem.title}`, '_blank')} className="p-2 rounded-full bg-gray-50 hover:bg-[#1DA1F2] hover:text-white transition-colors" title="Twitter">
                        <Twitter size={16} />
                      </button>
                      <button onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')} className="p-2 rounded-full bg-gray-50 hover:bg-[#0A66C2] hover:text-white transition-colors" title="LinkedIn">
                        <Linkedin size={16} />
                      </button>
                      <button onClick={() => window.open(`https://wa.me/?text=${newsItem.title} - ${shareUrl}`, '_blank')} className="p-2 rounded-full bg-gray-50 hover:bg-[#25D366] hover:text-white transition-colors" title="WhatsApp">
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Body Text */}
              <div className="prose prose-lg max-w-none text-gray-700 space-y-6 leading-relaxed">
                {/* Intro / Summary */}
                <p className="font-medium text-xl text-gray-800 border-l-4 border-[#00aceb] pl-4 italic">
                  {newsItem.summary}
                </p>

                {/* Main Content */}
                <div className="whitespace-pre-line">
                  {newsItem.content}
                </div>

                {/* Author (compact) - moved to article footer */}
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="max-w-4xl mx-auto flex justify-end">
                    <p className="text-xs text-gray-500">Publicado por <span className="font-semibold text-gray-700 ml-2">Assessoria SENAI CIMATEC</span></p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Related News Section */}
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
                <Link to={`/noticias/${item.id}`} key={item.id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 h-full flex flex-col hover:-translate-y-1 duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=SENAI+News'
                        }}
                      />

                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#00aceb] transition-colors">
                        {item.title}
                      </h4>
                      <div className="mt-auto">
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00aceb]"></span>
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">Publicado por <span className="font-medium text-gray-700 ml-1">Assessoria SENAI CIMATEC</span></p>
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
