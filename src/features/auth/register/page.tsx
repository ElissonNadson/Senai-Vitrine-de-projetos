import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from './components/register-form'
import bgCard from '@/assets/bg-card.jpg'
import senaiLogo from '@/assets/images/Imagens/022-Senai.png'

const RegisterPage = () => {
  const navigate = useNavigate()

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${bgCard})` }}
    >
      {/* Header */}
      <header className="w-full">
        {/* Barra Superior Azul */}
        <div className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-center items-center">
              <div className="text-center">
                <h1 className="text-lg font-semibold text-white">
                  SENAI Feira de Santana
                </h1>
                <p className="text-blue-100 text-sm">
                  Educação, Tecnologia e Inovação
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Header Principal */}
        <div className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              {/* Logo e Navegação Principal */}
              <div className="flex items-center space-x-16">
                {/* Logo */}
                <button onClick={() => navigate('/')} className="cursor-pointer">
                  <img src={senaiLogo} alt="Logo SENAI" className="h-16 hover:scale-105 transition-transform duration-200" />
                </button>

                {/* Navegação Principal (Desktop) */}
                <nav className="hidden lg:flex space-x-10">
                  <button
                    onClick={() => navigate('/sobre')}
                    className="text-gray-700 hover:text-blue-600 font-medium text-base transition-colors duration-200 relative group py-2"
                  >
                    Sobre o SENAI
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                  
                  {/* Dropdown para Seções Maker */}
                  <div className="relative group">
                    <button className="text-gray-700 hover:text-blue-600 font-medium text-base transition-colors duration-200 relative py-2 flex items-center space-x-1">
                      <span>Seções Maker</span>
                      <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </button>
                  </div>

                  <button
                    onClick={() => navigate('/')}
                    className="text-gray-700 hover:text-blue-600 font-medium text-base transition-colors duration-200 relative group py-2"
                  >
                    Eventos e Notícias
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </button>
                </nav>
              </div>

              {/* Área de Navegação */}
              <div className="flex items-center space-x-4">
                {/* Botão Login (Desktop) */}
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm"
                >
                  Já tem conta? Faça Login
                </Link>

                {/* Botão Voltar (Desktop) */}
                <Link
                  to="/"
                  className="hidden md:inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar
                </Link>

                {/* Botões Mobile */}
                <div className="lg:hidden flex space-x-2">
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 focus:outline-none transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </Link>
                  <Link
                    to="/"
                    className="text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="max-w-4xl w-full mx-auto">
          {/* Card principal */}
          <div className="bg-white/95 backdrop-blur-sm p-6 lg:p-8 rounded-xl shadow-2xl border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Criar Conta
              </h2>
              <p className="text-sm text-gray-600">
                Junte-se à comunidade SENAI e tenha acesso completo ao portal
              </p>
            </div>
            
            <RegisterForm />
            
            {/* Link para login */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-sm text-gray-500">
              © 2025 SENAI Feira de Santana. Todos os direitos reservados.
            </div>
            <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400">
              <Link to="#" className="hover:text-blue-600 transition-colors">Termos de Uso</Link>
              <span>•</span>
              <Link to="/politica-de-privacidade" className="hover:text-blue-600 transition-colors">Política de Privacidade</Link>
              <span>•</span>
              <Link to="#" className="hover:text-blue-600 transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default RegisterPage
