import { useLocation } from 'react-router-dom'

export const useHideSidebar = () => {
  const location = useLocation()
  // Suporta ambas as rotas: /aluno e /professor
  const hiddenPatterns = ['/aluno/account', '/professor/account']
  return hiddenPatterns.some(pattern => location.pathname.startsWith(pattern))
}
