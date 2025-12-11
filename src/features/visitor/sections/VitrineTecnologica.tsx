import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import img1 from '@/assets/images/Imagens/004-Reproducao de Projetos.jpg'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'
import { Factory, Bot, Leaf, ArrowRight } from 'lucide-react'

const VitrineTecnologica: React.FC = () => {
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
                src={img1}
                alt="Background"
                className="w-full h-full object-cover opacity-60 transform group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/40 mix-blend-multiply" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 pt-20">
              <div className="mb-6 inline-block">
                <span className="py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                  Ecossistema de Inovação
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Vitrine <span className="text-[#00aceb]">Tecnológica</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl border-l-4 border-[#00aceb] pl-6 text-left mx-auto md:mx-0 inline-block">
                Transformando ideias audaciosas em soluções que impactam o mundo real.
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
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50"></div>

                  <h2 className="relative text-4xl md:text-5xl font-bold text-[#003B71] mb-8 leading-tight">
                    Inovação que <br /><span className="text-[#00aceb]">Transforma Realidades</span>
                  </h2>

                  <div className="prose prose-lg text-gray-600 space-y-6">
                    <p className="leading-relaxed">
                      Nossa Vitrine Tecnológica representa o ápice do desenvolvimento tecnológico no SENAI.
                      Cada projeto é uma oportunidade cristalina de aplicar conhecimentos teóricos em
                      soluções práticas de alto impacto.
                    </p>
                    <p className="leading-relaxed">
                      Utilizamos metodologias ágeis, design thinking e prototipagem rápida para criar
                      não apenas produtos, mas futuros possíveis.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <StaggerContainer className="space-y-6" staggerDelay={0.15}>
                <StaggerItem>
                  <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Factory size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">IoT Industrial</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Sistemas inteligentes para monitoramento e controle de processos industriais em tempo real.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Bot size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">Automação 4.0</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Soluções avançadas integrando IA, machine learning e robótica para a indústria do futuro.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Sustentabilidade</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Projetos focados em economia circular, energia renovável e tecnologias limpas.
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Featured Projects Banner */}
        <section className="py-20 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn>
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#003B71] to-[#1a5f9e] shadow-2xl">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-[#00aceb] rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>

                <div className="relative z-10 p-12 lg:p-20 flex flex-col items-center text-center">

                  <span className="inline-block py-1 px-3 rounded bg-white/10 text-white/80 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm border border-white/10">
                    Acesso Visitante Liberado
                  </span>

                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                    Explore a Vitrine Completa
                  </h2>

                  <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-12 leading-relaxed">
                    Centenas de projetos reais, filtráveis por tecnologia e fase de desenvolvimento.
                    Mergulhe na inovação agora mesmo.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <a
                      href="/"
                      className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#003B71] rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                    >
                      <span className="relative z-10">Explorar Vitrine</span>
                      <ArrowRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>

                  <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-blue-200/80 font-medium tracking-wide">
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00aceb]"></div> Projetos Reais</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00aceb]"></div> Filtros Avançados</span>
                    <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#00aceb]"></div> Documentação Completa</span>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </SectionLayout>
  )
}

export default VitrineTecnologica