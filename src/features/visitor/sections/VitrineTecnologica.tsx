import { Link } from 'react-router-dom'
import SectionLayout from '../layout/SectionLayout'

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
                src="https://tecplanstands.com.br/wp-content/uploads/2024/12/stands-para-eventos.jpg"
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
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                Transformando ideias audaciosas em soluções que impactam o mundo real.
              </p>

              <div className="mt-8 animate-fade-in-up md:mx-0 mx-auto">
                <Link
                  to="/explorar-vitrine"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#00aceb] hover:bg-[#009bd3] text-white font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Explorar Vitrine
                  <ArrowRight size={20} />
                </Link>
              </div>
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
                      Nossa Vitrine Tecnológica reúne projetos desenvolvidos no SENAI que aproximam o aprendizado da prática, conectando conhecimentos teóricos a soluções aplicáveis a desafios reais da indústria e da sociedade.
                    </p>
                    <p className="leading-relaxed">
                      Os projetos são construídos a partir de metodologias como design thinking, metodologias ágeis e prototipagem, favorecendo o desenvolvimento de soluções funcionais, com foco em melhoria contínua e impacto positivo e sustentável.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <StaggerContainer className="space-y-6" staggerDelay={0.15}>
                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Factory size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">IoT Industrial</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Sistemas inteligentes para monitoramento e controle de processos industriais em tempo real.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Bot size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">Automação 4.0</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Soluções avançadas integrando IA, machine learning e robótica para a indústria do futuro.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                      <Leaf size={24} />
                    </div>
                    <div className="text-left">
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

      </div>
    </SectionLayout>
  )
}

export default VitrineTecnologica