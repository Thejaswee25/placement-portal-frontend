import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getAllApplicationsApi, getAllInterviewsApi, scheduleInterviewApi } from '../../api/adminApi'
import { CalendarCheck, Plus, X, Clock, MapPin, Monitor, Building2, Search, AlertCircle, CheckCircle } from 'lucide-react'

const EMPTY = { applicationId: '', interviewDate: '', interviewTime: '', mode: 'ONLINE', location: '' }

export default function ScheduleInterview() {
  const [interviews, setInterviews] = useState([])
  const [apps,       setApps]       = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(EMPTY)
  const [saving,     setSaving]     = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')
  const [search,     setSearch]     = useState('')

  const fetchAll = async () => {
    try {
      const [iRes, aRes] = await Promise.all([getAllInterviewsApi(), getAllApplicationsApi()])
      setInterviews(iRes.data)
      setApps(aRes.data.filter(a => a.status !== 'REJECTED'))
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSchedule = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!form.applicationId) { setError('Please select an application.'); return }
    if (!form.interviewDate)  { setError('Please select a date.'); return }
    if (!form.interviewTime)  { setError('Please select a time.'); return }

    setSaving(true)
    try {
      // Ensure time is HH:mm:ss for Java LocalTime
      const timeParts = form.interviewTime.split(':')
      const time = timeParts.length === 2 ? `${form.interviewTime}:00` : form.interviewTime

      await scheduleInterviewApi({
        applicationId: parseInt(form.applicationId),
        interviewDate: form.interviewDate,
        interviewTime: time,
        mode:     form.mode,
        location: form.location || (form.mode === 'ONLINE' ? 'Link to be shared' : 'TBD'),
      })

      setSuccess('Interview scheduled!')
      setTimeout(() => {
        setForm(EMPTY); setShowForm(false); setSuccess('')
        fetchAll()
      }, 1200)
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? `Error: ${err.message}`
      setError(msg)
    } finally { setSaving(false) }
  }

  const filtered = interviews.filter(iv => {
    const name    = iv.application?.student?.user?.name    ?? ''
    const company = iv.application?.company?.companyName   ?? ''
    return name.toLowerCase().includes(search.toLowerCase()) ||
           company.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <DashboardLayout title="Interview Schedule">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
                   placeholder="Search student or company…" className="input pl-8 w-48 text-xs" />
          </div>
          <span className="text-xs text-neutral-400">{filtered.length} scheduled</span>
        </div>
        <button onClick={() => { setForm(EMPTY); setError(''); setSuccess(''); setShowForm(true) }}
                className="btn-primary text-xs">
          <Plus size={13} /> Schedule Interview
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md border border-neutral-200 shadow-xl animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <p className="font-semibold text-neutral-900">Schedule Interview</p>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5 rounded-lg"><X size={15} /></button>
            </div>

            <form onSubmit={handleSchedule} className="p-5 space-y-4">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-xs font-medium">
                  <AlertCircle size={13} />{error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-success-50 border border-success-200 text-success-700 text-xs font-semibold">
                  <CheckCircle size={13} />{success}
                </div>
              )}

              {/* Application */}
              <div>
                <label className="label">Application *</label>
                <select name="applicationId" value={form.applicationId} onChange={set}
                        className="input text-xs" required>
                  <option value="">Select student → company…</option>
                  {apps.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.studentName} → {a.companyName} ({a.role}) — {a.status}
                    </option>
                  ))}
                </select>
                {apps.length === 0 && (
                  <p className="text-[11px] text-neutral-400 mt-1">No eligible applications. Applications must not be rejected.</p>
                )}
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date *</label>
                  <div className="relative">
                    <CalendarCheck size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input name="interviewDate" type="date" value={form.interviewDate} onChange={set}
                           className="input pl-8 text-xs" required
                           min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div>
                  <label className="label">Time *</label>
                  <div className="relative">
                    <Clock size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input name="interviewTime" type="time" value={form.interviewTime} onChange={set}
                           className="input pl-8 text-xs" required />
                  </div>
                </div>
              </div>

              {/* Mode */}
              <div>
                <label className="label">Mode</label>
                <div className="flex gap-2">
                  {[
                    { val: 'ONLINE',  icon: Monitor,   label: 'Online'  },
                    { val: 'OFFLINE', icon: Building2,  label: 'Offline' },
                  ].map(({ val, icon: Icon, label }) => (
                    <label key={val}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors text-xs font-medium
                        ${form.mode === val
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'}`}>
                      <input type="radio" name="mode" value={val} checked={form.mode === val}
                             onChange={set} className="sr-only" />
                      <Icon size={13} /> {label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="label">{form.mode === 'ONLINE' ? 'Meeting Link' : 'Venue'}</label>
                <div className="relative">
                  <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input name="location" value={form.location} onChange={set}
                         placeholder={form.mode === 'ONLINE' ? 'https://meet.google.com/…' : 'Hall 3, Main Building'}
                         className="input pl-8 text-xs" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-xs py-1.5">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-xs py-1.5">
                  {saving
                    ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Scheduling…</span>
                    : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <CalendarCheck size={32} className="mx-auto mb-2 opacity-25" />
          <p className="text-sm font-medium">No interviews scheduled</p>
          <p className="text-xs mt-1">Click "Schedule Interview" to add one.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead>
              <tr><th>Student</th><th>Company</th><th>Date</th><th>Time</th><th>Mode</th><th>Location</th></tr>
            </thead>
            <tbody>
              {filtered.map(iv => (
                <tr key={iv.id}>
                  <td className="font-medium text-neutral-800 text-sm">
                    {iv.application?.student?.user?.name ?? '—'}
                  </td>
                  <td className="text-neutral-600 text-sm">
                    {iv.application?.company?.companyName ?? '—'}
                  </td>
                  <td className="text-neutral-700 text-sm">{iv.interviewDate}</td>
                  <td className="font-mono text-sm text-neutral-600">{iv.interviewTime?.substring(0, 5)}</td>
                  <td>
                    <span className={`badge ${iv.mode === 'ONLINE'
                      ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200/60'
                      : 'bg-warning-50 text-warning-700 ring-1 ring-warning-200/60'}`}>
                      {iv.mode === 'ONLINE' ? <Monitor size={10} /> : <Building2 size={10} />}
                      {iv.mode}
                    </span>
                  </td>
                  <td className="text-xs text-neutral-500 max-w-[160px] truncate">
                    {iv.location ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
