import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Importar o logo
import senaiLogoPath from '@/assets/images/Imagens/022-Senai.png'

interface HeaderProps {
  // Propriedades do componente, se necessário
}

// Barra Superior - Estilo Portal da Indústria
const TopBar: React.FC = () => {
  return (
    <div className="bg-blue-600 text-white font-sans relative z-50 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-10">
          {/* Menu Mobile Icon (apenas visual para mobile) */}
          <div className="md:hidden pr-4 border-r border-white/20 h-full flex items-center cursor-pointer text-white/80 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>

          <a
            href="https://www.senaibahia.com.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center h-full px-4 text-[11px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors border-r border-white/20"
          >
            Portal SENAI Bahia
          </a>

          <a
            href="https://senaiweb6.fieb.org.br/framehtml/web/app/edu/PortalEducacional/login/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center h-full px-4 text-[11px] font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors border-r border-white/20"
          >
            Acesso Portal do Aluno
          </a>
        </div>
      </div>
    </div>
  )
}

// Componente de Sub-navegação
const SectionSubNav: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const sectionPages = {
    '/vitrine-tecnologica': { name: 'Vitrine Tecnológica', icon: '🚀', color: 'purple' },
    '/biblioteca-maker': { name: 'Biblioteca Maker', icon: '📚', color: 'orange' },
    '/laboratorio-maker': { name: 'Laboratório Maker', icon: '🔬', color: 'cyan' },
    '/comunidade-maker': { name: 'Comunidade Maker', icon: '🤝', color: 'blue' }
  }

  const currentSection = sectionPages[location.pathname as keyof typeof sectionPages]

  if (!currentSection) return null

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 shadow-sm">

    </div>
  )
}

