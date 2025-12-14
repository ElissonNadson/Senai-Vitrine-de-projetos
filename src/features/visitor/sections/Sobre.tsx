import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'
import { Rocket, Microscope, BookOpen, Users, ChevronRight } from 'lucide-react'

const Sobre: React.FC = () => {
  return (
    <SectionLayout>
      <div className="min-h-screen bg-gray-50/30">
        {/* Style injection for specific font or global overrides if needed */}
        <style>{`
          html body { background: rgb(249, 250, 251); }
        `}</style>

        {/* Hero Section - Standardized matches NoticiasPage */}
        <FadeIn>
          <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-[#003B71]">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src="/senai-feira-banner.png"
                alt="SENAI Feira de Santana"
                className="w-full h-full object-cover opacity-60"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/40 mix-blend-multiply" />
            {/* Optional subtle pattern if desired, but keeping it clean for now */}

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 pt-20">
              <div className="mb-6 inline-block">
                <span className="py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                  Plataforma Digital
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                SENAI <span className="text-[#00aceb]">Feira de Santana</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl border-l-4 border-[#00aceb] pl-6 text-left mx-auto md:mx-0 inline-block">
                Inovação, Tecnologia e Colaboração moldando o futuro da Educação Profissional.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Como a Plataforma Ganhou Vida */}
        <section className="py-24 px-6 bg-white relative z-20 -mt-16 rounded-t-[3rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

              {/* Left Column: Text Content */}
              <div className="lg:col-span-12 xl:col-span-8">
                <FadeIn>
                  <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-1 w-12 bg-[#00aceb]"></div>
                      <span className="text-sm font-bold tracking-[0.2em] uppercase text-[#003B71]">
                        Nossa História
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10 leading-tight tracking-tight">
                      Como a Vitrine Tecnológica<br />
                      <span className="text-[#00aceb]">Ganhou Vida</span>
                    </h2>

                    <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none space-y-8 text-justify">
                      <p className="border-l-4 border-[#00aceb] pl-6 italic text-xl text-gray-800 bg-blue-50/30 p-6 rounded-r-xl shadow-sm">
                        "O projeto foi criado em 2023, idealizado por professores com o propósito de estruturar a gestão de projetos internos e ampliar a visibilidade das soluções desenvolvidas na escola."
                      </p>

                      <p>
                        A plataforma se integra às unidades curriculares e ao módulo de projetos, acompanhando a jornada completa do estudante — da concepção à modelagem, prototipagem e implementação da solução.
                      </p>
                      <p>
                        Com o tempo, desejamos que essa proposta evolua. Mais do que apresentar projetos, queremos que ela se torne parte ativa do ecossistema de inovação — um organismo vivo que conecta educação, indústria e tecnologia.
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </div>

              {/* Right Column: Cards */}
              <div className="lg:col-span-8 lg:start-3 xl:col-span-4 xl:start-auto mt-8 xl:mt-0">
                <StaggerContainer className="flex flex-col gap-6" staggerDelay={0.15}>
                  <StaggerItem>
                    <div className="group bg-white p-8 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col items-center text-center">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-white rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                      <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-purple-200">
                        <Rocket size={28} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">Vitrine Tecnológica</h3>
                      <p className="text-gray-500 text-sm leading-relaxed relative z-10 max-w-xs">
                        Exposição digital de projetos que incentivam o empreendedorismo e a inovação tecnológica.
                      </p>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="group bg-white p-8 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col items-center text-center">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-white rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                      <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-cyan-200">
                        <Microscope size={28} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">Laboratório Maker</h3>
                      <p className="text-gray-500 text-sm leading-relaxed relative z-10 max-w-xs">
                        Gestão de recursos, reservas de equipamentos e catalogação de materiais produzidos.
                      </p>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="group bg-white p-8 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden flex flex-col items-center text-center">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-white rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>

                      <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-orange-200">
                        <BookOpen size={28} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">Biblioteca Maker</h3>
                      <p className="text-gray-500 text-sm leading-relaxed relative z-10 max-w-xs">
                        Acesso moderno a repositórios digitais e conteúdos que estimulam a autonomia.
                      </p>
                    </div>
                  </StaggerItem>
                </StaggerContainer>
              </div>
            </div>

            {/* Card Conheça Nossos Colaboradores - Destaque */}
            <div className="mt-24">
              <FadeIn delay={0.3}>
                <div id="colaboradores" className="relative overflow-hidden rounded-3xl bg-[#003B71] p-12 lg:p-16 shadow-2xl">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[#00aceb] rounded-full opacity-10 blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-[2px] bg-[#00aceb]"></span>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-blue-200">
                          Quem Faz Acontecer
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Conheça Nossos <br /><span className="text-[#00aceb]">Colaboradores</span>
                      </h2>
                      <div className="max-w-2xl">
                        <p className="text-gray-100 text-lg leading-relaxed mb-0 opacity-90">
                          Descubra a rede de colaboração por trás da criação e evolução deste projeto.
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <a
                        href="/equipe"
                        className="group flex items-center gap-4 bg-white text-[#003B71] px-8 py-5 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <span className="uppercase tracking-wider">VER EQUIPE COMPLETA</span>
                        <div className="w-8 h-8 rounded-full bg-[#003B71] flex items-center justify-center group-hover:bg-[#00aceb] transition-colors">
                          <ChevronRight className="w-5 h-5 text-white" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </div>
    </SectionLayout>
  )
}

export default Sobre
