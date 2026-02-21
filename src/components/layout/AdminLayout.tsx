import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileSearch, BarChart3, Settings, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', path: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Diagnostics', path: '/admin/diagnostics', icon: FileSearch },
  { label: 'Statistiques', path: '/admin/stats', icon: BarChart3 },
  { label: 'Paramètres', path: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path: string, end?: boolean) {
    if (end) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-fond)' }}>
      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 bottom-0 flex flex-col overflow-y-auto"
        style={{ width: 'var(--sidebar-width)', backgroundColor: '#1A1A2E' }}
      >
        {/* Logo */}
        <div className="px-5 pt-5 pb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: '#1B5E3B' }}>
              C
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Boussole Climat</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path, item.end)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(27, 94, 59, 0.3)' : 'transparent',
                  color: active ? '#93C5A0' : 'rgba(255,255,255,0.6)',
                  fontWeight: active ? 600 : 400,
                }}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 pb-5 space-y-3">
          <div className="h-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#2D7A50', color: 'white' }}>
              CL
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Claire Lefèvre</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Analyste</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg w-full transition-colors"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1" style={{ marginLeft: 'var(--sidebar-width)' }}>
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
