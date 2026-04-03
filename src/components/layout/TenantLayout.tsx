import { NavLink, Outlet } from 'react-router-dom'
import { Home, Receipt, Clipboard, Bell, DollarSign, Wrench, FileText } from 'lucide-react'

const navItems = [
  { to: '/tenant/home',        icon: Home,      label: 'Home' },
  { to: '/tenant/rent',        icon: Receipt,   label: 'Rent' },
  { to: '/tenant/pcr',         icon: Clipboard, label: 'Condition Reports' },
  { to: '/tenant/notices',     icon: Bell,      label: 'Notices' },
  { to: '/tenant/bond',        icon: DollarSign,label: 'Bond' },
  { to: '/tenant/maintenance', icon: Wrench,    label: 'Maintenance' },
  { to: '/tenant/documents',   icon: FileText,  label: 'Documents' },
]

export default function TenantLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        <div className="px-4 py-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Home size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">Tenant Portal</p>
              <p className="text-gray-400 text-[10px]">My Tenancy</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 mt-1">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider px-2 mb-1">My Account</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-700 mt-auto">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>
            <div>
              <p className="text-white text-xs font-medium">Michael Chen</p>
              <p className="text-gray-500 text-[10px]">Tenant</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
