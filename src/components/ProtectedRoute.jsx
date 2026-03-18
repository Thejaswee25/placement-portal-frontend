import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles  – e.g. ['ADMIN'] or ['STUDENT']
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user, token } = useAuth()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the user's own dashboard if they try to access the wrong role's area
    const fallback = user.role === 'ADMIN' ? '/admin-dashboard' : '/student-dashboard'
    return <Navigate to={fallback} replace />
  }

  return <Outlet />
}
