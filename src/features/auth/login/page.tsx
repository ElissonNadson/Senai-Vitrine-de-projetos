import React from 'react'
import { Link } from 'react-router-dom'
import LoginForm from './components/simple-login-form'
import bgCard from '@/assets/bg-card.jpg'
import senaiLogo from '@/assets/images/Imagens/022-Senai.png'

const LoginPage = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url(${bgCard})` }}
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <img
                className="h-12 w-auto"
                src={senaiLogo}
                alt="Logo SENAI"
              />
            </Link>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </Link>
            </nav>
          </div>
        </div>
      </header>      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full mx-auto">          {/* Card principal */}
          <div className="bg-white/95 backdrop-blur-sm p-8 lg:p-12 rounded-2xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Acesse sua conta
              </h2>
              <p className="text-gray-600">
                Entre com suas credenciais para acessar o repositório
              </p>
            </div>            
            <LoginForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2025 SENAI. Todos os direitos reservados.
            </div>
          
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage