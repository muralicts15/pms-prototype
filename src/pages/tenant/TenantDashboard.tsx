import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, DollarSign, Clipboard, Bell, Wrench, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'

const LEASE = {
  propertyAddress: '12 Kings Park Rd, West Perth WA 6005',
  lessorName: 'Patricia Wong',
  portfolioManagerName: 'Sarah Mitchell',
  agentPhone: '0411 234 567',
  agentEmail: 's.mitchell@pms.com',
  leaseStart: '1 Oct 2025',
  leaseEnd: '30 May 2026',
  weeklyRent: 750,
  nextRentDue: '7 Apr 2026',
  nextRentAmount: 750,
  daysToLeaseEnd: 58,
}

const ALERTS = [
  { id: 1, type: 'warning', icon: Calendar, message: 'Lease ends in 58 days — 30 May 2026. Let your agent know if you wish to renew.', action: null },
  { id: 2, type: 'info',    icon: Clipboard, message: 'Quarterly PCR scheduled for 15 Apr 2026. The agent will inspect the property.', action: '/tenant/pcr' },
]

const QUICK_LINKS = [
  { label: 'Rent History',         icon: DollarSign, to: '/tenant/rent',        desc: 'View invoices and payment history' },
  { label: 'Condition Reports',    icon: Clipboard,  to: '/tenant/pcr',         desc: 'View and acknowledge PCRs' },
  { label: 'Notices',              icon: Bell,       to: '/tenant/notices',     desc: 'Form 19 inspections and other notices' },
  { label: 'Maintenance Request',  icon: Wrench,     to: '/tenant/maintenance', desc: 'Log a new maintenance issue' },
]

export default function TenantDashboard() {
  const navigate = useNavigate()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Welcome back, Michael</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's a summary of your tenancy.</p>
      </div>

      {/* Alerts */}
      {ALERTS.length > 0 && (
        <div className="space-y-2 mb-5">
          {ALERTS.map(alert => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm ${
                alert.type === 'warning'
                  ? 'bg-amber-50 border-amber-200 text-amber-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span className="flex-1">{alert.message}</span>
              {alert.action && (
                <button
                  className="text-xs font-semibold underline whitespace-nowrap"
                  onClick={() => navigate(alert.action!)}
                >
                  View
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Property card */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">{LEASE.propertyAddress}</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <MapPin size={13} />
              West Perth, WA 6005
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full">
            Active Lease
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Lease Period</p>
            <p className="font-medium text-gray-700">{LEASE.leaseStart} — {LEASE.leaseEnd}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Weekly Rent</p>
            <p className="font-medium text-gray-700">${LEASE.weeklyRent} / week</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Lessor / Owner</p>
            <p className="font-medium text-gray-700">{LEASE.lessorName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Property Manager</p>
            <p className="font-medium text-gray-700">{LEASE.portfolioManagerName}</p>
            <p className="text-xs text-gray-400">{LEASE.agentPhone}</p>
          </div>
        </div>
      </div>

      {/* Next rent due */}
      <div className="card p-4 mb-4 border-l-4 border-l-blue-400">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Next Rent Due</p>
            <p className="text-lg font-bold text-gray-900">${LEASE.nextRentAmount}</p>
            <p className="text-sm text-gray-500">Due {LEASE.nextRentDue}</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" />
            <span className="text-sm text-green-600 font-medium">Direct debit active</span>
          </div>
        </div>
        <button
          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          onClick={() => navigate('/tenant/rent')}
        >
          View payment history <ChevronRight size={14} />
        </button>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3">
        {QUICK_LINKS.map(link => (
          <button
            key={link.to}
            className="card p-4 text-left hover:shadow-md transition-shadow flex items-center gap-3"
            onClick={() => navigate(link.to)}
          >
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <link.icon size={17} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{link.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{link.desc}</p>
            </div>
            <ChevronRight size={14} className="text-gray-300 ml-auto" />
          </button>
        ))}
      </div>
    </div>
  )
}
