import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import {
  getAllApplicationsApi, shortlistApplicationApi,
  rejectApplicationApi, selectApplicationApi, getStudentByIdApi,
} from '../../api/adminApi'
import { getStatusBadgeClass } from '../../utils/roleUtils'
import {
  FileText, Check, X, Star, Search, GraduationCap,
  Phone, Linkedin, Github, Download, ChevronRight, ExternalLink, Award, BookOpen,
} from 'lucide-react'

/* ── Student side panel ─────────────────────────────────────────────────── */
function StudentPanel({ app, onClose, onAction, acting }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!app) return
    setLoading(true)
    setProfile(null)

    getStudentByIdApi(app.studentId)
      .then(({ data }) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [app?.studentId])

  // ✅ FIXED HERE — original file 1 logic preserved
  // ✅ FIXED — opens resume in new tab (no download)
  const handleDownload = () => {
    if (!profile?.resumeUrl) {
      alert('Resume not available.')
      return
    }
    console.log("Opening:", profile.resumeUrl)
    window.open(profile.resumeUrl, "_blank")
  }

  if (!app) return null

  const canAct = app.status !== 'SELECTED' && app.status !== 'REJECTED'

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div
        className="fixed right-0 top-0 h-full z-50 w-full max-w-sm bg-white
                   border-l border-neutral-200 shadow-xl flex flex-col"
        style={{ animation: 'slideInRight 0.25s cubic-bezier(0.16,1,0.3,1) forwards' }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
          <div>
            <p className="font-semibold text-neutral-900">{app.studentName}</p>
            <p className="text-xs text-neutral-500">{app.studentEmail}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={15} />
          </button>
        </div>

        {/* Application context — from file 2's CSS */}
        <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100 flex-shrink-0">
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Applying for</p>
          <p className="text-sm font-semibold text-neutral-800">{app.companyName}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-neutral-500">{app.role}</span>
            <span className="text-neutral-300">·</span>
            <span className={getStatusBadgeClass(app.status)}>{app.status}</span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !profile ? (
            <div className="text-center py-16 text-neutral-400 text-xs">
              Profile not found.
            </div>
          ) : (
            <div className="px-5 py-4 space-y-5">

              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                  {profile.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{profile.name}</p>
                  <p className="text-xs text-neutral-500">{profile.email}</p>
                </div>
              </div>

              {/* Academic */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: GraduationCap, label: 'Branch',    val: profile.branch         },
                  { icon: Award,         label: 'CGPA',      val: profile.cgpa           },
                  { icon: BookOpen,      label: 'Grad Year', val: profile.graduationYear },
                  { icon: Phone,         label: 'Phone',     val: profile.phone          },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center gap-1 mb-1">
                      <Icon size={10} className="text-neutral-400" />
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">
                        {label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {val ?? '—'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Skills — from file 2's CSS */}
              {profile.skills?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-neutral-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 ring-1 ring-primary-200/60">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links — from file 2's CSS */}
              {(profile.linkedin || profile.github) && (
                <div className="flex gap-2">
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                  bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors">
                      <Linkedin size={11} className="text-blue-500" />LinkedIn
                      <ExternalLink size={10} className="text-neutral-400" />
                    </a>
                  )}
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noreferrer"
                       className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                                  bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors">
                      <Github size={11} />GitHub
                      <ExternalLink size={10} className="text-neutral-400" />
                    </a>
                  )}
                </div>
              )}

              {/* Resume */}
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-2">Resume</p>

                {profile.resumeUrl ? (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200
                               bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-danger-50 border border-danger-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={13} className="text-danger-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 truncate">
                        {profile.name}_resume.pdf
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Click to open
                      </p>
                    </div>

                    <Download size={13} className="text-neutral-400 flex-shrink-0" />
                  </button>
                ) : (
                  <p className="text-xs text-neutral-400 text-center py-3 border border-dashed rounded-lg border-neutral-200">
                    No resume uploaded
                  </p>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Footer — from file 2's CSS */}
        <div className="flex-shrink-0 border-t border-neutral-100 px-5 py-4 bg-neutral-50">
          {canAct ? (
            <div className="flex gap-2">
              {app.status !== 'SHORTLISTED' && (
                <button onClick={() => onAction(app.id, 'shortlist')} disabled={acting === app.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold
                                   bg-warning-50 text-warning-700 border border-warning-200 hover:bg-warning-100 transition-colors">
                  <Star size={12} /> Shortlist
                </button>
              )}
              {app.status === 'SHORTLISTED' && (
                <button onClick={() => onAction(app.id, 'select')} disabled={acting === app.id}
                        className="btn-success flex-1 text-xs py-2">
                  <Check size={12} /> Select
                </button>
              )}
              <button onClick={() => onAction(app.id, 'reject')} disabled={acting === app.id}
                      className="btn-danger flex-1 text-xs py-2">
                <X size={12} /> Reject
              </button>
            </div>
          ) : (
            <p className={`text-center text-xs font-semibold py-2
              ${app.status === 'SELECTED' ? 'text-success-700' : 'text-danger-700'}`}>
              {app.status === 'SELECTED' ? '✓ Student selected' : '✗ Application rejected'}
            </p>
          )}
        </div>

      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%) }
          to   { transform: translateX(0)    }
        }
      `}</style>
    </>
  )
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function ReviewApplications() {
  const [apps,     setApps]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [filter,   setFilter]   = useState('ALL')
  const [search,   setSearch]   = useState('')
  const [acting,   setActing]   = useState(null)
  const [selected, setSelected] = useState(null)

  const fetchApps = () =>
    getAllApplicationsApi()
      .then(({ data }) => setApps(data))
      .catch(console.error)
      .finally(() => setLoading(false))

  useEffect(() => { fetchApps() }, [])

  const doAction = async (id, action) => {
    setActing(id)
    try {
      let data
      if (action === 'shortlist') ({ data } = await shortlistApplicationApi(id))
      else if (action === 'reject')   ({ data } = await rejectApplicationApi(id))
      else if (action === 'select')   ({ data } = await selectApplicationApi(id))
      setApps(prev => prev.map(a => a.id === id ? { ...a, status: data.status } : a))
      setSelected(prev => prev?.id === id ? { ...prev, status: data.status } : prev)
    } catch (err) { alert(err.response?.data?.message ?? 'Action failed.') }
    finally { setActing(null) }
  }

  const STATUSES = ['ALL', 'APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED']
  const filtered = apps
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a =>
      a.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      a.companyName?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <DashboardLayout title="Applications">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student or company…"
            className="input pl-8 w-48 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                      ${filter === s
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}>
              {s} <span className="ml-1 opacity-60">{s === 'ALL' ? apps.length : apps.filter(a => a.status === s).length}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-neutral-400 mb-3 flex items-center gap-1">
        <ChevronRight size={11} /> Click any row to view student details and make a decision
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <FileText size={28} className="mx-auto mb-2 opacity-25" />
          <p className="text-sm font-medium">No applications found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table-base">
            <thead>
              <tr>
                <th>Student</th><th>Branch</th><th>CGPA</th>
                <th>Company</th><th>Role</th><th>Date</th>
                <th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} onClick={() => setSelected(app)} className="cursor-pointer"
                    style={selected?.id === app.id ? { background: '#f0f7ff' } : {}}>

                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0">
                        {app.studentName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 text-sm flex items-center gap-1">
                          {app.studentName}
                          <ChevronRight size={11} className="text-neutral-300" />
                        </p>
                        <p className="text-[11px] text-neutral-400">{app.studentEmail}</p>
                      </div>
                    </div>
                  </td>

                  <td className="text-xs text-neutral-600">{app.branch ?? '—'}</td>
                  <td><span className="font-mono text-sm font-semibold text-neutral-800">{app.cgpa ?? '—'}</span></td>
                  <td className="font-medium text-neutral-800 text-sm">{app.companyName}</td>
                  <td className="text-xs text-neutral-600">{app.role}</td>
                  <td className="text-[11px] text-neutral-400">{app.appliedDate}</td>
                  <td><span className={getStatusBadgeClass(app.status)}>{app.status}</span></td>

                  <td onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-1">
                      {app.status !== 'SHORTLISTED' && app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                        <button onClick={() => doAction(app.id, 'shortlist')} disabled={acting === app.id} title="Shortlist"
                                className="w-6 h-6 rounded-md flex items-center justify-center bg-warning-50 text-warning-600 hover:bg-warning-100 transition-colors">
                          <Star size={11} />
                        </button>
                      )}
                      {app.status === 'SHORTLISTED' && (
                        <button onClick={() => doAction(app.id, 'select')} disabled={acting === app.id} title="Select"
                                className="w-6 h-6 rounded-md flex items-center justify-center bg-success-50 text-success-600 hover:bg-success-100 transition-colors">
                          <Check size={11} />
                        </button>
                      )}
                      {app.status !== 'REJECTED' && app.status !== 'SELECTED' && (
                        <button onClick={() => doAction(app.id, 'reject')} disabled={acting === app.id} title="Reject"
                                className="w-6 h-6 rounded-md flex items-center justify-center bg-danger-50 text-danger-500 hover:bg-danger-100 transition-colors">
                          <X size={11} />
                        </button>
                      )}
                      {(app.status === 'SELECTED' || app.status === 'REJECTED') && (
                        <span className="text-[11px] text-neutral-400 italic">Done</span>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <StudentPanel
          app={selected}
          onClose={() => setSelected(null)}
          onAction={doAction}
          acting={acting}
        />
      )}

    </DashboardLayout>
  )
}
