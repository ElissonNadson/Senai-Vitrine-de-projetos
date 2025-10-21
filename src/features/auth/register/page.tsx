import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from './components/register-form'
import senaiLogo from '@/assets/images/Imagens/022-Senai.png'

const RegisterPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-fluid">
        <div className="flex min-h-screen">
          {/* Coluna Esquerda - Formulário */}
          <div className="w-full lg:w-7/12 bg-white flex flex-col p-6 md:p-8 lg:p-8">
            {/* Logo */}
            <button 
              onClick={() => navigate('/')} 
              className="mb-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img 
                src={senaiLogo} 
                alt="SENAI Logo" 
                className="h-9 md:h-10"
              />
            </button>

            {/* Título e Subtítulo */}
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Crie sua conta
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                Cadastre-se e comece a compartilhar seus projetos na vitrine.
              </p>
            </div>

            {/* Formulário */}
            <div className="mb-auto max-w-2xl">
              <RegisterForm />
              
              {/* Link para login */}
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Faça login aqui
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer - Redes Sociais */}
            <footer className="mt-auto pt-6 hidden md:block">
              <p className="text-center text-gray-700 mb-3 font-medium text-sm">
                Nos siga nas redes
              </p>
              <div className="flex items-center justify-center space-x-4">
                <a
                  href="https://instagram.com/senai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="Instagram"
                >
                  <img
                    src="https://login.anhanguera.com/graph/social/instagram.svg"
                    alt="Instagram"
                    className="w-8 h-8"
                  />
                </a>
                <a
                  href="https://www.facebook.com/senai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="Facebook"
                >
                  <img
                    src="https://login.anhanguera.com/graph/social/facebook.svg"
                    alt="Facebook"
                    className="w-8 h-8"
                  />
                </a>
                <a
                  href="https://twitter.com/senai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="X (Twitter)"
                >
                  <img
                    src="https://login.anhanguera.com/graph/social/twitter.svg"
                    alt="X (Twitter)"
                    className="w-8 h-8"
                  />
                </a>
                <a
                  href="https://youtube.com/senai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  title="YouTube"
                >
                  <img
                    src="https://login.anhanguera.com/graph/social/youtube.svg"
                    alt="YouTube"
                    className="w-8 h-8"
                  />
                </a>
              </div>
            </footer>
          </div>

          {/* Coluna Direita - Imagem de Fundo (Desktop Only) */}
          <div className="hidden lg:block lg:w-5/12 relative p-0">
            <div 
              className="sticky top-0 h-screen bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://img.freepik.com/fotos-premium/estudante-trabalhando-em-projeto-eletronico-em-laboratorio-de-engenharia_1314467-88234.jpg)',
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
