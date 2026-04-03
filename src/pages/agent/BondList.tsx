import { useNavigate } from 'react-router-dom'
import { DollarSign, ChevronRight, Building2 } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { BONDS } from '../../data/mockData'

export default function BondList() {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Bonds</h1>
        <p className="text-sm text-gray-500 mt-0.5">Bond tracking and DMIRS lodgement</p>
      </div>

      <div className="space-y-3">
        {BONDS.map(bond => {
          const paidPct = Math.round((bond.amountPaid / bond.bondAmount) * 100)
          return (
            <div
              key={bond.id}
              className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/agent/bonds/${bond.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign size={18} className="text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900">{bond.propertyAddress}</p>
                      <StatusBadge status={bond.status} />
                    </div>
                    <p className="text-sm text-gray-500">Tenant: {bond.tenantName}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <DollarSign size={11} /> Total: ${bond.bondAmount.toLocaleString()}
                      </span>
                      <span>Received: ${bond.amountPaid.toLocaleString()}</span>
                      <span>Invoiced: {bond.invoicedAt}</span>
                    </div>
                    {bond.dmirsReference && (
                      <p className="text-xs text-green-600 mt-1">
                        DMIRS Ref: <span className="font-mono font-semibold">{bond.dmirsReference}</span>
                      </p>
                    )}
                    {/* Mini progress bar */}
                    <div className="mt-2 w-40 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full transition-all"
                        style={{ width: `${paidPct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="btn-primary text-sm flex items-center gap-1 flex-shrink-0"
                  onClick={e => { e.stopPropagation(); navigate(`/agent/bonds/${bond.id}`) }}
                >
                  Manage <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {BONDS.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Building2 size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No bonds yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
