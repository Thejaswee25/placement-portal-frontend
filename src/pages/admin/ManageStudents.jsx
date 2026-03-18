import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getAllStudentsApi, getStudentByIdApi } from '../../api/adminApi'
import { getToken } from '../../utils/tokenUtils'
import {
  Search, Users, X, GraduationCap, Award, Phone,
  Linkedin, Github, FileText, Download, ExternalLink, BookOpen,
} from 'lucide-react'

/* ── Student Modal ─────────────────────────────────────────────────────── */
function StudentModal({ student, onClose }) {
  const [dl, setDl] = useState(false)

  const handleDownload = async () => {
    if (!student.resumeUrl) return
    setDl(true)
    try {
      const token = getToken()
      const url   = `http://localhost:8080/api/admin/student/${student.id}/resume`
      const res   = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const a = Object.assign(document.createElement('a'), {
        href: URL.createObjectURL(blob),
        download: `${student.name}_resume.pdf`,
      })
      a.click(); URL.revokeObjectURL(a.href)
    } catch { alert('Resume not available.') }
    finally { setDl(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md border border-neutral-200 shadow-xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 text-sm">
              {student.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{student.name}</p>
              <p className="text-xs text-neutral-500">{student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg"><X size={15} /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Academic grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: GraduationCap, label: 'Branch',     val: student.branch          },
              { icon: Award,         label: 'CGPA',       val: student.cgpa            },
              { icon: BookOpen,      label: 'Grad Year',  val: student.graduationYear  },
              { icon: Phone,         label: 'Phone',      val: student.phone           },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="px-3 py-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-neutral-400" />
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide">{label}</span>
                </div>
                <p className="text-sm font-semibold text-neutral-800">{val ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 ring-1 ring-primary-200/60">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          {(student.linkedin || student.github) && (
            <div className="flex gap-2">
              {student.linkedin && (
                <a href={student.linkedin} target="_blank" rel="noreferrer"
                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                              bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors">
                  <Linkedin size={12} className="text-blue-500" /> LinkedIn
                  <ExternalLink size={10} className="text-neutral-400" />
                </a>
              )}
              {student.github && (
                <a href={student.github} target="_blank" rel="noreferrer"
                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                              bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors">
                  <Github size={12} /> GitHub
                  <ExternalLink size={10} className="text-neutral-400" />
                </a>
              )}
            </div>
          )}

          {/* Resume */}
          {student.resumeUrl ? (
            <button onClick={handleDownload} disabled={dl}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200
                               bg-neutral-50 hover:bg-neutral-100 transition-colors text-left">
              <div className="w-8 h-8 rounded-lg bg-danger-50 border border-danger-100 flex items-center justify-center flex-shrink-0">
                <FileText size={14} className="text-danger-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-neutral-800 truncate">{student.name}_resume.pdf</p>
                <p className="text-[11px] text-neutral-500">Click to download</p>
              </div>
              {dl
                ? <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                : <Download size={13} className="text-neutral-400 flex-shrink-0" />
              }
            </button>
          ) : (
            <p className="text-xs text-neutral-400 text-center py-3 rounded-lg border border-dashed border-neutral-200">
              No resume uploaded
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function ManageStudents() {
  const [students, setStudents] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllStudentsApi().then(({ data }) => setStudents(data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.branch?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout title="Students">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Search by name, email or branch…" className="input pl-8 text-xs" />
        </div>
        <span className="text-xs text-neutral-400">{filtered.length} students</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <Users size={32} className="mx-auto mb-2 opacity-25" />
          <p className="text-sm font-medium">No students found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(s => (
            <div key={s.id} onClick={() => setSelected(s)}
                 className="card cursor-pointer hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0">
                  {s.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-neutral-900 text-sm truncate">{s.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{s.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-neutral-500 mb-3">
                {s.branch && <span className="flex items-center gap-1"><GraduationCap size={11} />{s.branch}</span>}
                {s.cgpa  != null && <span className="flex items-center gap-1"><Award size={11} />{s.cgpa}</span>}
              </div>
              {s.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {s.skills.slice(0,3).map(sk => (
                    <span key={sk} className="px-1.5 py-0.5 rounded text-[11px] bg-neutral-100 text-neutral-600 font-medium">{sk}</span>
                  ))}
                  {s.skills.length > 3 && <span className="text-[11px] text-neutral-400">+{s.skills.length-3}</span>}
                </div>
              )}
              <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 text-xs text-neutral-400">
                <span>{s.graduationYear ?? '—'}</span>
                {s.resumeUrl
                  ? <span className="text-success-600 font-medium flex items-center gap-1"><FileText size={10} />Resume</span>
                  : <span>No resume</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && <StudentModal student={selected} onClose={() => setSelected(null)} />}
    </DashboardLayout>
  )
}
