import React from 'react'
import senaiLogoPath from '@/assets/images/Imagens/022-Senai.png'
import { ArrowRight, ExternalLink, Instagram } from 'lucide-react'

// Primary Color: rgb(37, 99, 235) -> #2563eb
const FOOTER_BG_COLOR = "bg-[#2563eb]"
const FOOTER_TEXT_COLOR = "text-white"


import ParticleBackground from './ParticleBackground'

const Footer: React.FC = () => {
  return (
    <footer className="w-full relative">

      <div className={`relative w-full ${FOOTER_BG_COLOR} ${FOOTER_TEXT_COLOR} overflow-hidden`}>

        {/* Dynamic Moving Particles Background */}
        <ParticleBackground />

        <div className="relative z-10 container mx-auto px-6 pt-8 pb-12">

          {/* Top Section: Logos & Intro */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">

            {/* Left Column: Brand & CTA */}
            <div className="lg:w-4/12 flex flex-col items-start text-left">
              <div className="mb-8">
                <img
                  src={senaiLogoPath}
                  alt="Logo SUPERA/SENAI"
                  className="h-14 md:h-16 brightness-0 invert object-contain mb-6"
                />

                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Educação, Tecnologia e Inovação
                </h2>
              </div>

              {/* CTA Button "Portal" style - White Pill */}
              <a
                href="/vitrine-tecnologica"
                className="inline-flex items-center gap-3 bg-white text-[#2563eb] px-6 py-2.5 rounded-full font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg group text-sm"
              >
                <span>Vitrine Tecnológica</span>
                <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center group-hover:bg-[#1d4ed8] transition-colors">
                  <ArrowRight size={14} />
                </div>
              </a>
            </div>

            {/* Right Column: Links Grid */}
            <div className="lg:w-7/12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 text-sm md:text-base">

              {/* Principal */}
              <div>
                <h4 className="font-bold mb-4 uppercase text-sm md:text-base tracking-wider opacity-90">Principal</h4>
                <ul className="space-y-3">

                  <li><a href="/sobre" className="hover:text-white transition-all duration-200 transform hover:-translate-y-0.5">Sobre</a></li>
                  <li><a href="/vitrine-tecnologica" className="hover:text-white transition-all duration-200 transform hover:-translate-y-0.5">Vitrine Tecnológica</a></li>
                  <li><a href="/noticias" className="hover:text-white transition-all duration-200 transform hover:-translate-y-0.5">Notícias</a></li>
                </ul>
              </div>

              {/* Explorar */}
              <div>
                <h4 className="font-bold mb-4 uppercase text-sm md:text-base tracking-wider opacity-90">Explorar</h4>
                <ul className="space-y-3">

                  <li><a href="/inovacao" className="hover:text-white transition-all duration-200 transform hover:-translate-y-0.5">Inovação</a></li>
                  <li><a href="/biblioteca-maker" className="hover:text-white transition-all duration-200 transform hover:-translate-y-0.5">Biblioteca</a></li>
                  <li><a href="/laboratorio-maker" className="hover:text-white transition-all duration-200 transform hover:-translate-y-0.5">Lab Maker</a></li>
                </ul>
              </div>

              {/* Contato */}
              <div>
                <h4 className="font-bold mb-4 uppercase text-sm md:text-base tracking-wider opacity-90">Contato</h4>
                <ul className="space-y-3">
                  <li><a href="mailto:cacsenaifeira@fieb.org.br" className="hover:text-white transition-all duration-200 truncate block">Email</a></li>
                  <li><a href="tel:+557532299100" className="hover:text-white transition-all duration-200">(75) 3229-9100</a></li>

                </ul>
              </div>

              {/* Redes */}
              <div>
                <h4 className="font-bold mb-4 uppercase text-sm md:text-base tracking-wider opacity-90">Redes</h4>
                <ul className="space-y-3">
                  <li>
                    <a href="https://www.instagram.com/senai.fsa/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-all duration-200 transform hover:translate-x-1">
                      <Instagram size={16} />
                      <span>@senai.fsa</span>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/mobiliza.senaifeira/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-all duration-200 transform hover:translate-x-1">
                      <Instagram size={16} />
                      <span>@mobiliza.senaifeira</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Divider with distinct spacing */}
          <div className="w-full h-px bg-white/15 mb-6 mt-6"></div>

          {/* Bottom Section: Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm md:text-base opacity-80 gap-4">
            <p className="text-sm">© 2025 SENAI Feira de Santana. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="/politica-de-privacidade" className="hover:text-white transition-all duration-200 transform hover:underline">Política de Privacidade</a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer
