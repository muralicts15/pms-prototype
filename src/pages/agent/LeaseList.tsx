import { useNavigate } from 'react-router-dom'
import { FileText, ChevronRight, DollarSign, Calendar } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { LEASES } from '../../data/mockData'

export default function LeaseList() {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Leases</h1>
        <p className="text-sm text-gray-500 mt-0.5">Active and pending lease agreements</p>
      </div>

      <div className="space-y-3">
        {LEASES.map(lease => (
          <div
            key={lease.id}
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/agent/leases/${lease.id}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900">{lease.propertyAddress}</p>
                    <StatusBadge status={lease.status} />
                  </div>
                  <p className="text-sm text-gray-500">Tenant: {lease.tenantName}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {lease.leaseStart} – {lease.leaseEnd}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={11} /> ${lease.weeklyRent}/wk · Bond ${lease.bondAmount.toLocaleString()}
                    </span>
                    <span>{lease.agreementType}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  className="btn-primary text-sm flex items-center gap-1"
                  onClick={e => { e.stopPropagation(); navigate(`/agent/leases/${lease.id}`) }}
                >
                  Open <ChevronRight size={14} />
                </button>
                {lease.bondId && (
                  <button
                    className="btn-secondary text-sm flex items-center gap-1"
                    onClick={e => { e.stopPropagation(); navigate(`/agent/bonds/${lease.bondId}`) }}
                  >
                    <DollarSign size={13} /> Bond
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {LEASES.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FileText size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No leases yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
