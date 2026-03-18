import { GraduationCap, Award, FileText } from 'lucide-react'

export default function StudentCard({ student, onClick }) {
  return (
    <div onClick={onClick}
         className="card-hover cursor-pointer flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700 flex-shrink-0">
          {student.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-neutral-900 text-sm truncate">{student.name}</p>
          <p className="text-xs text-neutral-500 truncate">{student.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-neutral-500">
        {student.branch && <span className="flex items-center gap-1"><GraduationCap size={11} />{student.branch}</span>}
        {student.cgpa != null && <span className="flex items-center gap-1"><Award size={11} />CGPA {student.cgpa}</span>}
      </div>
      {student.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {student.skills.slice(0,4).map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded text-[11px] bg-neutral-100 text-neutral-600 font-medium">{s}</span>
          ))}
          {student.skills.length > 4 && <span className="text-[11px] text-neutral-400">+{student.skills.length - 4}</span>}
        </div>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
        <span className="text-neutral-400">{student.graduationYear ?? '—'}</span>
        {student.resumeUrl
          ? <span className="flex items-center gap-1 text-success-600 font-medium"><FileText size={11} />Resume</span>
          : <span className="text-neutral-300">No resume</span>}
      </div>
    </div>
  )
}