const Header: React.FC<HeaderProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMakerExpanded, setIsMakerExpanded] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleLogoClick = () => {
    navigate('/')
  }

  // Verificar se estamos na landing page
  const isLandingPage = location.pathname === '/'

  // Função para lidar com navegação dos links
  const handleNavigation = (section: string) => {
    if (isLandingPage) {
      // Se estivermos na landing page, usar scroll suave
      const element = document.querySelector(section)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Se não estivermos na landing page, navegar para a landing page com a seção
      navigate(`/${section}`)
    }
  }

  return (
    <header className="w-full">
      {/* Barra Superior Premium - Links Institucionais */}
      <TopBar />

      {/* Barra de Identidade da Unidade */}
      <>


        {/* Header Principal */}
        <div className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Logo e Navegação Principal */}
              <div className="flex items-center space-x-16">
                {/* Logo */}
                <button onClick={handleLogoClick} className="cursor-pointer">
                  <img src={senaiLogoPath} alt="Logo SENAI" className="h-14 hover:scale-105 transition-transform duration-200" />
                </button>

                {/* Navegação Principal (Desktop) */}
                <nav className="hidden lg:flex space-x-10">
                  <button
                    onClick={() => navigate('/sobre')}
                    className="text-gray-700 hover:text-[#00aceb] font-medium text-base transition-colors duration-200 relative group py-2"
                  >
                    Sobre o SENAI
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00aceb] group-hover:w-full transition-all duration-300"></span>
                  </button>

                  {/* Dropdown para Seções Maker */}
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-[#00aceb] font-medium text-base transition-colors duration-200 relative py-2 flex items-center space-x-1">
                      <span>Seções Maker</span>
                      <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00aceb] group-hover:w-full transition-all duration-300"></span>
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 mt-2 overflow-hidden transform origin-top-left">
                      <div className="py-1">
                        <button
                          onClick={() => navigate('/vitrine-tecnologica')}
                          className="w-full text-left px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/item border-l-4 border-transparent hover:border-blue-600"
                        >
                          <div className="font-bold text-sm">Vitrine Tecnológica</div>
                          <div className="text-xs text-gray-500 group-hover/item:text-blue-600/80">Projetos e Inovação</div>
                        </button>

                        <button
                          onClick={() => navigate('/biblioteca-maker')}
                          className="w-full text-left px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/item border-l-4 border-transparent hover:border-blue-600"
                        >
                          <div className="font-bold text-sm">Biblioteca Maker</div>
                          <div className="text-xs text-gray-500 group-hover/item:text-blue-600/80">Conhecimento</div>
                        </button>

                        <button
                          onClick={() => navigate('/laboratorio-maker')}
                          className="w-full text-left px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/item border-l-4 border-transparent hover:border-blue-600"
                        >
                          <div className="font-bold text-sm">Lab Maker</div>
                          <div className="text-xs text-gray-500 group-hover/item:text-blue-600/80">Prototipagem</div>
                        </button>

                        <button
                          onClick={() => navigate('/comunidade-maker')}
                          className="w-full text-left px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group/item border-l-4 border-transparent hover:border-blue-600"
                        >
                          <div className="font-bold text-sm">Comunidade</div>
                          <div className="text-xs text-gray-500 group-hover/item:text-blue-600/80">Networking</div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/noticias')}
                    className="text-gray-700 hover:text-[#00aceb] font-medium text-base transition-colors duration-200 relative group py-2"
                  >
                    Eventos e Notícias
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00aceb] group-hover:w-full transition-all duration-300"></span>
                  </button>
                </nav>
              </div>

              {/* Área de Login e Menu Mobile */}
              <div className="flex items-center space-x-4">
                {/* Botão de Login (Desktop) - Aumentado */}
                <button
                  onClick={handleLogin}
                  className="hidden md:flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full text-base font-bold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>Entrar</span>
                </button>

                {/* Botão Menu Mobile */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden text-gray-700 hover:text-[#00aceb] focus:outline-none transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Menu Mobile */}
          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg animate-fade-in-down">
              <nav className="container mx-auto px-4 py-6 space-y-4">
                <button
                  onClick={() => {
                    navigate('/sobre')
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-[#00aceb] py-3 px-4 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                >
                  Sobre o SENAI
                </button>

                {/* Submenu Maker Mobile */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsMakerExpanded(!isMakerExpanded)}
                    className="flex items-center justify-between w-full text-left text-gray-700 hover:text-[#00aceb] py-3 px-4 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                  >
                    <span>Seções Maker</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isMakerExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Itens do Submenu */}
                  {isMakerExpanded && (
                    <div className="bg-gray-50 rounded-xl space-y-1 p-2 ml-4 border-l-2 border-blue-100">
                      <button
                        onClick={() => {
                          navigate('/vitrine-tecnologica')
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left text-gray-600 hover:text-[#00aceb] py-2 px-4 rounded-lg hover:bg-white transition-all duration-200 text-sm"
                      >
                        Vitrine Tecnológica
                      </button>
                      <button
                        onClick={() => {
                          navigate('/biblioteca-maker')
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left text-gray-600 hover:text-[#00aceb] py-2 px-4 rounded-lg hover:bg-white transition-all duration-200 text-sm"
                      >
                        Biblioteca Maker
                      </button>
                      <button
                        onClick={() => {
                          navigate('/laboratorio-maker')
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left text-gray-600 hover:text-[#00aceb] py-2 px-4 rounded-lg hover:bg-white transition-all duration-200 text-sm"
                      >
                        Lab Maker
                      </button>
                      <button
                        onClick={() => {
                          navigate('/comunidade-maker')
                          setIsMobileMenuOpen(false)
                        }}
                        className="block w-full text-left text-gray-600 hover:text-[#00aceb] py-2 px-4 rounded-lg hover:bg-white transition-all duration-200 text-sm"
                      >
                        Comunidade
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    navigate('/noticias')
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left text-gray-700 hover:text-[#00aceb] py-3 px-4 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                >
                  Eventos e Notícias
                </button>

                {/* Login no Mobile */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleLogin()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-center space-x-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl text-lg font-bold transition-all duration-200 shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Fazer Login</span>
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </>

      {/* Sub-navegação melhorada */}
      <SectionSubNav />
    </header>
  )
}

export default Header
