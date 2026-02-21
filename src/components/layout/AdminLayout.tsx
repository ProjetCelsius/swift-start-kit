import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, FileText, BarChart3, PlusCircle, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Diagnostics', path: '/admin/dashboard', icon: FileText },
  { label: 'Statistiques', path: '/admin/stats', icon: BarChart3 },
  { label: 'Nouveau diagnostic', path: '/admin/nouveau', icon: PlusCircle },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  function isActive(path: string, end?: boolean) {
    if (end) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F7F5F0' }}>
      {/* Sidebar */}
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 240,
        backgroundColor: '#0F2620', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, backgroundColor: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '0.8rem', color: '#0F2620',
            }}>BC</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: '0.95rem', color: '#E8F0EB' }}>
                Boussole Climat
              </span>
              <span style={{
                padding: '2px 8px', borderRadius: 20, fontSize: '0.6rem',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
                backgroundColor: '#1B4332', color: '#fff',
              }}>Admin</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item.path, item.end)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 16px', borderRadius: 8, textDecoration: 'none',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '0.85rem',
                  backgroundColor: active ? '#1B4332' : 'transparent',
                  color: active ? '#fff' : '#E8F0EB',
                  fontWeight: active ? 500 : 400,
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                <item.icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom user */}
        <div style={{ padding: '0 16px 20px' }}>
          <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 16 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', backgroundColor: '#1B4332',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem', fontWeight: 600, color: '#fff', fontFamily: 'DM Sans, sans-serif',
            }}>CD</div>
            <div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: '#E8F0EB', fontWeight: 500 }}>Claire Dubois</p>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.65rem', color: '#7A766D' }}>Analyste senior</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
              border: 'none', background: 'none', cursor: 'pointer', borderRadius: 8,
              fontFamily: 'DM Sans, sans-serif', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)',
              width: '100%', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, marginLeft: 240, overflowY: 'auto' }}>
        <div style={{ maxWidth: 1100, padding: '32px 40px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
