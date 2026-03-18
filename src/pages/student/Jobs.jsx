import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/DashboardLayout'
import JobCard from '../../components/JobCard'
import { getJobsApi, applyToJobApi, getMyApplicationsApi, getProfileApi } from '../../api/studentApi'
import { Search, Info } from 'lucide-react'

export default function Jobs() {
  const [jobs,     setJobs]     = useState([])
  const [applied,  setApplied]  = useState(new Set())
  const [cgpa,     setCgpa]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [applying, setApplying] = useState(null)
  const [search,   setSearch]   = useState('')
  const [showAll,  setShowAll]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    Promise.allSettled([getJobsApi(), getMyApplicationsApi(), getProfileApi()])
      .then(([j, a, p]) => {
        if (j.status === 'fulfilled') setJobs(j.value.data)
        if (a.status === 'fulfilled') setApplied(new Set(a.value.data.map(x => x.companyId)))
        if (p.status === 'fulfilled') setCgpa(p.value.data?.cgpa ?? null)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleApply = async (jobId) => {
    setApplying(jobId); setError('')
    try { await applyToJobApi(jobId); setApplied(prev => new Set([...prev, jobId])) }
    catch (err) { setError(err.response?.data?.message ?? 'Failed to apply.') }
    finally { setApplying(null) }
  }

  const isEligible = j => cgpa === null || !j.cgpaCriteria || cgpa >= j.cgpaCriteria

  const bySearch  = jobs.filter(j =>
    j.companyName.toLowerCase().includes(search.toLowerCase()) ||
    j.role.toLowerCase().includes(search.toLowerCase()) ||
    (j.location ?? '').toLowerCase().includes(search.toLowerCase())
  )
  const displayed  = showAll ? bySearch : bySearch.filter(isEligible)
  const hiddenCount = bySearch.length - bySearch.filter(isEligible).length

  return (
    <DashboardLayout title="Available Jobs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
                 placeholder="Search company, role, location…" className="input pl-8 text-xs" />
        </div>

        {cgpa !== null && (
          <button onClick={() => setShowAll(v => !v)}
                  className={`btn-secondary text-xs py-1.5 ${showAll ? '' : 'border-primary-200 text-primary-700 bg-primary-50'}`}>
            {showAll ? 'Show eligible only' : `Showing eligible (CGPA ${cgpa})`}
          </button>
        )}

        <span className="text-xs text-neutral-400 ml-auto">{displayed.length} drives</span>
      </div>

      {/* No profile warning */}
      {cgpa === null && !loading && (
        <div className="mb-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-warning-50 border border-warning-200 text-warning-700 text-xs">
          <Info size={13} className="flex-shrink-0 mt-0.5" />
          Add your CGPA in your profile to see only eligible drives.
        </div>
      )}

      {error && (
        <div className="mb-4 px-3 py-2.5 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-xs font-medium">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-neutral-400">
          <p className="text-sm font-medium">No job drives found</p>
          {!showAll && hiddenCount > 0 && (
            <button onClick={() => setShowAll(true)} className="mt-2 text-xs text-primary-600 hover:underline">
              Show {hiddenCount} hidden drives (CGPA too low)
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {displayed.map(job => (
              <JobCard key={job.id} company={job}
                applied={applied.has(job.id)} loading={applying === job.id}
                onApply={handleApply} disabled={showAll && !isEligible(job)} />
            ))}
          </div>
          {!showAll && hiddenCount > 0 && (
            <button onClick={() => setShowAll(true)}
                    className="mt-4 w-full py-2 rounded-lg border border-dashed border-neutral-300
                               text-xs text-neutral-500 hover:bg-neutral-50 transition-colors">
              + Show {hiddenCount} more drive{hiddenCount > 1 ? 's' : ''} (below your CGPA)
            </button>
          )}
        </>
      )}
    </DashboardLayout>
  )
}
