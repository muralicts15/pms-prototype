import { NavLink, Outlet } from 'react-router-dom'
import { Home, FileText, MessageSquare, Search, Building2, ScrollText, DollarSign, Clipboard, Receipt, Users } from 'lucide-react'

const navItems = [
  { to: '/agent/properties',   icon: Building2,     label: 'Properties' },
  { to: '/agent/enquiries',    icon: MessageSquare, label: 'Enquiries' },
  { to: '/agent/applications', icon: FileText,      label: 'Applications' },
  { to: '/agent/leases',       icon: ScrollText,    label: 'Leases' },
  { to: '/agent/bonds',        icon: DollarSign,    label: 'Bonds' },
  { to: '/agent/pcr',          icon: Clipboard,     label: 'PCR' },
  { to: '/agent/rent',         icon: Receipt,       label: 'Rent' },
]

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-gray-900 flex flex-col flex-shrink-0">
        <div className="px-4 py-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <Home size={14} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold leading-tight">PMS</p>
              <p className="text-gray-400 text-[10px]">Property Management</p>
            </div>
          </div>
        </div>

        <div className="px-3 py-2 mt-1">
          <p className="text-gray-500 text-[10px] uppercase tracking-wider px-2 mb-1">Agent Portal</p>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-700 mt-auto">
          <NavLink
            to="/public/search"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Search size={16} />
            Public Portal
          </NavLink>
          <NavLink
            to="/tenant/home"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Users size={16} />
            Tenant Portal
          </NavLink>
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
            <div>
              <p className="text-white text-xs font-medium">Sarah Mitchell</p>
              <p className="text-gray-500 text-[10px]">Agent</p>
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
