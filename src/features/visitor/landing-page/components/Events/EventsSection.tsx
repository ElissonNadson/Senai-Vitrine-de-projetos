import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import EventCard from './EventCard'
import Reveal from '@/components/Motion/Reveal'
import EventsSkeleton from './EventsSkeleton'

import { useNoticias } from '@/hooks/use-noticias'

// Fallback images (if news has no image)
import defaultImage from '@/assets/images/Imagens/010-Saiba mais - Eventos e Noticias.jpg'

const EventsSection: React.FC = () => {
  // Fetch real news
  const { data, isLoading } = useNoticias({ publicOnly: true, limit: 6 })

  // Transform real data to match EventCard interface
  const eventsData = data?.data?.map((item: any) => ({
    id: item.uuid,
    imageUrl: item.banner_url || defaultImage,
    isLarge: false,
    mainTitle: item.titulo,
    dateText: new Date(item.data_publicacao).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }).toUpperCase(),
    buttonLink: `/noticias/${item.uuid}`
  })) || []

  if (isLoading) {
    return <EventsSkeleton />
  }



  return (
    <section className="py-24 bg-white relative overflow-hidden" id="eventos-noticias">
      <div className="container mx-auto px-6">

        {/* Centered Header Pattern (matching 'SUPERA na Mídia') */}
        <div className="flex flex-col items-center text-center mb-16">

          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#00aceb]"></div>
            {/* Optional: Add a small tag or just keep the dot */}
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
            Eventos e <span className="text-[#00aceb]">Notícias</span>
          </h2>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Confira aqui alguns eventos que acontecem no SENAI de Feira de Santana/BA.
          </p>

          <a
            href="/noticias"
            className="inline-flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-4 rounded-full font-bold transition-all duration-300 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#00aceb] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            <span className="text-lg">Acesse</span>
          </a>

        </div>

        <Reveal width="100%" delay={0.2}>
          <div className="relative group/carousel"> {/* Container for Navigation Arrows */}

            {/* Custom Navigation Arrows (Absolute positioned on sides) */}
            <div className="absolute top-1/2 -left-4 md:-left-12 z-10 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:flex">
              <div className="swiper-button-prev-custom w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-[#00aceb] hover:text-white transition-all shadow-lg text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </div>
            </div>
            <div className="absolute top-1/2 -right-4 md:-right-12 z-10 -translate-y-1/2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hidden md:flex">
              <div className="swiper-button-next-custom w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center cursor-pointer hover:bg-[#00aceb] hover:text-white transition-all shadow-lg text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>

            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              pagination={{ clickable: true, dynamicBullets: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }, // Explicitly 3 items per row
                1280: { slidesPerView: 3 }
              }}
              className="pb-16 !overflow-visible px-4"
            >
              {eventsData.map((event) => (
                <SwiperSlide key={event.id} className="h-full">
                  <div className="h-full">
                    <EventCard
                      imageUrl={event.imageUrl}
                      isLarge={false}
                      mainTitle={event.mainTitle}
                      dateText={event.dateText}
                      buttonLink={event.buttonLink}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default EventsSection
