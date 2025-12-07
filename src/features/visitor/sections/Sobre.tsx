import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'

const Sobre: React.FC = () => {
  return (
    <SectionLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <FadeIn>
          <section className="relative h-[50vh] overflow-hidden bg-gradient-to-r from-blue-700 to-blue-900">
            <div className="absolute inset-0 bg-black bg-opacity-30" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white max-w-4xl px-4">
                <div className="mb-4 text-sm font-semibold tracking-widest uppercase text-blue-200">
                  PLATAFORMA DIGITAL
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                  SENAI Feira de Santana
                </h1>
                <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
                  Inovação, Tecnologia e Colaboração para o Futuro da Educação Profissional
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Como a Plataforma Ganhou Vida */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Introdução ao Site */}
            <FadeIn>
              <div className="mb-16">
                <div className="mb-4 text-sm font-semibold tracking-widest uppercase text-blue-700">
                  COMO A PLATAFORMA GANHOU VIDA
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  Vitrine Tecnológica SENAI Feira
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed max-w-4xl">
                  <p>
                    Este projeto foi idealizado por professores em 2023 com o objetivo de criar um ambiente 
                    digital próprio para divulgar e valorizar os projetos desenvolvidos pelos alunos. A 
                    plataforma se integra diretamente às unidades curriculares e ao módulo de projetos, 
                    acompanhando todo o processo realizado pelos estudantes — desde a idealização da 
                    solução baseada em problemas, passando pela modelagem e prototipagem, até a 
                    implementação final.
                  </p>
                  <p>
                    Com o tempo, a proposta passou por reformulações e hoje também conta com a 
                    integração dos espaços makers do SENAI. 
                    <a href="#colaboradores" className="text-blue-700 font-semibold hover:underline"> Para saber mais detalhes, clique no link.</a>
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Cards das Funcionalidades */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" staggerDelay={0.15}>
              <StaggerItem>
                <div className="bg-white border-l-4 border-purple-700 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-purple-100 flex items-center justify-center">
                      <div className="w-2 h-12 bg-purple-700"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Vitrine Tecnológica</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Espaço digital para exposição e divulgação dos projetos inovadores desenvolvidos 
                    no SENAI, incentivando a criatividade e o empreendedorismo tecnológico.
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-white border-l-4 border-cyan-700 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-cyan-100 flex items-center justify-center">
                      <div className="w-2 h-12 bg-cyan-700"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Laboratório Maker</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Disponibiliza e gerencia os recursos do Lab Maker, com visualização de estrutura e equipamentos, 
                    reservas online de horários, gestão de estoque, custos e catalogação de materiais produzidos.
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-white border-l-4 border-orange-700 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-orange-100 flex items-center justify-center">
                      <div className="w-2 h-12 bg-orange-700"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Biblioteca Maker</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Moderniza o acesso à biblioteca, possibilitando reserva de salas de estudo, integração com 
                    repositórios digitais e oferta de conteúdos que estimulam autonomia e criatividade.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            {/* Card Conheça Nossos Colaboradores - Destaque */}
            <FadeIn delay={0.3}>
              <div id="colaboradores" className="bg-gradient-to-r from-blue-700 to-blue-900 p-12 shadow-lg">
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-16 h-16 border-l-4 border-white flex items-center flex-shrink-0">
                    <div className="w-2 h-16 bg-white ml-4"></div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4 text-sm font-semibold tracking-widest uppercase text-blue-200">
                      CONHEÇA NOSSOS COLABORADORES
                    </div>
                    <p className="text-blue-50 leading-relaxed text-lg">
                      Descubra quem esteve por trás da criação e evolução deste projeto e veja como a 
                      Vitrine Tecnológica ganhou forma ao longo do tempo. Clique para explorar a história 
                      completa e os profissionais que fizeram tudo acontecer.
                    </p>
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

export default Sobre
