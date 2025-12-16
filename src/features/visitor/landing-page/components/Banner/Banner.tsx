import React, { useState } from 'react'
import BannerItem from './BannerItem'

// Imagens

import imgVitrine from '@/assets/images/Imagens/004-Reproducao de Projetos.jpg'
import imgBiblioteca from '@/assets/images/Imagens/002-Biblioteca Maker.jpg'
import imgLaboratorio from '@/assets/images/Imagens/003-Lab Maker.jpg'
import imgComunidade from '@/assets/images/Imagens/001-Comunidade Maker.jpg'

import fallbackImg from '@/assets/images/Imagens/001-Comunidade Maker.jpg'

const initialItems = [

  {
    id: 2,
    title: 'Vitrine Tecnológica',
    subtitle: 'Conheça os projetos inovadores desenvolvidos por nossos alunos.',
    image: imgVitrine,
    link: '/vitrine-tecnologica'
  },
  {
    id: 3,
    title: 'Biblioteca Maker',
    subtitle: 'Um acervo completo para inspirar suas criações.',
    image: imgBiblioteca,
    link: '/biblioteca-maker'
  },
  {
    id: 4,
    title: 'Laboratório Maker',
    subtitle: 'Infraestrutura de ponta para prototipagem e desenvolvimento.',
    image: imgLaboratorio,
    link: '/laboratorio-maker'
  },
  {
    id: 5,
    title: 'Comunidade Maker',
    subtitle: 'Conecte-se com outros criadores e compartilhe conhecimento.',
    image: imgComunidade || fallbackImg,
    link: '/comunidade-maker'
  }
]

const Banner: React.FC = () => {
  const [activeId, setActiveId] = useState(2)

  return (
    <section className="bg-slate-900 border-b border-white/10">
      <div className="flex flex-col md:flex-row w-full overflow-hidden min-h-[450px] md:min-h-[60vh]">
        {initialItems.map((item) => (
          <BannerItem
            key={item.id}
            {...item}
            isActive={activeId === item.id}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={() => setActiveId(item.id)}
          />
        ))}
      </div>
    </section>
  )
}

export default Banner
