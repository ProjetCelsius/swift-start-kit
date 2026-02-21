import { Outlet, useLocation } from 'react-router-dom'
import ClientSidebar from './ClientSidebar'

export default function ClientLayout() {
  const location = useLocation()
  const isDashboard = location.pathname === '/client/dashboard'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5F0' }}>
      <ClientSidebar />
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
    </div>
  )
}
