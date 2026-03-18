import { useState } from 'react'
import { X, Download, FileText } from 'lucide-react'
import { getToken } from '../utils/tokenUtils'

export default function ResumeViewer({ studentId, studentName, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  const token   = getToken()
  // We use an object tag to embed the PDF in-browser;
  // the browser fetches it with an Authorization header via a blob URL trick.
  const src = `http://localhost:8080/api/admin/student/${studentId}/resume`

  const handleDownload = async () => {
    try {
      const res = await fetch(src, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Not found')
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${studentName}_resume.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to download resume.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center">
              <FileText size={16} className="text-brand-600" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-slate-900">{studentName}</h3>
              <p className="text-xs text-slate-400">Resume / CV</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="btn-secondary text-xs py-1.5 px-3">
              <Download size={13} /> Download
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body — iframe with blob src */}
        <div className="flex-1 overflow-hidden bg-slate-100 min-h-[500px] flex items-center justify-center relative">
          {error ? (
            <div className="text-center text-slate-400 py-16">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Resume not available</p>
            </div>
          ) : (
            <iframe
              src={`${src}?token=${token}`}
              title="Resume"
              className="w-full h-full min-h-[500px]"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setError(true) }}
            />
          )}
          {loading && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
