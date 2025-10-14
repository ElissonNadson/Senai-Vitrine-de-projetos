import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import img1 from '@/assets/images/Imagens/001-Comunidade Maker.jpg'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'

const VitrineTecnologica: React.FC = () => {
  return (
    <SectionLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <FadeIn>
        <section className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img1})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-wider">
                Vitrine Tecnológica
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto">
                Transformando ideias em soluções que impactam o mundo
              </p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Inovação que Transforma Realidades
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Nossa Vitrine Tecnológica representa o que há de mais avançado em 
                  desenvolvimento tecnológico no SENAI. Cada projeto é uma oportunidade 
                  de aplicar conhecimentos teóricos em soluções práticas que atendem 
                  demandas reais da indústria e sociedade.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Trabalhamos com metodologias ágeis, design thinking e prototipagem 
                  rápida para desenvolver soluções que não apenas funcionam, mas que 
                  também geram impacto positivo e sustentável.
                </p>
              </div>
            </FadeIn>
            <StaggerContainer className="space-y-6" staggerDelay={0.15}>
              <StaggerItem>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-emerald-500 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">IoT Industrial</h3>
                  <p className="text-gray-600">
                    Sistemas inteligentes para monitoramento e controle 
                    de processos industriais em tempo real.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Automação 4.0</h3>
                  <p className="text-gray-600">
                    Soluções avançadas integrando IA, machine learning 
                    e robótica para a indústria do futuro.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-violet-500 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Sustentabilidade</h3>
                  <p className="text-gray-600">
                    Projetos focados em economia circular, energia 
                    renovável e tecnologias limpas.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Projetos em Destaque
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conheça as soluções inovadoras desenvolvidas por nossos alunos e instrutores
            </p>
          </div>

          {/* Banner de Redirecionamento para Vitrine Completa */}
          <div className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <span className="text-white text-sm font-semibold">Explore Projetos Reais</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Descubra Nossa Vitrine Completa
                </h3>
                <p className="text-white/90 text-lg mb-4 max-w-2xl">
                  Explore centenas de projetos reais desenvolvidos por nossos alunos. 
                  Filtre por tecnologia, curso, fase de maturidade e muito mais!
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-white/80 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> Projetos em Todas as Fases
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> Filtros Avançados
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-300">✓</span> Detalhes Completos
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <a 
                  href="/app/dashboard"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <span>Explorar Vitrine Completa</span>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <p className="text-center text-white/70 text-xs">
                  Acesso gratuito como visitante
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </SectionLayout>
  )
}

export default VitrineTecnologica