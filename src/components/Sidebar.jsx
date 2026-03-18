import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  LayoutDashboard, Users, Building2, FileText,
  CalendarCheck, LogOut, User, Briefcase, ClipboardList, GraduationCap,
} from 'lucide-react'

const ADMIN_LINKS = [
  { to: '/admin-dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/admin/students',     icon: Users,           label: 'Students'     },
  { to: '/admin/companies',    icon: Building2,       label: 'Companies'    },
  { to: '/admin/applications', icon: ClipboardList,   label: 'Applications' },
  { to: '/admin/interviews',   icon: CalendarCheck,   label: 'Interviews'   },
]

const STUDENT_LINKS = [
  { to: '/student-dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/student/profile',      icon: User,            label: 'Profile'      },
  { to: '/student/jobs',         icon: Briefcase,       label: 'Jobs'         },
  { to: '/student/applications', icon: FileText,        label: 'Applications' },
  { to: '/student/interviews',   icon: CalendarCheck,   label: 'Interviews'   },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const links   = user?.role === 'ADMIN' ? ADMIN_LINKS : STUDENT_LINKS
  const isAdmin = user?.role === 'ADMIN'

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-neutral-200 flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-neutral-100">
        <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={14} className="text-white" />
        </div>
        <span className="font-display font-bold text-neutral-900 text-base">
          Placement<span className="text-primary-600">Hub</span>
        </span>
      </div>

      {/* Role pill */}
      <div className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold
          ${isAdmin ? 'bg-violet-50 text-violet-700' : 'bg-primary-50 text-primary-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-violet-500' : 'bg-primary-500'}`} />
          {user?.role}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to.endsWith('dashboard')}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={15} className="flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-neutral-100 p-3">
        <div className="flex items-center gap-2.5 px-1 mb-2">
          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-neutral-800 truncate">{user?.name}</p>
            <p className="text-[11px] text-neutral-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="nav-link w-full text-danger-600 hover:text-danger-700 hover:bg-danger-50"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
