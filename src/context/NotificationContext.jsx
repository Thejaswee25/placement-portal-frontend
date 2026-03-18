import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMyApplicationsApi } from "../api/studentApi";
import { CheckCircle, Star, XCircle, Info, X } from "lucide-react";

const NotificationContext = createContext(null);

/* ── Single Toast ─────────────────────────────────────────────────────────── */
function Toast({ toast, onDismiss }) {
  const [out, setOut] = useState(false);

  const dismiss = useCallback(() => {
    setOut(true);
    setTimeout(() => onDismiss(toast.id), 220);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const t = setTimeout(dismiss, toast.duration ?? 7000);
    return () => clearTimeout(t);
  }, [dismiss]);

  const config =
    {
      selected: { Icon: CheckCircle, iconCls: "text-success-400", bar: "bg-success-500" },
      shortlisted: { Icon: Star, iconCls: "text-warning-400", bar: "bg-warning-500" },
      rejected: { Icon: XCircle, iconCls: "text-danger-400", bar: "bg-danger-500" },
      info: { Icon: Info, iconCls: "text-primary-400", bar: "bg-primary-500" },
    }[toast.type] ?? { Icon: Info, iconCls: "text-neutral-400", bar: "bg-neutral-500" };

  return (
    <div
      className="relative overflow-hidden flex items-start gap-3 p-4 rounded-xl
                 bg-neutral-900 text-white text-sm shadow-xl"
      style={{
        minWidth: 300,
        maxWidth: 380,
        animation: out
          ? "toastOut 0.22s ease forwards"
          : "toastIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      {/* Left colour bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.bar}`} />

      <config.Icon size={16} className={`flex-shrink-0 mt-0.5 ${config.iconCls}`} />

      <div className="flex-1 min-w-0 pl-1">
        <p className="font-semibold text-neutral-100 leading-snug">{toast.title}</p>

        {toast.message && (
          <p className="text-xs text-neutral-400 mt-0.5 leading-snug">{toast.message}</p>
        )}

        {toast.company && (
          <p className="text-xs text-neutral-500 mt-1 font-medium">{toast.company}</p>
        )}
      </div>

      <button
        onClick={dismiss}
        className="flex-shrink-0 text-neutral-500 hover:text-neutral-300 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Provider ─────────────────────────────────────────────────────────────── */
export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifList, setNotifList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const prevMap = useRef({}); // { applicationId: status }

  const { user } = useAuth();

  /* Add toast */
  const addToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random()}`;

    const entry = {
      id,
      ...toast,
      time: new Date(),
    };

    setToasts((prev) => [...prev, entry]);

    setNotifList((prev) => [entry, ...prev].slice(0, 50));

    setUnreadCount((c) => c + 1);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearUnread = useCallback(() => {
    setUnreadCount(0);
  }, []);

  /* ── Poll for status changes (students only) ───────── */
  useEffect(() => {
    if (user?.role !== "STUDENT") return;

    const seed = async () => {
      try {
        const { data } = await getMyApplicationsApi();

        data.forEach((a) => {
          prevMap.current[a.id] = a.status;
        });
      } catch {
        /* ignore */
      }
    };

    const poll = async () => {
      try {
        const { data } = await getMyApplicationsApi();

        data.forEach((a) => {
          const prev = prevMap.current[a.id];

          if (prev === undefined) {
            prevMap.current[a.id] = a.status;
            return;
          }

          if (prev === a.status) return;

          prevMap.current[a.id] = a.status;

          const messages = {
            SELECTED: {
              type: "selected",
              title: "Congratulations! You've been selected 🎉",
              message: `${a.companyName} has offered you the ${a.role} role.`,
              company: a.companyName,
              duration: 12000,
            },

            SHORTLISTED: {
              type: "shortlisted",
              title: "You've been shortlisted ⭐",
              message: `${a.companyName} has shortlisted you for ${a.role}.`,
              company: a.companyName,
              duration: 9000,
            },

            REJECTED: {
              type: "rejected",
              title: "Application not progressed",
              message: `Your application to ${a.companyName} for ${a.role} was not selected.`,
              company: a.companyName,
              duration: 8000,
            },
          };

          if (messages[a.status]) addToast(messages[a.status]);
        });
      } catch {
        /* silent */
      }
    };

    seed();

    const iv = setInterval(poll, 15000);

    return () => clearInterval(iv);
  }, [user, addToast]);

  const value = {
    addToast,
    removeToast,
    notifList,
    unreadCount,
    clearUnread,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}

      {/* Toast stack */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <Toast toast={t} onDismiss={removeToast} />
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes toastIn  {
          from { opacity:0; transform:translateY(-6px) scale(0.97) }
          to   { opacity:1; transform:translateY(0) scale(1) }
        }

        @keyframes toastOut {
          from { opacity:1; transform:translateY(0) }
          to   { opacity:0; transform:translateY(-4px) }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return ctx;
};