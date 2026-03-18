import { useState, useEffect } from 'react'
import { X, Download, FileText } from 'lucide-react'
import { getToken } from '../utils/tokenUtils'

export default function ResumeViewer({ studentId, studentName, onClose }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const BASE = "https://placement-portal-backend-cjgw.onrender.com"

const src = `${BASE}/api/admin/student/${studentId}/resume`

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const token = getToken()
        const res = await fetch(
          `${BASE}/api/admin/student/${studentId}/resume`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        if (!res.ok) throw new Error()

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)

        setPdfUrl(url)
      } catch (err) {
        console.error("PDF LOAD ERROR:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchPdf()

    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [studentId])

  const handleDownload = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = `${studentName}_resume.pdf`
    a.click()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3>{studentName}</h3>
          <div className="flex gap-2">
            <button onClick={handleDownload}>Download</button>
            <button onClick={onClose}><X /></button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1">
          {loading && <p className="text-center mt-10">Loading...</p>}

          {error && <p className="text-center mt-10">Failed to load PDF</p>}

          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Resume"
            />
          )}
        </div>
      </div>
    </div>
  )
}
