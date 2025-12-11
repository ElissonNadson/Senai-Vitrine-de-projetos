import React from 'react'
import FadeIn from '@/components/ui/FadeIn'
import instagramIconPath from '@/assets/images/Imagens/020-Instagram.png'

const SocialMediaSection: React.FC = () => {
  return (
    <section className="w-full">
      {/* Seção Superior com fundo azul */}
      <FadeIn>
        <div className="bg-blue-600 py-16 flex flex-col md:flex-row justify-center items-center gap-12 text-center md:text-left">

          <div className="flex flex-col md:flex-row items-center cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open('https://www.instagram.com/mobiliza.senaifeira/', '_blank')}>
            <img
              src={instagramIconPath}
              alt="Instagram"
              className="w-20 h-20 mb-4 md:mb-0 md:mr-6 drop-shadow-lg"
            />
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-1">Acompanhe-nos</h3>
              <p className="text-blue-100 text-lg">@mobiliza.senaifeira</p>
              <span className="inline-block mt-3 px-4 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm border border-white/30">
                Instagram Oficial
              </span>
            </div>
          </div>

        </div>
      </FadeIn>
    </section>
  )
}

export default SocialMediaSection
