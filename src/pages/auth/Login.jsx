import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login, loading, error, clearError } = useAuth()
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [showPw,  setShowPw]  = useState(false)
  const [localErr, setLocalErr] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalErr(''); clearError()
    if (!email || !pass) { setLocalErr('Please enter email and password.'); return }
    try { await login(email, pass) } catch (err) { setLocalErr(err.message) }
  }

  const displayErr = localErr || error

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-600 mb-4">
            <GraduationCap size={20} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-neutral-900">PlacementHub</h1>
          <p className="text-sm text-neutral-500 mt-1">College Placement Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
          <h2 className="font-semibold text-neutral-900 mb-1">Sign in</h2>
          <p className="text-xs text-neutral-500 mb-5">Enter your credentials to continue</p>

          {displayErr && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-xs font-medium">
              {displayErr}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                       placeholder="you@college.edu" className="input pl-8" required />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type={showPw ? 'text' : 'password'} value={pass}
                       onChange={e => setPass(e.target.value)}
                       placeholder="••••••••" className="input pl-8 pr-9" required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-1">
              {loading
                ? <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</span>
                : 'Sign in'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-700">Demo admin: </span>
            admin@college.com · admin123
          </div>
        </div>

        <p className="text-center mt-4 text-xs text-neutral-500">
          New student?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  )
}
