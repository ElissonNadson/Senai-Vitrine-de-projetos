import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Cpu, Users, LayoutGrid } from 'lucide-react'
import { motion } from 'framer-motion'
import Reveal from '@/components/Motion/Reveal'

const CardSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Elements (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">

        {/* Header Section */}
        <Reveal width="100%" className="mb-12">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-2xl">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="h-1 w-6 bg-[#00aceb] rounded-full" />
                <span className="text-[#00aceb] font-bold tracking-widest text-xs uppercase">O que fazemos</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Nosso Ecossistema <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00aceb] to-blue-600">
                  de Inovação
                </span>
              </h2>
            </div>
          </div>
        </Reveal>

        {/* Bento Grid Layout - Compact Mode */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[250px]">

          {/* Card 1: Vitrine Tecnológica (Large - 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate('/vitrine-tecnologica')}
            className="group relative md:col-span-2 row-span-1 overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl hover:shadow-blue-500/10 border border-gray-100 transition-all duration-300 cursor-pointer text-white"
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("https://tecplanstands.com.br/wp-content/uploads/2024/12/stands-para-eventos.jpg")' }}
            />
            {/* White/Blue Gradient Overlay for Vitrine to keep it light/tech but readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-transparent group-hover:from-blue-900/95 transition-all duration-500" />

            {/* Geometric Shapes (kept subtle) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />

            <div className="relative h-full flex flex-row items-center p-8 gap-6 justify-center md:justify-start text-center md:text-left">
              <div className="flex-1 flex flex-col items-center md:items-start">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">
                  Vitrine Tecnológica
                </h3>
                <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-lg mb-4">
                  A plataforma central onde projetos ganham vida e visibilidade.
                </p>
                <div className="inline-flex items-center text-sm font-semibold text-white group-hover:translate-x-1 transition-transform duration-300 border border-white/30 px-4 py-2 rounded-full hover:bg-white/10">
                  Explorar Vitrine <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Laboratórios (Square - 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => navigate('/laboratorio-maker')}
            className="group relative md:col-span-1 row-span-1 overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer text-white"
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: 'url("https://www.acritica.com/image/policy:1.13627.1646801501:1646801501/image.jpg?f=default&w=1200")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 group-hover:from-black/95 transition-all duration-500" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 z-10 text-center">
              <h3 className="text-xl font-bold mb-2">Laboratórios</h3>
              <p className="text-gray-300 text-xs md:text-sm mb-0 leading-relaxed group-hover:text-white transition-colors max-w-[200px]">
                Infraestrutura maker de ponta para prototipagem.
              </p>
            </div>
          </motion.div>

          {/* Card 3: Comunidade Maker (Square - 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => navigate('/comunidade-maker')}
            className="group relative md:col-span-1 row-span-1 overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer"
          >
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: 'url("https://img.freepik.com/fotos-gratis/visao-traseira-de-pessoas-diversas-abracando-se_53876-105340.jpg?semt=ais_hybrid&w=740&q=80")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:from-orange-900/90 transition-all duration-500" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center p-6 z-10 text-center text-white">
              <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">Comunidade</h3>
              <p className="text-gray-200 text-xs md:text-sm leading-relaxed max-w-[200px]">
                Networking e colaboração.
              </p>
            </div>
          </motion.div>



        </div>
      </div>
    </section>
  )
}

export default CardSection
