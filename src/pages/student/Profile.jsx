import { useState, useEffect, useRef } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getProfileApi, updateProfileApi, uploadResumeApi } from '../../api/studentApi'
import { Upload, Plus, X, CheckCircle } from 'lucide-react'

/* 🔥 FIX: moved outside component */
function Field({ label, name, type = 'text', placeholder, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input"
      />
    </div>
  )
}

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [skillInput, setSkillInput] = useState('')
  const fileRef = useRef()

  const [form, setForm] = useState({
    branch: '',
    cgpa: '',
    graduationYear: '',
    phone: '',
    linkedin: '',
    github: '',
    skills: [],
  })

  useEffect(() => {
    getProfileApi()
      .then(({ data }) => {
        setProfile(data)
        setForm({
          branch: data.branch ?? '',
          cgpa: data.cgpa ?? '',
          graduationYear: data.graduationYear ?? '',
          phone: data.phone ?? '',
          linkedin: data.linkedin ?? '',
          github: data.github ?? '',
          skills: data.skills ?? [],
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  /* 🔥 FIX: renamed + stable */
  const handleChange = (e) =>
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }))
    }
    setSkillInput('')
  }

  const removeSkill = (s) =>
    setForm((f) => ({
      ...f,
      skills: f.skills.filter((x) => x !== s),
    }))

  const showMsg = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: '', text: '' }), 3500)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data } = await updateProfileApi({
        ...form,
        cgpa: parseFloat(form.cgpa) || null,
        graduationYear: parseInt(form.graduationYear) || null,
      })
      setProfile(data)
      showMsg('success', 'Profile saved.')
    } catch (err) {
      showMsg('error', err.response?.data?.message ?? 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      showMsg('error', 'Only PDF files are allowed.')
      return
    }

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)

    try {
      const { data } = await uploadResumeApi(fd)
      setProfile((p) => ({ ...p, resumeUrl: data.resumeUrl }))
      showMsg('success', 'Resume uploaded.')
    } catch (err) {
      showMsg('error', err.response?.data?.error ?? 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Profile">
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="card mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{profile?.name}</p>
              <p className="text-xs text-neutral-500">{profile?.email}</p>
              {profile?.resumeUrl && (
                <span className="inline-flex items-center gap-1 text-[11px] text-success-600 font-medium mt-0.5">
                  <CheckCircle size={10} /> Resume uploaded
                </span>
              )}
            </div>
          </div>

          <div>
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploading}
              className="btn-secondary text-xs py-1.5"
            >
              <Upload size={12} />
              {uploading
                ? 'Uploading…'
                : profile?.resumeUrl
                ? 'Replace Resume'
                : 'Upload Resume'}
            </button>
          </div>
        </div>

        {/* Alert */}
        {msg.text && (
          <div className={`mb-4 px-3 py-2.5 rounded-lg text-xs font-medium ${
            msg.type === 'success'
              ? 'bg-success-50 border border-success-200 text-success-700'
              : 'bg-danger-50 border border-danger-200 text-danger-700'
          }`}>
            {msg.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="card space-y-4">
          <p className="section-heading">Academic Details</p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Branch" name="branch" value={form.branch} onChange={handleChange} />
            <Field label="CGPA" name="cgpa" type="number" value={form.cgpa} onChange={handleChange} />
            <Field label="Graduation Year" name="graduationYear" type="number" value={form.graduationYear} onChange={handleChange} />
            <Field label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <hr className="border-neutral-100" />

          <p className="section-heading">Links</p>

          <div className="grid gap-3">
            <Field label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} />
            <Field label="GitHub URL" name="github" value={form.github} onChange={handleChange} />
          </div>

          <hr className="border-neutral-100" />

          <p className="section-heading">Skills</p>

          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill and press Enter"
              className="input flex-1 text-xs"
            />
            <button type="button" onClick={addSkill} className="btn-secondary px-2.5 py-2">
              <Plus size={14} />
            </button>
          </div>

          {form.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.skills.map((s) => (
                <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-primary-50 text-primary-700">
                  {s}
                  <button type="button" onClick={() => removeSkill(s)}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-primary text-xs">
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
