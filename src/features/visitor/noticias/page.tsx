import React from 'react'
import { Link } from 'react-router-dom'
import SectionLayout from '../layout/SectionLayout'
import heroBg from '@/assets/noticias.png'
import { useNoticias } from '@/hooks/use-noticias'
import { Calendar, ArrowRight } from 'lucide-react'

const NoticiasPage: React.FC = () => {
    const { data, isLoading } = useNoticias({ limit: 100, publicOnly: true })
    const news = data?.data || []

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }

    // Split news for featured layout (first 2) and list (rest)
    const featuredNews = news.slice(0, 2)
    const otherNews = news.slice(2)

    return (
        <SectionLayout>
            <div className="min-h-screen bg-[#f4f4f4]">
                {/* Style injection for specific font or global overrides if needed */}
                <style>{`
          html body { background: rgb(244, 244, 244); }
        `}</style>

                {/* Hero Section */}
                <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#003B71]">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroBg}
                            alt="Background"
                            className="w-full h-full object-cover opacity-60"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/40 mix-blend-multiply" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-7xl px-6 md:px-12 pt-20 text-center">

                        {/* Breadcrumbs removed per request */}

                        {/* Title Section */}
                        <div className="max-w-4xl flex flex-col items-center">
                            <p className="text-[#00aceb] font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4">
                                NOTÍCIAS
                            </p>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                                Fique por dentro do que acontece aqui no SENAI
                            </h1>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl px-6">
                                Informações atualizadas sobre inovação, educação, tecnologia, análises setoriais e oportunidades aqui do SENAI.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Featured News Section */}
                <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto -mt-24 relative z-20">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-lg">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aceb]"></div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-8 items-stretch">
                            {/* Render only featured news (first 2) */}
                            {featuredNews.map((item) => (
                                <Link to={`/noticias/${item.uuid}`} key={item.uuid} className="w-full md:w-1/2 group">
                                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-2xl h-full border-4 border-white transition-transform duration-300 hover:-translate-y-1">
                                        <img
                                            src={item.banner_url || '/placeholder-news.jpg'}
                                            alt={item.titulo}
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                        <div className="absolute bottom-0 left-0 p-8 w-full">

                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug group-hover:text-[#00aceb] transition-colors line-clamp-2">
                                                {item.titulo}
                                            </h3>
                                            <p className="text-gray-300 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00aceb]"></span>
                                                {formatDate(item.data_evento || item.criado_em)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* News List Section (Remaining Items) */}
                {otherNews.length > 0 && (
                    <section className="py-12 px-4 max-w-7xl mx-auto mb-20">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-8 w-1 bg-[#00aceb] rounded-full"></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Mais Notícias
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {otherNews.map((item) => (
                                <Link to={`/noticias/${item.uuid}`} key={item.uuid} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1">
                                    <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={item.banner_url || '/placeholder-news.jpg'}
                                            alt={item.titulo}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full shadow-lg">
                                                {item.categoria}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">

                                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-3 group-hover:text-[#00aceb] transition-colors">
                                            {item.titulo}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed font-medium">
                                            {item.resumo}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(item.data_evento || item.criado_em)}
                                            </span>
                                            <span className="text-[#00aceb] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                                                Ler mais
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer Space */}
                <div className="h-12"></div>

            </div>
        </SectionLayout>
    )
}

export default NoticiasPage
