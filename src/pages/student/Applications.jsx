import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getMyApplicationsApi } from '../../api/studentApi'
import { getStatusBadgeClass } from '../../utils/roleUtils'

export default function Applications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    getMyApplicationsApi().then(({ data }) => setApps(data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const STATUSES = ['ALL','APPLIED','SHORTLISTED','SELECTED','REJECTED']
  const filtered  = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  return (
    <DashboardLayout title="My Applications">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {STATUSES.map(s => {
          const cnt = s === 'ALL' ? apps.length : apps.filter(a => a.status === s).length
          return (
            <button key={s} onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                      ${filter === s ? 'bg-primary-600 text-white' : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              {s} <span className="ml-1 opacity-70">{cnt}</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-sm font-medium">No applications found</p>
          <p className="text-xs mt-1">Browse job drives and start applying.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead><tr><th>Company</th><th>Role</th><th>Applied On</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="font-medium text-neutral-900">{a.companyName}</td>
                  <td className="text-neutral-600">{a.role}</td>
                  <td className="text-neutral-500 text-xs">{a.appliedDate}</td>
                  <td><span className={getStatusBadgeClass(a.status)}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
