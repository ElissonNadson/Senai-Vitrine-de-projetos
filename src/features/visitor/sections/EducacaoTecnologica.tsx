import React from 'react'
import SectionLayout from '../layout/SectionLayout'
import img5 from '@/assets/images/Imagens/005-Titulo sobre o Senai.png'
import FadeIn from '@/components/ui/FadeIn'
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer'

const EducacaoTecnologica: React.FC = () => {
  return (
    <SectionLayout>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <FadeIn>
        <section className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img5})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 uppercase tracking-wider">
                Educação Tecnológica
              </h1>
              <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto">
                Formando os profissionais do futuro através da excelência educacional
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
                  Educação que Transforma Carreiras
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  No SENAI, a Educação Tecnológica vai além do ensino tradicional. 
                  Oferecemos uma abordagem integrada que combina teoria sólida, 
                  prática intensiva e inovação constante, preparando nossos estudantes 
                  para os desafios da Indústria 4.0.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Nossa metodologia pedagógica é baseada em competências, utilizando 
                  tecnologias de ponta e metodologias ativas de aprendizagem que 
                  garantem a formação de profissionais altamente qualificados.
                </p>
              </div>
            </FadeIn>
            <StaggerContainer className="space-y-6" staggerDelay={0.15}>
              <StaggerItem>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Metodologia Ativa</h3>
                  <p className="text-gray-600">
                    Aprendizagem baseada em projetos, problemas reais 
                    e experiências práticas na indústria.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Tecnologia de Ponta</h3>
                  <p className="text-gray-600">
                    Laboratórios equipados com as mais modernas 
                    tecnologias utilizadas na indústria.
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Parceria Industrial</h3>
                  <p className="text-gray-600">
                    Conexão direta com empresas para estágios, 
                    projetos e oportunidades de carreira.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <FadeIn delay={0.2}>
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Nossos Números
            </h2>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8" staggerDelay={0.1}>
              <StaggerItem>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">98%</div>
                  <div className="text-blue-100">Taxa de Empregabilidade</div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">25+</div>
                  <div className="text-blue-100">Cursos Disponíveis</div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">5.000+</div>
                  <div className="text-blue-100">Alunos Formados</div>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">200+</div>
                  <div className="text-blue-100">Empresas Parceiras</div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </FadeIn>

      {/* CTA Section */}
      <FadeIn delay={0.3}>
        <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-6">
              Comece Sua Jornada Tecnológica
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Inscreva-se em nossos cursos e transforme seu futuro profissional
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors duration-300 hover:scale-105 transform">
              Ver Cursos Disponíveis
            </button>
          </div>
        </section>
      </FadeIn>
      </div>
    </SectionLayout>
  )
}

export default EducacaoTecnologica