import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/auth-context'
import { getBaseRoute } from '@/utils/routes'

/**
 * Redireciona para a página de criação em modo de edição.
 * A CreateProjectPage agora suporta editar projetos de qualquer status.
 */
const EditProjectPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const baseRoute = getBaseRoute(user?.tipo)

  useEffect(() => {
    if (projectId) {
      navigate(`${baseRoute}/criar-projeto?rascunho=${projectId}`, { replace: true })
    }
  }, [projectId, baseRoute, navigate])

  return null
}

export default EditProjectPage
