import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getAllStudentsApi } from '../../api/adminApi'
import { getToken } from '../../utils/tokenUtils'
import {
  Search, Users, X, GraduationCap, Award, Phone,
  Linkedin, Github, FileText, Download, ExternalLink, BookOpen,
} from 'lucide-react'

const BASE = "https://placement-portal-backend-cjgw.onrender.com"

/* ── Student Modal ───────────────── */
function StudentModal({ student, onClose }) {
  const [dl, setDl] = useState(false)

  const handleDownload = async () => {
    if (!student?.id) return

    setDl(true)
    try {
      const token = getToken()
      const res = await fetch(`${BASE}/api/admin/student/${student.id}/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error(`Status ${res.status}`)

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${student.name}_resume.pdf`
      a.click()

      URL.revokeObjectURL(url)

    } catch (err) {
      console.error(err)
      alert('Resume not available.')
    } finally {
      setDl(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden">

        <div className="flex justify-between p-4 border-b">
          <div>
            <p className="font-semibold">{student.name}</p>
            <p className="text-xs text-gray-500">{student.email}</p>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-4 space-y-4">

          <div className="grid grid-cols-2 gap-2">
            <Info icon={GraduationCap} label="Branch" val={student.branch} />
            <Info icon={Award} label="CGPA" val={student.cgpa} />
            <Info icon={BookOpen} label="Year" val={student.graduationYear} />
            <Info icon={Phone} label="Phone" val={student.phone} />
          </div>

          {/* Resume ALWAYS available via backend */}
          <button onClick={handleDownload} disabled={dl}
            className="w-full flex items-center gap-3 p-3 border rounded-lg">

            <FileText size={14} />
            <div className="flex-1">
              <p className="text-sm font-semibold">{student.name}_resume.pdf</p>
              <p className="text-xs text-gray-500">Download</p>
            </div>

            {dl ? "..." : <Download size={14} />}
          </button>

        </div>
      </div>
    </div>
  )
}

const Info = ({ icon: Icon, label, val }) => (
  <div className="p-2 border rounded">
    <div className="flex items-center gap-1 text-xs text-gray-400">
      <Icon size={10} /> {label}
    </div>
    <p className="text-sm font-semibold">{val ?? '—'}</p>
  </div>
)

/* ── Page ───────────────── */
export default function ManageStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllStudentsApi()
      .then(({ data }) => setStudents(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout title="Students">

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />

      {loading ? "Loading..." : (
        <div>
          {filtered.map(s => (
            <div key={s.id} onClick={() => setSelected(s)}>
              {s.name}
            </div>
          ))}
        </div>
      )}

      {selected && <StudentModal student={selected} onClose={() => setSelected(null)} />}
    </DashboardLayout>
  )
}
