import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import {
  getAllApplicationsApi,
  shortlistApplicationApi,
  rejectApplicationApi,
  selectApplicationApi,
  getStudentByIdApi,
} from '../../api/adminApi'
import { getToken } from '../../utils/tokenUtils'
import { FileText, Download, X } from 'lucide-react'

const BASE = "https://placement-portal-backend-cjgw.onrender.com"

function StudentPanel({ app, onClose }) {
  const [profile, setProfile] = useState(null)
  const [dl, setDl] = useState(false)

  useEffect(() => {
    getStudentByIdApi(app.studentId)
      .then(({ data }) => setProfile(data))
      .catch(console.error)
  }, [app.studentId])

  const handleDownload = async () => {
    if (!profile?.id) return

    setDl(true)
    try {
      const token = getToken()

      const res = await fetch(`${BASE}/api/admin/student/${profile.id}/resume`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error()

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `${profile.name}_resume.pdf`
      a.click()

      URL.revokeObjectURL(url)

    } catch {
      alert('Resume not available')
    } finally {
      setDl(false)
    }
  }

  if (!profile) return null

  return (
    <div className="fixed right-0 top-0 w-80 h-full bg-white shadow-lg p-4">
      <button onClick={onClose}><X /></button>

      <p>{profile.name}</p>

      <button onClick={handleDownload}>
        <FileText /> Resume {dl && "..."}
      </button>
    </div>
  )
}

export default function ReviewApplications() {
  const [apps, setApps] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getAllApplicationsApi()
      .then(({ data }) => setApps(data))
      .catch(console.error)
  }, [])

  return (
    <DashboardLayout title="Applications">

      {apps.map(app => (
        <div key={app.id} onClick={() => setSelected(app)}>
          {app.studentName} - {app.companyName}
        </div>
      ))}

      {selected && (
        <StudentPanel
          app={selected}
          onClose={() => setSelected(null)}
        />
      )}

    </DashboardLayout>
  )
}
