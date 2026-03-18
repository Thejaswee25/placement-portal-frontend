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

  // ✅ FIXED HERE
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div>
            <p className="font-semibold text-neutral-900">{app.studentName}</p>
            <p className="text-xs text-neutral-500">{app.studentEmail}</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X size={15} />
          </button>
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
                  { icon: GraduationCap, label: 'Branch', val: profile.branch },
                  { icon: Award, label: 'CGPA', val: profile.cgpa },
                  { icon: BookOpen, label: 'Grad Year', val: profile.graduationYear },
                  { icon: Phone, label: 'Phone', val: profile.phone },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                    <div className="flex items-center gap-1 mb-1">
                      <Icon size={10} className="text-neutral-400" />
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                        {label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-neutral-800">
                      {val ?? '—'}
                    </p>
                  </div>
                ))}
              </div>

              {/* Resume */}
              <div>
                <p className="text-xs font-semibold text-neutral-500 mb-2">Resume</p>

                {profile.resumeUrl ? (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200
                               bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-danger-50 border border-danger-100 flex items-center justify-center">
                      <FileText size={13} className="text-danger-500" />
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-semibold text-neutral-800">
                        {profile.name}_resume.pdf
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Click to open
                      </p>
                    </div>

                    <Download size={13} className="text-neutral-400" />
                  </button>
                ) : (
                  <p className="text-xs text-neutral-400 text-center py-3 border border-dashed rounded-lg">
                    No resume uploaded
                  </p>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 bg-neutral-50">
          {canAct && (
            <div className="flex gap-2">
              <button onClick={() => onAction(app.id, 'shortlist')} className="btn-secondary text-xs">
                Shortlist
              </button>
              <button onClick={() => onAction(app.id, 'reject')} className="btn-danger text-xs">
                Reject
              </button>
            </div>
          )}
        </div>

      </div>
    </>
  )
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function ReviewApplications() {
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllApplicationsApi()
      .then(({ data }) => setApps(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="Applications">
      {loading ? (
        <div className="text-center py-24">Loading...</div>
      ) : (
        <table className="table-base">
          <tbody>
            {apps.map(app => (
              <tr key={app.id} onClick={() => setSelected(app)} className="cursor-pointer">
                <td>{app.studentName}</td>
                <td>{app.companyName}</td>
                <td>{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <StudentPanel
          app={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </DashboardLayout>
  )
}
