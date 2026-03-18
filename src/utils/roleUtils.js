export const ROLES = {
  ADMIN:   'ADMIN',
  STUDENT: 'STUDENT',
}

export const isAdmin   = (user) => user?.role === ROLES.ADMIN
export const isStudent = (user) => user?.role === ROLES.STUDENT

export const getDefaultRoute = (role) => {
  if (role === ROLES.ADMIN)   return '/admin-dashboard'
  if (role === ROLES.STUDENT) return '/student-dashboard'
  return '/login'
}

export const getRoleBadgeClass = (role) => {
  if (role === ROLES.ADMIN)   return 'badge-admin'
  if (role === ROLES.STUDENT) return 'badge-student'
  return 'badge'
}

export const getStatusBadgeClass = (status) => {
  const map = {
    APPLIED:     'badge-applied',
    SHORTLISTED: 'badge-shortlisted',
    SELECTED:    'badge-selected',
    REJECTED:    'badge-rejected',
  }
  return map[status] ?? 'badge'
}
