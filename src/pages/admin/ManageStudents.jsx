import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getAllStudentsApi } from '../../api/adminApi'
import {
  Search, Users, X, GraduationCap, Award, Phone,
  Linkedin, Github, FileText, Download, ExternalLink, BookOpen,
} from 'lucide-react'

/* ── Student Modal ─────────────────────────────────────────────────────── */
function StudentModal({ student, onClose }) {
  const [dl, setDl] = useState(false)

  const handleDownload = () => {
    if (!student.resumeUrl) {
      alert("Resume not available")
      return
    }

    window.open(student.resumeUrl, "_blank")
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

          {/* Academic */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: GraduationCap, label: 'Branch', val: student.branch },
              { icon: Award, label: 'CGPA', val: student.cgpa },
              { icon: BookOpen, label: 'Grad Year', val: student.graduationYear },
              { icon: Phone, label: 'Phone', val: student.phone },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="px-3 py-2.5 rounded-lg bg-neutral-50 border">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={11} className="text-neutral-400" />
                  <span className="text-[10px] text-neutral-400 uppercase">{label}</span>
                </div>
                <p className="text-sm font-semibold">{val ?? '—'}</p>
              </div>
            ))}
          </div>

          {/* Skills */}
          {student.skills?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-neutral-500 mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded text-xs bg-primary-50 text-primary-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resume */}
          {student.resumeUrl ? (
            <button
              onClick={handleDownload}
              className="w-full flex items-center gap-3 p-3 rounded-lg border bg-neutral-50 hover:bg-neutral-100"
            >
              <FileText size={14} className="text-danger-500" />
              <div className="flex-1">
                <p className="text-xs font-semibold">{student.name}_resume.pdf</p>
                <p className="text-[11px] text-neutral-500">Click to open</p>
              </div>
              <Download size={13} />
            </button>
          ) : (
            <p className="text-xs text-neutral-400 text-center py-3 border border-dashed">
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
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllStudentsApi()
      .then(({ data }) => {
        console.log("STUDENTS:", data)
        setStudents(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.branch?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout title="Students">
      <div className="flex items-center gap-3 mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="input text-xs"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(s => (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              className="card cursor-pointer"
            >
              <p className="font-semibold">{s.name}</p>
              <p className="text-xs text-neutral-500">{s.email}</p>

              {/* ✅ FIXED RESUME BUTTON */}
              {s.resumeUrl && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log("Opening:", s.resumeUrl)
                    window.open(s.resumeUrl, "_blank")
                  }}
                  className="text-green-600 text-xs mt-2"
                >
                  View Resume
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <StudentModal
          student={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </DashboardLayout>
  )
}
