import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'

// Auth pages
import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import Profile          from './pages/student/Profile'
import Jobs             from './pages/student/Jobs'
import Applications     from './pages/student/Applications'
import Interviews       from './pages/student/Interviews'

// Admin pages
import AdminDashboard      from './pages/admin/AdminDashboard'
import ManageStudents      from './pages/admin/ManageStudents'
import ManageCompanies     from './pages/admin/ManageCompanies'
import ReviewApplications  from './pages/admin/ReviewApplications'
import ScheduleInterview   from './pages/admin/ScheduleInterview'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login"    element={<Login />}    />
      <Route path="/register" element={<Register />} />

      {/* Student-protected routes */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route path="/student-dashboard"    element={<StudentDashboard />} />
        <Route path="/student/profile"      element={<Profile />}          />
        <Route path="/student/jobs"         element={<Jobs />}             />
        <Route path="/student/applications" element={<Applications />}     />
        <Route path="/student/interviews"   element={<Interviews />}       />
      </Route>

      {/* Admin-protected routes */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin-dashboard"   element={<AdminDashboard />}     />
        <Route path="/admin/students"    element={<ManageStudents />}     />
        <Route path="/admin/companies"   element={<ManageCompanies />}    />
        <Route path="/admin/applications" element={<ReviewApplications />} />
        <Route path="/admin/interviews"  element={<ScheduleInterview />}  />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
