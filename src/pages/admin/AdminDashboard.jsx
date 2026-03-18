import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getAllStudentsApi, getAllApplicationsApi, getAllInterviewsApi } from '../../api/adminApi'
import { getAllCompaniesApi } from '../../api/companyApi'
import { getStatusBadgeClass } from '../../utils/roleUtils'
import { Users, Building2, FileText, CalendarCheck } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  const c = {
    blue:   { bg: 'bg-primary-50',  icon: 'text-primary-600'  },
    violet: { bg: 'bg-violet-50',   icon: 'text-violet-600'   },
    amber:  { bg: 'bg-warning-50',  icon: 'text-warning-600'  },
    green:  { bg: 'bg-success-50',  icon: 'text-success-600'  },
  }[color] ?? { bg: 'bg-neutral-100', icon: 'text-neutral-600' }

  return (
    <div className="card flex items-center gap-4">
      <div className={`stat-icon ${c.bg}`}>
        <Icon size={18} className={c.icon} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-neutral-900">{value ?? 0}</p>
        <p className="text-xs text-neutral-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [students,  setStudents]  = useState([])
  const [companies, setCompanies] = useState([])
  const [apps,      setApps]      = useState([])
  const [ivs,       setIvs]       = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([getAllStudentsApi(), getAllCompaniesApi(), getAllApplicationsApi(), getAllInterviewsApi()])
      .then(([s, c, a, i]) => {
        setStudents(s.data); setCompanies(c.data); setApps(a.data); setIvs(i.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statusCount = s => apps.filter(a => a.status === s).length

  return (
    <DashboardLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : <>
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Users}         label="Students"     value={students.length}   color="blue"   />
          <StatCard icon={Building2}     label="Job Drives"   value={companies.length}  color="violet" />
          <StatCard icon={FileText}      label="Applications" value={apps.length}       color="amber"  />
          <StatCard icon={CalendarCheck} label="Interviews"   value={ivs.length}        color="green"  />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
          {/* Status breakdown */}
          <div className="card">
            <p className="section-heading mb-4">Application Breakdown</p>
            <div className="space-y-3">
              {[
                { s: 'APPLIED',     label: 'Applied',     color: '#0c7eff', bg: '#f0f7ff' },
                { s: 'SHORTLISTED', label: 'Shortlisted', color: '#f59e0b', bg: '#fffbeb' },
                { s: 'SELECTED',    label: 'Selected',    color: '#22c55e', bg: '#f0fdf4' },
                { s: 'REJECTED',    label: 'Rejected',    color: '#f43f5e', bg: '#fff1f2' },
              ].map(({ s, label, color, bg }) => {
                const count = statusCount(s)
                const pct   = apps.length > 0 ? Math.round((count / apps.length) * 100) : 0
                return (
                  <div key={s}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-neutral-700">{label}</span>
                      <span className="text-neutral-500">{count} · {pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: bg }}>
                      <div className="h-full rounded-full transition-all duration-500"
                           style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent applications */}
          <div className="card xl:col-span-2">
            <p className="section-heading mb-3">Recent Applications</p>
            {apps.length === 0 ? (
              <p className="text-xs text-neutral-400 py-6 text-center">No applications yet.</p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {apps.slice(0, 7).map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{a.studentName}</p>
                      <p className="text-xs text-neutral-500">{a.companyName} · {a.role}</p>
                    </div>
                    <span className={getStatusBadgeClass(a.status)}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Companies */}
        {companies.length > 0 && (
          <div className="card">
            <p className="section-heading mb-3">Active Drives</p>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
              {companies.slice(0, 4).map(c => (
                <div key={c.id} className="p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <p className="text-sm font-semibold text-neutral-900 truncate">{c.companyName}</p>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">{c.role}</p>
                  <p className="text-xs font-medium text-neutral-700 mt-2">{c.packageOffered} LPA · {c.location || 'Remote'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </>}
    </DashboardLayout>
  )
}
