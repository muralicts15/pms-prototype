import { useNavigate } from 'react-router-dom'
import { Clipboard, ChevronRight, Plus } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'

const MOCK_PCRS = [
  {
    id: 'pcr-001', type: 'ENTRY', status: 'IN_PROGRESS',
    property: '33 Hay St, Subiaco WA 6008', tenant: 'Sarah Johnson', date: '1 May 2026',
  },
  {
    id: 'pcr-quarterly', type: 'QUARTERLY', status: 'DRAFT',
    property: '33 Hay St, Subiaco WA 6008', tenant: 'Sarah Johnson', date: '—',
  },
  {
    id: 'pcr-exit', type: 'EXIT', status: 'DRAFT',
    property: '33 Hay St, Subiaco WA 6008', tenant: 'Sarah Johnson', date: '—',
  },
]

const TYPE_COLORS = {
  ENTRY:     'bg-blue-50 text-blue-700',
  QUARTERLY: 'bg-teal-50 text-teal-700',
  EXIT:      'bg-orange-50 text-orange-700',
}
const TYPE_LABELS = { ENTRY: 'Entry PCR', QUARTERLY: 'Quarterly Inspection', EXIT: 'Exit PCR' }

export default function PCRList() {
  const navigate = useNavigate()
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Condition Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Entry, quarterly inspections, and exit PCRs</p>
        </div>
        <button className="btn-primary text-sm flex items-center gap-1.5" onClick={() => navigate('/agent/pcr/pcr-quarterly')}>
          <Plus size={14} /> New Inspection
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_PCRS.map(pcr => (
          <div key={pcr.id} className="card p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/agent/pcr/${pcr.id}`)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clipboard size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[pcr.type as keyof typeof TYPE_COLORS]}`}>
                      {pcr.type}
                    </span>
                    <p className="font-semibold text-gray-900">{TYPE_LABELS[pcr.type as keyof typeof TYPE_LABELS]}</p>
                    <StatusBadge status={pcr.status} size="sm" />
                  </div>
                  <p className="text-sm text-gray-500">{pcr.property}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Tenant: {pcr.tenant} · Inspection date: {pcr.date}</p>
                </div>
              </div>
              <button
                className="btn-primary text-sm flex items-center gap-1 flex-shrink-0"
                onClick={e => { e.stopPropagation(); navigate(`/agent/pcr/${pcr.id}`) }}
              >
                Open <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
