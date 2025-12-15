import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import img2 from '@/assets/images/Imagens/002-Biblioteca Maker.jpg'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'
import { Tablet, BookOpen, Unlock } from 'lucide-react'

const BibliotecaMaker: React.FC = () => {
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
                src={img2}
                alt="Background"
                className="w-full h-full object-cover opacity-60 transform group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/40 mix-blend-multiply" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 pt-20">
              <div className="mb-6 inline-block">
                <span className="py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                  Conhecimento Aberto
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Biblioteca <span className="text-[#00aceb]">Maker</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                Acesso democrático a recursos educacionais, manuais técnicos e cultura maker.
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
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>

                  <h2 className="relative text-4xl md:text-5xl font-bold text-[#003B71] mb-8 leading-tight">
                    Sua Fonte de <br /><span className="text-[#00aceb]">Conhecimento Técnico</span>
                  </h2>

                  <div className="prose prose-lg text-gray-600 space-y-6">
                    <p className="leading-relaxed">
                      A Biblioteca Maker é mais que um acervo tradicional. É um hub de conhecimento técnico especializado que reúne livros, manuais, documentações, projetos open-source e recursos digitais para makers e entusiastas da tecnologia.
                    </p>
                    <p className="leading-relaxed">
                      Nosso acervo é constantemente atualizado com as últimas tendências em tecnologia, fabricação digital, eletrônica, programação e inovação, garantindo que você tenha acesso às informações mais relevantes.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <StaggerContainer className="space-y-6" staggerDelay={0.15}>
                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Tablet size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Acervo Digital</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        E-books, apostilas e revistas técnicas disponíveis para download gratuito.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <BookOpen size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">Manuais de Equipamentos</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Guias de operação e segurança para todas as máquinas dos laboratórios.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <Unlock size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">Open Source</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Projetos completos com código e design abertos para estudo e replicação.
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

export default BibliotecaMaker