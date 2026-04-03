import { useNavigate } from 'react-router-dom'
import { Receipt, ChevronRight, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'

const ACTIVE_LEASES = [
  {
    id: 'rent-001',
    property: '33 Hay St, Subiaco WA 6008',
    tenant: 'Sarah Johnson',
    weeklyRent: 480,
    frequency: 'Weekly',
    nextDue: '7 Apr 2026',
    overdueCount: 1,
    lastPayment: '24 Mar 2026',
    leaseEnd: '31 Mar 2027',
    rentIncreaseStatus: 'NOTICE_GENERATED',
  },
  {
    id: 'rent-002',
    property: '12 King St, Fremantle WA 6160',
    tenant: 'Michael Chen',
    weeklyRent: 560,
    frequency: 'Fortnightly',
    nextDue: '10 Apr 2026',
    overdueCount: 0,
    lastPayment: '27 Mar 2026',
    leaseEnd: '14 Oct 2026',
    rentIncreaseStatus: null,
  },
  {
    id: 'rent-003',
    property: '7 Beach Rd, Cottesloe WA 6011',
    tenant: 'Emma Williams',
    weeklyRent: 650,
    frequency: 'Monthly',
    nextDue: '1 May 2026',
    overdueCount: 0,
    lastPayment: '1 Mar 2026',
    leaseEnd: '28 Feb 2027',
    rentIncreaseStatus: null,
  },
]

const OVERDUE_COLOR = 'bg-red-50 border-red-200'
const NORMAL_COLOR  = 'bg-white border-gray-100'

export default function RentDashboard() {
  const navigate = useNavigate()

  const totalOverdue  = ACTIVE_LEASES.reduce((s, l) => s + l.overdueCount, 0)
  const totalWeekly   = ACTIVE_LEASES.reduce((s, l) => s + l.weeklyRent, 0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rent Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Active rent schedules across all managed properties</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Active Leases</p>
          <p className="text-2xl font-bold text-gray-900">{ACTIVE_LEASES.length}</p>
        </div>
        <div className={`card p-4 text-center ${totalOverdue > 0 ? 'bg-red-50' : ''}`}>
          <p className="text-xs text-gray-400 mb-1">Overdue Invoices</p>
          <p className={`text-2xl font-bold ${totalOverdue > 0 ? 'text-red-600' : 'text-gray-400'}`}>{totalOverdue}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Combined Weekly Rent</p>
          <p className="text-2xl font-bold text-green-700">${totalWeekly.toLocaleString()}</p>
        </div>
      </div>

      {/* Lease list */}
      <div className="space-y-3">
        {ACTIVE_LEASES.map(lease => {
          const hasOverdue = lease.overdueCount > 0
          return (
            <div
              key={lease.id}
              className={`card border p-4 hover:shadow-md transition-shadow cursor-pointer ${hasOverdue ? OVERDUE_COLOR : NORMAL_COLOR}`}
              onClick={() => navigate(`/agent/rent/${lease.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${hasOverdue ? 'bg-red-100' : 'bg-green-50'}`}>
                    <Receipt size={18} className={hasOverdue ? 'text-red-600' : 'text-green-600'} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{lease.property}</p>
                    <p className="text-sm text-gray-500">Tenant: {lease.tenant} · {lease.frequency} · ${lease.weeklyRent}/wk</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      {hasOverdue ? (
                        <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                          <AlertCircle size={12} /> {lease.overdueCount} overdue invoice{lease.overdueCount > 1 ? 's' : ''}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle2 size={12} /> All paid
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} /> Next due: {lease.nextDue}
                      </span>
                      {lease.rentIncreaseStatus && (
                        <StatusBadge status={lease.rentIncreaseStatus} size="sm" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Lease ends</p>
                    <p className="text-sm font-medium text-gray-700">{lease.leaseEnd}</p>
                  </div>
                  <button
                    className="btn-primary text-sm flex items-center gap-1"
                    onClick={e => { e.stopPropagation(); navigate(`/agent/rent/${lease.id}`) }}
                  >
                    Ledger <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
