import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNotifications } from '../context/NotificationContext'
import { Bell, X, CheckCircle, Star, XCircle, Info } from 'lucide-react'

const TYPE_META = {
  selected:    { Icon: CheckCircle, cls: 'text-success-500' },
  shortlisted: { Icon: Star,        cls: 'text-warning-500' },
  rejected:    { Icon: XCircle,     cls: 'text-danger-500'  },
  info:        { Icon: Info,        cls: 'text-primary-500' },
}

function NotifDropdown({ notifList, onClose }) {
  return (
    <div
      className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl border border-neutral-200
                 shadow-xl z-50 overflow-hidden animate-slide-up"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
        <p className="text-sm font-semibold text-neutral-800">Notifications</p>
        <button onClick={onClose} className="btn-ghost p-1 rounded-md"><X size={13} /></button>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-neutral-50">
        {notifList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-neutral-400 gap-2">
            <Bell size={22} className="opacity-30" />
            <p className="text-xs">No notifications yet</p>
          </div>
        ) : notifList.map(n => {
          const meta = TYPE_META[n.type] ?? TYPE_META.info
          return (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors">
              <meta.Icon size={14} className={`${meta.cls} mt-0.5 flex-shrink-0`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-800 leading-snug">{n.title}</p>
                {n.message && <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{n.message}</p>}
                <p className="text-[10px] text-neutral-300 mt-1">
                  {n.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Navbar({ title }) {
  const { user } = useAuth()
  const { unreadCount, notifList, clearUnread } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref  = useRef()

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleOpen = () => {
    setOpen(v => !v)
    if (!open) clearUnread()
  }

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-30">
      <h1 className="font-display font-semibold text-neutral-900 text-base">{title}</h1>

      <div className="flex items-center gap-2">
        {/* Notifications — only show for students */}
        {user?.role === 'STUDENT' && (
          <div className="relative" ref={ref}>
            <button
              onClick={handleOpen}
              className="relative btn-ghost p-2 rounded-lg"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-danger-500
                                 flex items-center justify-center text-white text-[9px] font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {open && <NotifDropdown notifList={notifList} onClose={() => setOpen(false)} />}
          </div>
        )}

        <div className="w-px h-5 bg-neutral-200 mx-1" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-neutral-800 leading-none">{user?.name}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
