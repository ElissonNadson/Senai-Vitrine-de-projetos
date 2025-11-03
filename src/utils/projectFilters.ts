export interface ProjectFilters {
  searchTerm: string
  selectedCurso: string | null
  selectedCategoria: string | null
  selectedNivel: string | null
  selectedDestaques: string[]
  sortOrder: 'A-Z' | 'Z-A' | 'novos' | 'antigos' | 'mais-vistos'
}

export function applyProjectFilters(projects: any[], filters: ProjectFilters) {
  let filtered = [...projects]

  // Filtro de busca
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(project =>
      project.nome?.toLowerCase().includes(term) ||
      project.descricao?.toLowerCase().includes(term) ||
      project.curso?.toLowerCase().includes(term) ||
      project.categoria?.toLowerCase().includes(term)
    )
  }

  // Filtro de curso
  if (filters.selectedCurso) {
    filtered = filtered.filter(p => p.curso === filters.selectedCurso)
  }

  // Filtro de categoria
  if (filters.selectedCategoria) {
    filtered = filtered.filter(p => p.categoria === filters.selectedCategoria)
  }

  // Filtro de fase/nível
  if (filters.selectedNivel) {
    filtered = filtered.filter(p => p.faseAtual === parseInt(filters.selectedNivel))
  }

  // Filtro de destaques
  if (filters.selectedDestaques.length > 0) {
    filtered = filtered.filter(project => {
      return filters.selectedDestaques.every(destaque => {
        if (destaque === 'itinerario') return project.itinerario === true
        if (destaque === 'labMaker') return project.labMaker === true
        if (destaque === 'participouSaga') return project.participouSaga === true
        return false
      })
    })
  }

  // Ordenação
  switch (filters.sortOrder) {
    case 'A-Z':
      filtered.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''))
      break
    case 'Z-A':
      filtered.sort((a, b) => (b.nome || '').localeCompare(a.nome || ''))
      break
    case 'novos':
      filtered.sort((a, b) => new Date(b.criadoEm || 0).getTime() - new Date(a.criadoEm || 0).getTime())
      break
    case 'antigos':
      filtered.sort((a, b) => new Date(a.criadoEm || 0).getTime() - new Date(b.criadoEm || 0).getTime())
      break
    case 'mais-vistos':
      filtered.sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
      break
  }

  return filtered
}
