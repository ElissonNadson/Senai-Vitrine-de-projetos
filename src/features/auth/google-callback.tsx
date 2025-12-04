import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface UserData {
  accessToken: string
  refreshToken?: string
  usuariosEntity: {
    tipo: 'PROFESSOR' | 'ALUNO'
    nome: string
    email: string
    primeiroAcesso?: boolean
    matricula?: string | null
    curso?: string | null
  }
}

// Flag GLOBAL fora do componente para persistir entre re-renders
let hasAlreadyProcessed = false

const GoogleCallback = () => {
  const { login } = useAuth()
  const [status, setStatus] = useState('Processando login...')
  const [error, setError] = useState('')

  useEffect(() => {
    // Verificar flag global PRIMEIRO
    if (hasAlreadyProcessed) {
      console.log('⚠️ Callback já foi processado globalmente, ignorando...')
      return
    }

    // Pegar dados da URL atual (não do React Router)
    const urlParams = new URLSearchParams(window.location.search)
    const dataParam = urlParams.get('data')
    
    // Se não tem dados na URL, redirecionar para login
    if (!dataParam) {
      console.log('⚠️ Sem dados de callback na URL - redirecionando para login')
      setError('Sessão inválida ou expirada')
      setTimeout(() => {
        window.location.replace('/login')
      }, 1500)
      return
    }

    // MARCAR COMO PROCESSADO IMEDIATAMENTE
    hasAlreadyProcessed = true
    console.log('🔧 GoogleCallback - Iniciando processamento único')

    const processLogin = async () => {
      try {
        setStatus('Processando dados de autenticação...')
        
        const userData: UserData = JSON.parse(decodeURIComponent(dataParam))
        console.log('📦 Usuário:', userData.usuariosEntity?.nome)
        console.log('👤 Tipo:', userData.usuariosEntity?.tipo)
        console.log('🆕 Primeiro acesso:', userData.usuariosEntity?.primeiroAcesso)
        
        // Salvar login
        setStatus('Salvando dados...')
        await login(userData)
        console.log('✅ Login salvo!')
        
        setStatus('Login realizado com sucesso!')
        
        // Determinar destino baseado em primeiroAcesso
        const userType = userData.usuariosEntity?.tipo
        const primeiroAcesso = userData.usuariosEntity?.primeiroAcesso
        
        let redirectTo = '/app'
        
        if (userType === 'ALUNO') {
          if (primeiroAcesso === true) {
            redirectTo = '/complete-profile'
            console.log('📝 Aluno - primeiro acesso, ir para completar perfil')
          } else {
            redirectTo = '/app'
            console.log('👨‍🎓 Aluno com perfil completo')
          }
        } else if (userType === 'PROFESSOR') {
          if (primeiroAcesso === true) {
            redirectTo = '/complete-profile/professor'
            console.log('📝 Professor - primeiro acesso, ir para completar perfil')
          } else {
            redirectTo = '/teacher'
            console.log('👨‍🏫 Professor com perfil completo')
          }
        }
        
        console.log('🔀 Redirecionando para:', redirectTo)
        
        // REDIRECIONAMENTO DEFINITIVO - replace não permite voltar
        setTimeout(() => {
          window.location.replace(redirectTo)
        }, 1200)
        
      } catch (err) {
        console.error('❌ Erro:', err)
        hasAlreadyProcessed = false // Permitir retry em caso de erro
        setError('Erro ao processar login')
        setTimeout(() => {
          window.location.replace('/login')
        }, 2000)
      }
    }

    processLogin()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        {error ? (
          <>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">
              Erro na Autenticação
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="text-sm text-gray-500">
              Redirecionando para página de login...
            </div>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Processando Login do Google
            </h2>
            <p className="text-gray-600 mb-4">{status}</p>
            <div className="text-sm text-gray-500">
              Aguarde alguns segundos...
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default GoogleCallback