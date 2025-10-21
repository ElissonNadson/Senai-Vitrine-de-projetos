import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import LoginForm from './components/simple-login-form'
import senaiLogo from '@/assets/images/Imagens/022-Senai.png'
import loginBg from '@/assets/colaboracao-em-grupo-em-torno-de-um-portatil-em-um-espaco-de-trabalho-criativo.jpg'

const LoginPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-fluid">
        <div className="flex min-h-screen">
          {/* Coluna Esquerda - Imagem de Fundo (Desktop Only) */}
          <div className="hidden lg:block lg:w-5/12 relative p-0">
            <div 
              className="sticky top-0 h-screen bg-cover bg-center"
              style={{
                backgroundImage: `url(${loginBg})`,
                backgroundPosition: 'center center'
              }}
            >
              {/* Overlay com gradiente para melhor legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-800/40 to-transparent"></div>
              
              {/* Conteúdo sobre a imagem */}
              <div className="relative h-full flex flex-col justify-end p-16 text-white">
                <div className="max-w-md">
                  <h3 className="text-4xl font-bold mb-4 drop-shadow-lg">
                    Vitrine de Projetos SENAI
                  </h3>
                  <p className="text-xl text-gray-100 drop-shadow-md">
                    Exponha seus projetos para o mundo e inspire outros estudantes e profissionais.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Formulário */}
          <div className="w-full lg:w-7/12 bg-white flex flex-col p-6 md:p-8 lg:p-12 xl:p-16">
            {/* Container centralizado para todo conteúdo */}
            <div className="flex flex-col min-h-full max-w-2xl mx-auto w-full">
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
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-3 rounded-xl shadow-lg">
                    <LogIn className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Boas-vindas
                  </h2>
                </div>
                <p className="text-sm md:text-base text-gray-600">
                  Acesse a Vitrine de Projetos e compartilhe sua inovação.
                </p>
              </div>

              {/* Formulário */}
              <div className="mb-auto">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage