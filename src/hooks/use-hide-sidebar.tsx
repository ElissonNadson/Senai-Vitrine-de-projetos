import { useLocation } from 'react-router-dom'

export const useHideSidebar = () => {
  const location = useLocation()
  // Suporta ambas as rotas: /aluno e /docente
  const hiddenPatterns = ['/aluno/account', '/docente/account']
  return hiddenPatterns.some(pattern => location.pathname.startsWith(pattern))
}
