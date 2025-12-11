import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import img4 from '@/assets/images/Imagens/001-Comunidade Maker.jpg'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'
import { Users, Calendar, Lightbulb, MessageCircle, Heart } from 'lucide-react'

const ComunidadeMaker: React.FC = () => {
  return (
    <SectionLayout>
      <div className="min-h-screen bg-gray-50/30">
        {/* Style injection for specific font or global overrides if needed */}
        <style>{`
          html body { background: rgb(249, 250, 251); }
        `}</style>

        {/* Hero Section - Standardized matches NoticiasPage */}
        <FadeIn>
          <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#003B71] group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={img4}
                alt="Background"
                className="w-full h-full object-cover opacity-60 transform group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/40 mix-blend-multiply" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 pt-20">
              <div className="mb-6 inline-block">
                <span className="py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                  Conexão e Colaboração
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Comunidade <span className="text-[#00aceb]">Maker</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl border-l-4 border-[#00aceb] pl-6 text-left mx-auto md:mx-0 inline-block">
                Um ecossistema vibrante de pessoas apaixonadas por criar, compartilhar e inovar.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Content Section */}
        <section className="py-24 px-6 relative z-20 -mt-16 bg-white rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <FadeIn direction="left">
                <div className="relative">
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50"></div>

                  <h2 className="relative text-4xl md:text-5xl font-bold text-[#003B71] mb-8 leading-tight">
                    Juntos, Vamos <br /><span className="text-[#00aceb]">Mais Longe</span>
                  </h2>

                  <div className="prose prose-lg text-gray-600 space-y-6">
                    <p className="leading-relaxed">
                      A tecnologia é apenas a ferramenta; as pessoas são a essência. Nossa Comunidade Maker
                      reúne alunos, professores, especialistas da indústria e entusiastas para trocar experiências.
                    </p>
                    <p className="leading-relaxed">
                      Promovemos eventos, hackathons e mentorias que transformam competidores em parceiros
                      e ideias individuais em movimentos coletivos.
                    </p>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold">
                      <Users size={16} /> Networking
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-semibold">
                      <MessageCircle size={16} /> Mentorias
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm font-semibold">
                      <Heart size={16} /> Colaboração
                    </span>
                  </div>
                </div>
              </FadeIn>

              <StaggerContainer className="space-y-6" staggerDelay={0.15}>
                <StaggerItem>
                  <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Grupos de Interesse</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Comunidades focadas em temas específicos como robótica, IA e design sustentável.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">Eventos & Hackathons</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Maratonas de programação e desafios de inovação abertos para todos.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                      <Lightbulb size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">Compartilhamento de Ideias</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Espaços abertos para apresentação de projetos e feedback construtivo.
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </section>
      </div>
    </SectionLayout>
  )
}

export default ComunidadeMaker