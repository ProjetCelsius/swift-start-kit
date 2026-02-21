import { Outlet } from 'react-router-dom'
import ClientSidebar from './ClientSidebar'

export default function ClientLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-fond)' }}>
      <ClientSidebar />
      <main
        className="min-h-screen"
        style={{ marginLeft: 'var(--sidebar-width)' }}
      >
        <div className="max-w-[800px] mx-auto px-10 py-12">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
