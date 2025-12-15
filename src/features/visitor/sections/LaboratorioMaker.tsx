import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import img3 from '@/assets/images/Imagens/003-Lab Maker.jpg'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'
import { Printer, Zap, Cpu, Wrench, Layers, Monitor, PenTool } from 'lucide-react'

const LaboratorioMaker: React.FC = () => {
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
            <div className="absolute inset-0 z-0">
              <img
                src={img3}
                alt="Background"
                className="w-full h-full object-cover opacity-60 transform group-hover:scale-105 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#003B71]/90 to-[#003B71]/40 mix-blend-multiply" />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 pt-20">
              <div className="mb-6 inline-block">
                <span className="py-2 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                  Prototipagem Profissional
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight mb-6">
                Laboratório <span className="text-[#00aceb]">Maker</span>
              </h1>
              <p className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-3xl border-l-4 border-[#00aceb] pl-6 text-left mx-auto md:mx-0 inline-block">
                Onde ideias abstratas se tornam protótipos tangíveis de alta fidelidade.
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
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-100 rounded-full blur-3xl opacity-50"></div>

                  <h2 className="relative text-4xl md:text-5xl font-bold text-[#003B71] mb-8 leading-tight">
                    Seu Espaço de <br /><span className="text-[#00aceb]">Criação e Prototipagem</span>
                  </h2>

                  <div className="prose prose-lg text-gray-600 space-y-6">
                    <p className="leading-relaxed">
                      O Laboratório Maker é um ambiente totalmente equipado para transformar suas ideias em protótipos funcionais. Com tecnologia de ponta e ferramentas profissionais, oferecemos tudo o que você precisa para criar, testar e aperfeiçoar seus projetos.
                    </p>
                    <p className="leading-relaxed">
                      Nosso laboratório combina fabricação digital, eletrônica, programação e design, proporcionando um ambiente multidisciplinar ideal para projetos inovadores e aprendizado prático.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <StaggerContainer className="space-y-6" staggerDelay={0.15}>
                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                      <Printer size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">Fabricação Digital</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Impressoras 3D de resina e filamento, cortadoras laser e fresadoras CNC.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Zap size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Eletrônica Avançada</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Bancadas equipadas com osciloscópios, fontes e estações de solda.
                      </p>
                    </div>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex-shrink-0 w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                      <Cpu size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">IoT & Robótica</h3>
                      <p className="text-gray-500 leading-relaxed text-sm">
                        Kits de desenvolvimento Arduino, ESP32 e Raspberry Pi à disposição.
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </section>

        {/* Equipment Section */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <FadeIn>
              <div className="text-center mb-8">
                <span className="text-[#00aceb] font-bold tracking-widest uppercase text-sm mb-3 block">Infraestrutura</span>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Equipamentos <span className="text-[#00aceb]">Disponíveis</span>
                </h2>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100">
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10" staggerDelay={0.1}>
                  {/* Coluna 1 */}
                  <div className="space-y-8">
                    <StaggerItem>
                      <div className="flex items-start space-x-6 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-blue-100/50 rounded-xl flex items-center justify-center text-[#00aceb] group-hover:bg-[#00aceb] group-hover:text-white transition-all duration-300">
                          <Printer size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Impressoras 3D</h3>
                          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                            Prototipagem rápida em diversos materiais com alta precisão.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">PLA & ABS</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Resina</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Flexíveis</span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="flex items-start space-x-6 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-green-100/50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                          <Layers size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Cortadora Laser</h3>
                          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                            Corte e gravação de precisão em múltiplos substratos.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Acrílico</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">MDF</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Couro</span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="flex items-start space-x-6 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-purple-100/50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                          <PenTool size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Fresadora CNC</h3>
                          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                            Usinagem de precisão para peças mecânicas complexas.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Alumínio</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Madeira</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">PCB</span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  </div>

                  {/* Coluna 2 */}
                  <div className="space-y-8">
                    <StaggerItem>
                      <div className="flex items-start space-x-6 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-yellow-100/50 rounded-xl flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                          <Wrench size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Bancada Eletrônica</h3>
                          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                            Equipamentos profissionais para análise e montagem de circuitos.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Osciloscópios</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Multímetros</span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="flex items-start space-x-6 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-red-100/50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                          <Monitor size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Estações de Trabalho</h3>
                          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                            Computadores de alta performance com software licenciado.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">CAD/CAM</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Simulação</span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>

                    <StaggerItem>
                      <div className="flex items-start space-x-6 group">
                        <div className="flex-shrink-0 w-14 h-14 bg-teal-100/50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                          <Cpu size={24} />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Kits de Robótica</h3>
                          <p className="text-sm text-gray-500 mb-3 leading-relaxed">
                            Plataformas de desenvolvimento para automação e robótica.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Arduino</span>
                            <span className="px-3 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-600">Raspberry Pi</span>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  </div>
                </StaggerContainer>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </SectionLayout>
  )
}

export default LaboratorioMaker