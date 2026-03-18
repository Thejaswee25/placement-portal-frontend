import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const { register, loading, error, clearError } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass,  setPass]  = useState('')
  const [conf,  setConf]  = useState('')
  const [showPw, setShowPw] = useState(false)
  const [localErr, setLocalErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErr(''); clearError()
    if (!name || !email || !pass || !conf) { setLocalErr('All fields are required.'); return }
    if (pass !== conf)  { setLocalErr('Passwords do not match.'); return }
    if (pass.length < 6){ setLocalErr('Password must be at least 6 characters.'); return }
    try { await register(name, email, pass) } catch (err) { setLocalErr(err.message) }
  }

  const displayErr = localErr || error

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-slide-up">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-600 mb-4">
            <GraduationCap size={20} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">PlacementHub</h1>
          <p className="text-sm text-neutral-500 mt-1">Student Registration</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <h2 className="font-semibold text-neutral-900 mb-1">Create account</h2>
          <p className="text-xs text-neutral-500 mb-5">Register as a student to access job drives</p>

          {displayErr && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-xs font-medium">
              {displayErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label:'Full Name', icon:User,  type:'text',     val:name,  set:setName,  ph:'John Doe'        },
              { label:'Email',     icon:Mail,  type:'email',    val:email, set:setEmail, ph:'you@college.edu' },
            ].map(({ label, icon:Icon, type, val, set, ph }) => (
              <div key={label}>
                <label className="label">{label}</label>
                <div className="relative">
                  <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type={type} value={val} onChange={e => set(e.target.value)}
                         placeholder={ph} className="input pl-8" required />
                </div>
              </div>
            ))}

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type={showPw ? 'text' : 'password'} value={pass}
                       onChange={e => setPass(e.target.value)} placeholder="Min. 6 characters"
                       className="input pl-8 pr-9" required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type={showPw ? 'text' : 'password'} value={conf}
                       onChange={e => setConf(e.target.value)} placeholder="Repeat password"
                       className="input pl-8" required />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</span>
                : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4 text-xs text-neutral-500">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
