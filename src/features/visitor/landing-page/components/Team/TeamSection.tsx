import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import SenaiTeamList from './SenaiTeamList'

const TeamSection: React.FC = () => {
    return (
        <section className="w-full bg-white py-24 relative overflow-hidden" id="equipe">
            <div className="container mx-auto px-6">
                {/* Top Separator with Plus Icon */}
                <div className="flex items-center justify-center mb-16 opacity-70">
                    <div className="h-px bg-gray-300 w-full max-w-xs"></div>
                    <div className="mx-4 relative">
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
                            <Plus size={16} />
                        </div>
                    </div>
                    <div className="h-px bg-gray-300 w-full max-w-xs"></div>
                </div>
                {/* Content */}
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
                            Conheça nosso time!
                        </h2>
                        <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
                            Profissionais que atuam para impulsionar a educação, tecnologia e inovação no SENAI Feira de Santana.
                        </p>
                        <a
                            href="/equipe"
                            className="inline-flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold transition-all duration-300 group mb-8"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <ArrowRight size={16} className="text-white" />
                            </div>
                            <span className="text-lg">Equipe SENAI Feira de Santana</span>
                        </a>
                        {/* Cards da equipe */}
                        <div className="mt-8">
                            <SenaiTeamList />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default TeamSection
