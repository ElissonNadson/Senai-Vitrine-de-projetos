import React, { useState } from 'react'
import {
  User,
  LogIn
} from 'lucide-react'
import senailogo from '../../assets/images/Imagens/022-Senai.png'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/auth-context'

// Header Component
const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Função para obter tipo de usuário
  const getUserType = () => {
    if (!isAuthenticated || !user) return 'visitante';
    return user.tipo?.toLowerCase() || 'visitante';
  };

  const userType = getUserType();

  // Função para obter dados do usuário baseado no tipo
  const getUserDisplayData = () => {
    if (userType === 'visitante') {
      return {
        title: 'VISITANTE',
        subtitle: 'Navegando como convidado',
        info: 'Acesso limitado'
      };
    }
    
    if (userType === 'aluno' || userType === 'student') {
      return {
        title: user?.nome || 'Aluno',
        subtitle: user?.matricula ? `RA ${user.matricula}` : 'Estudante',
        info: user?.curso || 'Técnico em Desenvolvimento de Sistemas'
      };
    }
    
    if (userType === 'professor' || userType === 'teacher') {
      return {
        title: user?.nome || 'Professor',
        subtitle: user?.especialidade || 'Educador',
        info: user?.departamento || 'Departamento de TI'
      };
    }
    
    return {
      title: 'Usuário',
      subtitle: 'Sistema SENAI',
      info: ''
    };
  };

  const displayData = getUserDisplayData();

  return (
    <header className="bg-bg-layouts shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo - Clicável para todos os usuários */}
        <div className="flex items-center">
          <Link to={isAuthenticated ? "/app" : "/"} className="transform transition-transform duration-200 hover:scale-105">
            <img src={senailogo} alt="Logo SENAI" className="h-10 w-auto" />
          </Link>
        </div>        {/* Área do usuário */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            // Usuário autenticado
            <div className="flex items-center space-x-3">
              <Link to="/app/account" className="flex items-center space-x-2">
                <div className="text-right text-sm">
                  <div className="text-gray-600 text-xs uppercase">{displayData.title}</div>
                  <div className="text-gray-800 font-medium">{displayData.info}</div>
                  <div className="text-gray-600 text-xs">{displayData.subtitle}</div>
                </div>
                <div className="w-10 h-10 bg-button-primary rounded-full flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-800 transition-colors"
                title="Sair"
              >
                <LogIn size={16} className="rotate-180" />
              </button>
            </div>
          ) : (
            // Visitante
            <div className="flex items-center space-x-3">
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
