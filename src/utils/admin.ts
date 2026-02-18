/**
 * Lista de emails com privilégio de admin (fallback quando tipo != 'ADMIN' no banco)
 * Centraliza a lógica para evitar duplicação em RoleGuard, Sidebar, etc.
 */
const ADMIN_EMAILS: string[] = [
  'nadsonnodachi@gmail.com',
  'admin@admin.com',
  'senaifeira@senaifeira',
]

/**
 * Verifica se um usuário é admin — pelo tipo OU pelo email hardcoded
 */
export function isAdminUser(user: { tipo?: string; email?: string } | null | undefined): boolean {
  if (!user) return false
  if (user.tipo?.toUpperCase() === 'ADMIN') return true
  return ADMIN_EMAILS.includes(user.email || '')
}
