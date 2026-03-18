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

  // ✅ FIXED: direct open
  const handleDownload = () => {
    if (!profile?.resumeUrl) {
      alert("Resume not available")
      return
    }

    console.log("Opening resume:", profile.resumeUrl)
    window.open(profile.resumeUrl, "_blank")
  }

  if (!app) return null

  const canAct = app.status !== 'SELECTED' && app.status !== 'REJECTED'

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-sm bg-white border-l shadow-xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <p className="font-semibold">{app.studentName}</p>
            <p className="text-xs text-neutral-500">{app.studentEmail}</p>
          </div>
          <button onClick={onClose}><X size={15} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-20">Loading...</div>
          ) : !profile ? (
            <div className="text-center py-16">Profile not found.</div>
          ) : (
            <div className="p-5 space-y-5">

              {/* Info */}
              <div>
                <p className="font-semibold">{profile.name}</p>
                <p className="text-xs text-neutral-500">{profile.email}</p>
              </div>

              {/* Resume */}
              <div>
                <p className="text-xs font-semibold mb-2">Resume</p>

                {profile.resumeUrl ? (
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center gap-3 p-3 border rounded-lg bg-neutral-50 hover:bg-neutral-100"
                  >
                    <FileText size={14} />
                    <span className="text-xs">{profile.name}_resume.pdf</span>
                    <Download size={13} />
                  </button>
                ) : (
                  <p className="text-xs text-neutral-400">No resume uploaded</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          {canAct && (
            <div className="flex gap-2">
              <button onClick={() => onAction(app.id, 'shortlist')} className="flex-1 bg-yellow-100 text-xs py-2">
                Shortlist
              </button>
              <button onClick={() => onAction(app.id, 'reject')} className="flex-1 bg-red-100 text-xs py-2">
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

  const doAction = async (id, action) => {
    try {
      let data
      if (action === 'shortlist') ({ data } = await shortlistApplicationApi(id))
      else if (action === 'reject') ({ data } = await rejectApplicationApi(id))
      else if (action === 'select') ({ data } = await selectApplicationApi(id))

      setApps(prev =>
        prev.map(a => a.id === id ? { ...a, status: data.status } : a)
      )
    } catch {
      alert("Action failed")
    }
  }

  return (
    <DashboardLayout title="Applications">
      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <table className="w-full">
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
          onAction={doAction}
        />
      )}
    </DashboardLayout>
  )
}
