import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X, Compass } from 'lucide-react'
import ClientSidebar from './ClientSidebar'

export default function ClientLayout() {
  const location = useLocation()
  const isDashboard = location.pathname === '/client/dashboard'
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5F0' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <ClientSidebar />
      </div>

      {/* Mobile top bar */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ height: 56, backgroundColor: '#FFFFFF', borderBottom: '1px solid #EDEAE3' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: '#1B4332' }}>
            <Compass size={14} color="white" />
          </div>
          <span className="font-display" style={{ fontSize: '0.9rem', color: '#1B4332' }}>Boussole Climat</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
          {mobileOpen ? <X size={22} color="#2A2A28" /> : <Menu size={22} color="#2A2A28" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setMobileOpen(false)} />
          <div className="md:hidden fixed left-0 top-0 bottom-0 z-50 animate-slide-in-right" style={{ width: 264 }}>
            <ClientSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      <main
        className="min-h-screen"
        style={{ marginLeft: 'var(--sidebar-width)' }}
      >
        <div
          className="mx-auto"
          style={{
            maxWidth: isDashboard ? 1100 : 800,
            padding: isDashboard ? '40px 48px' : '48px 40px',
          }}
        >
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (max-width: 767px) {
          main {
            margin-left: 0 !important;
            padding-top: 56px !important;
          }
          main > div {
            padding: 20px 16px !important;
          }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .md\\:hidden .animate-slide-in-right {
          animation: slideInLeft 0.25s ease-out;
        }
      `}</style>
    </div>
  )
}
