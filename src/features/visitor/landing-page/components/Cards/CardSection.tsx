import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Cpu, Users, Zap } from 'lucide-react'
import StaggerContainer, { StaggerItem } from '@/components/Motion/StaggerContainer'
import Reveal from '@/components/Motion/Reveal'

const services = [
  {
    icon: <Zap className="w-10 h-10 text-yellow-400" />,
    title: 'Vitrine Tecnológica',
    description: 'Explore projetos inovadores desenvolvidos com excelência técnica.',
    route: '/vitrine-tecnologica',
    color: 'from-yellow-400/20 to-orange-500/10'
  },
  {
    icon: <Users className="w-10 h-10 text-blue-400" />,
    title: 'Comunidade Maker',
    description: 'Um espaço colaborativo para troca de conhecimento e networking.',
    route: '/comunidade-maker',
    color: 'from-blue-400/20 to-indigo-500/10'
  },
  {
    icon: <Cpu className="w-10 h-10 text-purple-400" />,
    title: 'Laboratórios',
    description: 'Infraestrutura de ponta para prototipagem e desenvolvimento.',
    route: '/laboratorio-maker',
    color: 'from-purple-400/20 to-pink-500/10'
  },
  {
    icon: <BookOpen className="w-10 h-10 text-green-400" />,
    title: 'Educação',
    description: 'Metodologia prática focada em resolver desafios reais da indústria.',
    route: '/educacao-tecnologica',
    color: 'from-green-400/20 to-emerald-500/10'
  }
]

const CardSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">

        {/* Header Simples Centralizado */}
        <Reveal width="100%" className="mb-16 text-center">
          <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">
            O que fazemos
          </h4>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Ecossistema de Inovação
          </h2>
        </Reveal>

        {/* Grid Centralizado */}
        <div className="max-w-6xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <StaggerItem key={index} className="h-full">
                <div
                  onClick={() => navigate(service.route)}
                  className="h-full p-6 bg-white rounded-xl border border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 leading-relaxed group-hover:text-gray-700">
                      {service.description}
                    </p>
                    <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm group-hover:scale-105 transition-transform duration-300">
                      Saiba mais <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}

export default CardSection
