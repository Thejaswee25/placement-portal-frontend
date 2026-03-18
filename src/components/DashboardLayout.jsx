import Sidebar from './Sidebar'
import Navbar  from './Navbar'

export default function DashboardLayout({ title, children }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 p-5 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
