import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SectionLayout from '../layout/SectionLayout'
import { mockNews } from '@/data/mockNews'
import heroBg from '@/assets/noticias.png'

interface NewsItem {
    id: number
    title: string
    date: string
    category: string
    imageUrl: string
    summary: string
}

const NoticiasPage: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate API fetch
        const fetchNews = async () => {
            try {
                // In a real scenario, this would be an API call
                // const response = await fetch('/api/news')
                // const data = await response.json()
                await new Promise(resolve => setTimeout(resolve, 800)) // Fake delay
                setNews(mockNews)
            } catch (error) {
                console.error("Failed to fetch news", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchNews()
    }, [])

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
                    <div className="relative z-10 flex flex-col items-start justify-center h-full w-full max-w-7xl px-6 md:px-12 pt-20">

                        {/* Breadcrumbs removed per request */}

                        {/* Title Section */}
                        <div className="max-w-4xl">
                            <p className="text-[#00aceb] font-bold tracking-[0.2em] text-sm md:text-base uppercase mb-4">
                                NOTÍCIAS
                            </p>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                                Fique por dentro do que acontece aqui no SENAI
                            </h1>
                            <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl border-l-4 border-[#00aceb] pl-6">
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
                                <Link to={`/noticias/${item.id}`} key={item.id} className="w-full md:w-1/2 group">
                                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-2xl h-full border-4 border-white transition-transform duration-300 hover:-translate-y-1">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                                        <div className="absolute bottom-0 left-0 p-8 w-full">

                                            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug group-hover:text-[#00aceb] transition-colors line-clamp-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-300 text-sm flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#00aceb]"></span>
                                                {formatDate(item.date)}
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
                                <Link to={`/noticias/${item.id}`} key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1">
                                    <div className="h-56 overflow-hidden relative">

                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">

                                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-3 group-hover:text-[#00aceb] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed font-medium">
                                            {item.summary}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                                {formatDate(item.date)}
                                            </span>
                                            <span className="text-[#00aceb] font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                                                Ler mais
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
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
