import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'
import { getMyApplicationsApi, getMyInterviewsApi, getJobsApi } from '../../api/studentApi'
import { getStatusBadgeClass } from '../../utils/roleUtils'
import { Briefcase, FileText, CalendarCheck, Star } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue:   { bg: 'bg-primary-50',  icon: 'text-primary-600',  val: 'text-primary-700'  },
    amber:  { bg: 'bg-warning-50',  icon: 'text-warning-600',  val: 'text-warning-700'  },
    green:  { bg: 'bg-success-50',  icon: 'text-success-600',  val: 'text-success-700'  },
    violet: { bg: 'bg-violet-50',   icon: 'text-violet-600',   val: 'text-violet-700'   },
  }
  const c = colors[color] ?? colors.blue
  return (
    <div className="card flex items-center gap-4">
      <div className={`stat-icon ${c.bg}`}>
        <Icon size={18} className={c.icon} />
      </div>
      <div>
        <p className={`text-2xl font-display font-bold ${c.val}`}>{value ?? 0}</p>
        <p className="text-xs text-neutral-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [apps,   setApps]   = useState([])
  const [ivs,    setIvs]    = useState([])
  const [jobs,   setJobs]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyApplicationsApi(), getMyInterviewsApi(), getJobsApi()])
      .then(([a, i, j]) => { setApps(a.data); setIvs(i.data); setJobs(j.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const selected    = apps.filter(a => a.status === 'SELECTED')
  const shortlisted = apps.filter(a => a.status === 'SHORTLISTED')

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-5">
        <h2 className="font-display font-bold text-xl text-neutral-900">
          Welcome back, {user?.name?.split(' ')[0]}
        </h2>
        <p className="text-sm text-neutral-500 mt-0.5">Here's an overview of your placement activity.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : <>
        {/* Selection banner */}
        {selected.length > 0 && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-success-50 border border-success-200">
            <span className="text-xl">🎉</span>
            <div>
              <p className="text-sm font-semibold text-success-800">Congratulations! You've been selected!</p>
              <p className="text-xs text-success-600 mt-0.5">
                {selected.map(a => `${a.companyName} — ${a.role}`).join(' · ')}
              </p>
            </div>
          </div>
        )}

        {/* Shortlisted banner */}
        {shortlisted.length > 0 && selected.length === 0 && (
          <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-xl bg-warning-50 border border-warning-200">
            <Star size={16} className="text-warning-600 flex-shrink-0" />
            <p className="text-sm font-medium text-warning-800">
              You've been shortlisted at <strong>{shortlisted.map(a => a.companyName).join(', ')}</strong>. Prepare for the next round!
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Briefcase}    label="Available Jobs"  value={jobs.length}            color="blue"   />
          <StatCard icon={FileText}     label="Applications"    value={apps.length}            color="violet" />
          <StatCard icon={Star}         label="Shortlisted"     value={shortlisted.length}     color="amber"  />
          <StatCard icon={CalendarCheck} label="Interviews"     value={ivs.length}             color="green"  />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Applications */}
          <div className="card">
            <p className="section-heading mb-3">Recent Applications</p>
            {apps.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <FileText size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">No applications yet. Browse jobs to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {apps.slice(0, 5).map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{a.companyName}</p>
                      <p className="text-xs text-neutral-500">{a.role}</p>
                    </div>
                    <span className={getStatusBadgeClass(a.status)}>{a.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interviews */}
          <div className="card">
            <p className="section-heading mb-3">Upcoming Interviews</p>
            {ivs.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <CalendarCheck size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs">No interviews scheduled yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {ivs.slice(0, 5).map(iv => (
                  <div key={iv.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium text-neutral-800">
                        {iv.application?.company?.companyName ?? 'Interview'}
                      </p>
                      <p className="text-xs text-neutral-500">{iv.interviewDate} · {iv.interviewTime?.substring(0,5)}</p>
                    </div>
                    <span className={`badge ${iv.mode === 'ONLINE' ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200/60' : 'bg-warning-50 text-warning-700 ring-1 ring-warning-200/60'}`}>
                      {iv.mode}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>}
    </DashboardLayout>
  )
}
