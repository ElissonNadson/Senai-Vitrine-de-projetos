import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import RegisterForm from './components/register-form'
import senaiLogo from '@/assets/images/Imagens/022-Senai.png'
import registerBg from '@/assets/alunos-com-laptop-medio-tiro.jpg'

const RegisterPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-fluid">
        <div className="flex min-h-screen">
          {/* Coluna Esquerda - Formulário */}
          <div className="w-full lg:w-7/12 bg-white flex flex-col p-6 md:p-8 lg:p-12 xl:p-16">
            {/* Container centralizado para todo conteúdo */}
            <div className="flex flex-col min-h-full max-w-3xl mx-auto w-full">
              {/* Logo */}
              <button 
                onClick={() => navigate('/')} 
                className="mb-3 cursor-pointer hover:opacity-80 transition-opacity self-start"
              >
                <img 
                  src={senaiLogo} 
                  alt="SENAI Logo" 
                  className="h-9 md:h-10"
                />
              </button>

              {/* Título e Subtítulo */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-3 rounded-xl shadow-lg">
                    <UserPlus className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Junte-se a nós
                  </h2>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  Cadastre-se usando sua conta Google e comece a compartilhar seus projetos.
                </p>
              </div>

              {/* Formulário */}
              <div className="mb-auto">
                <RegisterForm />
              </div>
            </div>
          </div>

          {/* Coluna Direita - Imagem de Fundo (Desktop Only) */}
          <div className="hidden lg:block lg:w-5/12 relative p-0">
            <div 
              className="sticky top-0 h-screen bg-cover bg-center"
              style={{
                backgroundImage: `url(${registerBg})`,
                backgroundPosition: 'center center'
              }}
            >
              {/* Overlay com gradiente para melhor legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 via-orange-800/40 to-transparent"></div>
              
              {/* Conteúdo sobre a imagem */}
              <div className="relative h-full flex flex-col justify-end p-16 text-white">
                <div className="max-w-md">
                  <h3 className="text-4xl font-bold mb-4 drop-shadow-lg">
                    Mostre seu talento
                  </h3>
                  <p className="text-xl text-gray-100 drop-shadow-md">
                    Crie sua vitrine virtual e exiba seus projetos para empresas e recrutadores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
