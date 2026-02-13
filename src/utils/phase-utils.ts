/**
 * Utilitários para manipulação de fases de projetos
 */

/**
 * Normaliza uma string removendo acentos e convertendo para maiúsculas
 * @param str - String a ser normalizada
 * @returns String normalizada sem acentos e em maiúsculas
 */
export function normalizeString(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

/**
 * Mapeia o nome da fase (da API ou do frontend) para um número
 * @param fase - Nome da fase (pode ter acentos, maiúsculas/minúsculas)
 * @returns Número da fase (1-4)
 */
export function mapFaseToNumber(fase: string): number {
  const faseNormalizada = normalizeString(fase)
  const faseMap: Record<string, number> = {
    IDEACAO: 1,
    PLANEJAMENTO: 2,
    EXECUCAO: 3,
    FINALIZACAO: 4,
    MODELAGEM: 2,
    PROTOTIPAGEM: 3,
    IMPLEMENTACAO: 4,
  }
  return faseMap[faseNormalizada] || 1
}

/**
 * Mapeia o nome da fase do frontend para o nome usado na API/banco de dados
 * @param faseName - Nome da fase do frontend (ex: "Ideação", "Implementação")
 * @returns Nome da fase no formato da API (ex: "IDEACAO", "IMPLEMENTACAO")
 */
export function mapFaseNameToAPI(faseName: string): string {
  const faseNormalizada = normalizeString(faseName)
  const faseMap: Record<string, string> = {
    IDEACAO: 'IDEACAO',
    MODELAGEM: 'MODELAGEM',
    PROTOTIPAGEM: 'PROTOTIPAGEM',
    IMPLEMENTACAO: 'IMPLEMENTACAO',
  }
  return faseMap[faseNormalizada] || faseNormalizada
}

/**
 * Mapeia o nome da fase do frontend para a chave usada no objeto status_fases
 * @param faseName - Nome da fase do frontend (ex: "Ideação", "Implementação")
 * @returns Chave da fase no objeto status_fases (ex: "ideacao", "implementacao")
 */
export function mapFaseNameToStatusKey(faseName: string): string {
  const faseMap: Record<string, string> = {
    Ideação: 'ideacao',
    Modelagem: 'modelagem',
    Prototipagem: 'prototipagem',
    Implementação: 'implementacao',
  }
  return faseMap[faseName] || faseName.toLowerCase()
}

