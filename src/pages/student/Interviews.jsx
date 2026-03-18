import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getMyInterviewsApi } from '../../api/studentApi'
import { CalendarCheck, Clock, MapPin, Monitor, Building2 } from 'lucide-react'

export default function Interviews() {
  const [interviews, setInterviews] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    getMyInterviewsApi()
      .then(({ data }) => setInterviews(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="My Interviews">
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <CalendarCheck size={32} className="mx-auto mb-2 opacity-25" />
          <p className="text-sm font-medium">No interviews scheduled</p>
          <p className="text-xs mt-1">Interviews will appear here once the admin schedules them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {interviews.map(iv => {
            const isOnline = iv.mode === 'ONLINE'
            return (
              <div key={iv.id} className="card flex flex-col gap-3">
                {/* Mode badge */}
                <div className="flex items-center justify-between">
                  <span className={`badge ${isOnline
                    ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200/60'
                    : 'bg-warning-50 text-warning-700 ring-1 ring-warning-200/60'}`}>
                    {isOnline ? <Monitor size={10} /> : <Building2 size={10} />}
                    {iv.mode}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                    <CalendarCheck size={13} className="text-primary-600" />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <p className="font-semibold text-neutral-900 text-sm">
                    {iv.application?.company?.companyName ?? 'Interview'}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {iv.application?.company?.role ?? ''}
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-neutral-500">
                  <span className="flex items-center gap-2">
                    <CalendarCheck size={11} className="flex-shrink-0 text-neutral-400" />
                    {iv.interviewDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={11} className="flex-shrink-0 text-neutral-400" />
                    {iv.interviewTime?.substring(0, 5)}
                  </span>
                  {iv.location && (
                    <span className="flex items-center gap-2">
                      <MapPin size={11} className="flex-shrink-0 text-neutral-400" />
                      <span className="truncate">{iv.location}</span>
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
