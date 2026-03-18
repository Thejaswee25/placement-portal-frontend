import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import { getAllCompaniesApi, addCompanyApi, deleteCompanyApi } from '../../api/companyApi'
import { Building2, Plus, Trash2, X, MapPin, Calendar, GraduationCap, IndianRupee, AlertCircle } from 'lucide-react'

const EMPTY = {
  companyName: '', role: '', packageOffered: '', location: '',
  cgpaCriteria: '', eligibleBranches: '', applicationDeadline: '',
}

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(EMPTY)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  const load = () =>
    getAllCompaniesApi().then(({ data }) => setCompanies(data)).catch(console.error).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.companyName || !form.role || !form.packageOffered) {
      setError('Company name, role and package are required.'); return
    }
    setSaving(true); setError('')
    try {
      await addCompanyApi({
        ...form,
        packageOffered:      parseFloat(form.packageOffered),
        cgpaCriteria:        form.cgpaCriteria ? parseFloat(form.cgpaCriteria) : null,
        applicationDeadline: form.applicationDeadline || null,
      })
      await load(); setForm(EMPTY); setShowForm(false)
    } catch (err) { setError(err.response?.data?.message ?? 'Failed to add company.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this drive?')) return
    try { await deleteCompanyApi(id); setCompanies(c => c.filter(x => x.id !== id)) }
    catch { alert('Delete failed.') }
  }

  return (
    <DashboardLayout title="Companies">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-neutral-500">{companies.length} active drives</span>
        <button onClick={() => { setForm(EMPTY); setError(''); setShowForm(true) }} className="btn-primary text-xs">
          <Plus size={13} /> Add Drive
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg border border-neutral-200 shadow-xl animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <p className="font-semibold text-neutral-900">Add Job Drive</p>
              <button onClick={() => setShowForm(false)} className="btn-ghost p-1.5 rounded-lg"><X size={15} /></button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-xs font-medium">
                  <AlertCircle size={13} /> {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Company Name *</label>
                  <input name="companyName" value={form.companyName} onChange={set} placeholder="Google" className="input text-xs" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="label">Role *</label>
                  <input name="role" value={form.role} onChange={set} placeholder="Software Engineer" className="input text-xs" required />
                </div>
                <div>
                  <label className="label">Package (LPA) *</label>
                  <input name="packageOffered" type="number" step="0.1" value={form.packageOffered} onChange={set} placeholder="12.5" className="input text-xs" required />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input name="location" value={form.location} onChange={set} placeholder="Bangalore" className="input text-xs" />
                </div>
                <div>
                  <label className="label">Min CGPA</label>
                  <input name="cgpaCriteria" type="number" step="0.01" value={form.cgpaCriteria} onChange={set} placeholder="7.5" className="input text-xs" />
                </div>
                <div>
                  <label className="label">Deadline</label>
                  <input name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={set} className="input text-xs" />
                </div>
              </div>
              <div>
                <label className="label">Eligible Branches (comma-separated)</label>
                <input name="eligibleBranches" value={form.eligibleBranches} onChange={set} placeholder="CSE, ECE, IT" className="input text-xs" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-xs py-1.5">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary text-xs py-1.5">
                  {saving ? 'Saving…' : 'Add Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <Building2 size={32} className="mx-auto mb-2 opacity-25" />
          <p className="text-sm font-medium">No job drives yet</p>
          <p className="text-xs mt-1">Click "Add Drive" to create the first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {companies.map(c => {
            const isPast = c.applicationDeadline && new Date(c.applicationDeadline) < new Date()
            return (
              <div key={c.id} className="card group flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={16} className="text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-neutral-900 text-sm truncate">{c.companyName}</p>
                      <p className="text-xs text-neutral-500 truncate">{c.role}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(c.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-danger-50 text-neutral-300 hover:text-danger-500 transition-all flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <IndianRupee size={13} className="text-neutral-500" />
                  <span className="font-bold text-neutral-900">{c.packageOffered}</span>
                  <span className="text-xs text-neutral-500">LPA</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5"><MapPin size={10} className="flex-shrink-0" />{c.location || 'Remote'}</span>
                  <span className="flex items-center gap-1.5"><GraduationCap size={10} className="flex-shrink-0" />CGPA ≥ {c.cgpaCriteria ?? 'Any'}</span>
                  <span className="flex items-center gap-1.5 col-span-2">
                    <Calendar size={10} className="flex-shrink-0" />
                    <span className={isPast ? 'text-danger-600 font-medium' : ''}>{c.applicationDeadline ?? 'Open'}</span>
                  </span>
                </div>

                {c.eligibleBranches && (
                  <div className="flex flex-wrap gap-1">
                    {c.eligibleBranches.split(',').map(b => (
                      <span key={b.trim()} className="px-1.5 py-0.5 rounded text-[11px] bg-neutral-100 text-neutral-600 font-medium">
                        {b.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-100">
                  <span className={`text-[11px] font-semibold ${isPast ? 'text-danger-600' : 'text-success-600'}`}>
                    {isPast ? '● Closed' : '● Open'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
