import { Building2, MapPin, Calendar, GraduationCap, CheckCircle, Lock, IndianRupee } from 'lucide-react'

export default function JobCard({ company, onApply, applied = false, loading = false, disabled = false }) {
  const deadline = company.applicationDeadline
    ? new Date(company.applicationDeadline).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
    : 'Open'
  const isPast = company.applicationDeadline ? new Date(company.applicationDeadline) < new Date() : false
  const isDisabled = disabled || isPast

  return (
    <div className={`card-hover flex flex-col gap-3 ${isDisabled ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center flex-shrink-0">
            <Building2 size={16} className="text-primary-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-neutral-900 text-sm truncate">{company.companyName}</p>
            <p className="text-xs text-neutral-500 truncate">{company.role}</p>
          </div>
        </div>
        <span className={`badge flex-shrink-0 ${isPast ? 'bg-neutral-100 text-neutral-500' : 'bg-success-50 text-success-700 ring-1 ring-success-200/60'}`}>
          {isPast ? 'Closed' : 'Open'}
        </span>
      </div>

      {/* Package */}
      <div className="flex items-center gap-1 text-neutral-900">
        <IndianRupee size={14} className="text-neutral-500" />
        <span className="font-bold text-base">{company.packageOffered}</span>
        <span className="text-xs text-neutral-500 font-medium">LPA</span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-1.5 text-xs text-neutral-500">
        <span className="flex items-center gap-1.5"><MapPin size={11} className="flex-shrink-0" />{company.location || 'Remote'}</span>
        <span className="flex items-center gap-1.5"><GraduationCap size={11} className="flex-shrink-0" />CGPA ≥ {company.cgpaCriteria ?? 'Any'}</span>
        <span className="flex items-center gap-1.5 col-span-2"><Calendar size={11} className="flex-shrink-0" />Deadline: {deadline}</span>
      </div>

      {/* Branches */}
      {company.eligibleBranches && (
        <div className="flex flex-wrap gap-1">
          {company.eligibleBranches.split(',').map(b => (
            <span key={b.trim()} className="px-1.5 py-0.5 rounded text-[11px] font-medium bg-neutral-100 text-neutral-600">
              {b.trim()}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-auto pt-1">
        {applied ? (
          <span className="flex items-center gap-1.5 text-success-600 text-xs font-semibold">
            <CheckCircle size={13} /> Applied
          </span>
        ) : disabled ? (
          <span className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium">
            <Lock size={12} /> CGPA {company.cgpaCriteria} required
          </span>
        ) : (
          <button onClick={() => onApply && onApply(company.id)} disabled={loading || isDisabled}
                  className="btn-primary w-full text-xs py-1.5">
            {loading
              ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Applying…</span>
              : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  )
}
