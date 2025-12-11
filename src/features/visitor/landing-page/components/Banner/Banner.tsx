import React from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Imagens
import banner1 from '@/assets/images/Imagens/001.jpg'
import banner2 from '@/assets/images/Imagens/002.jpg'
import banner3 from '@/assets/images/Imagens/003.jpg'
import banner4 from '@/assets/images/Imagens/004.jpg'

const bannerItems = [
  {
    id: 1,
    image: banner1,
    title: 'Vitrine Tecnológica',
    subtitle: 'Exposição de projetos que transformam o mercado.',
    buttonText: 'EXPLORAR AGORA',
    link: '#vitrine'
  },
  {
    id: 2,
    image: banner2,
    title: 'Inovação Industrial',
    subtitle: 'Soluções avançadas para a indústria 4.0.',
    buttonText: 'CONHEÇA MAIS',
    link: '#inovacao'
  },
  {
    id: 3,
    image: banner3,
    title: 'Educação para o Futuro',
    subtitle: 'Formando os profissionais de amanhã.',
    buttonText: 'INSCREVA-SE',
    link: '#educacao'
  },
  {
    id: 4,
    image: banner4,
    title: 'Parcerias Estratégicas',
    subtitle: 'Conectando empresas e tecnologia.',
    buttonText: 'SEJA PARCEIRO',
    link: '#parcerias'
  }
]

const Banner: React.FC = () => {
  return (
    <section className="relative w-full h-[85vh] bg-slate-900 overflow-hidden group">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        speed={1500}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return '<span class="' + className + ' w-3 h-3 bg-white/50 hover:bg-white rounded-full transition-all duration-300"></span>';
          },
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop={true}
        className="h-full w-full"
      >
        {bannerItems.map((item) => (
          <SwiperSlide key={item.id} className="relative w-full h-full">
            {/* Background Image with Parallax-like scale */}
            <div className="absolute inset-0">
              <motion.img
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 7, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-60"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
              <div className="max-w-3xl">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                >
                  {item.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-200 mb-10 font-light max-w-2xl"
                >
                  {item.subtitle}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-bold tracking-widest transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                    {item.buttonText}
                  </button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Arrows */}
        <div className="swiper-button-prev !text-white/50 hover:!text-white transition-colors after:!text-3xl ml-4 opacity-0 group-hover:opacity-100 duration-300"></div>
        <div className="swiper-button-next !text-white/50 hover:!text-white transition-colors after:!text-3xl mr-4 opacity-0 group-hover:opacity-100 duration-300"></div>

        {/* Custom Pagination Container */}
        <div className="swiper-pagination !bottom-10"></div>
      </Swiper>
    </section>
  )
}

export default Banner
