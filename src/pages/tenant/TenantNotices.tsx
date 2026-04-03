import { useState } from 'react'
import { Bell, CheckCircle2, ChevronDown, ChevronUp, Calendar, AlertTriangle } from 'lucide-react'

type NoticeStatus = 'PENDING_ACK' | 'ACKNOWLEDGED' | 'EFFECTIVE'

interface Notice {
  id: string
  type: 'FORM_19' | 'FORM_20' | 'FORM_21'
  title: string
  issuedDate: string
  effectiveDate: string
  status: NoticeStatus
  detail: string
  legalNote: string
}

const NOTICES: Notice[] = [
  {
    id: 'n-001',
    type: 'FORM_19',
    title: 'Notice of Intention to Inspect Premises',
    issuedDate: '2 Apr 2026',
    effectiveDate: '15 Apr 2026',
    status: 'PENDING_ACK',
    detail: 'The property manager intends to carry out a routine inspection of the premises at 12 Kings Park Rd, West Perth WA 6005 on Wednesday 15 April 2026 between 10:00am – 11:00am.',
    legalNote: 'Under the Residential Tenancies Act 1987 (WA), the agent must give at least 7 days notice for a routine inspection. You are entitled to be present.',
  },
  {
    id: 'n-002',
    type: 'FORM_20',
    title: 'Notice of Rent Increase',
    issuedDate: '15 Jan 2026',
    effectiveDate: '1 Apr 2026',
    status: 'EFFECTIVE',
    detail: 'Your weekly rent will increase from $700 to $750 per week effective 1 April 2026. This represents an increase of $50 per week.',
    legalNote: 'Under WA tenancy law, at least 60 days written notice must be given before a rent increase takes effect. This notice was issued 75 days in advance.',
  },
]

const TYPE_COLORS: Record<Notice['type'], string> = {
  FORM_19: 'bg-blue-100 text-blue-700 border-blue-200',
  FORM_20: 'bg-amber-100 text-amber-700 border-amber-200',
  FORM_21: 'bg-red-100 text-red-700 border-red-200',
}

const TYPE_LABELS: Record<Notice['type'], string> = {
  FORM_19: 'Form 19',
  FORM_20: 'Form 20',
  FORM_21: 'Form 21',
}

function NoticeCard({ notice }: { notice: Notice }) {
  const [expanded, setExpanded] = useState(notice.status === 'PENDING_ACK')
  const [acked, setAcked] = useState(notice.status !== 'PENDING_ACK')

  return (
    <div className={`card overflow-hidden ${notice.status === 'PENDING_ACK' && !acked ? 'border-blue-200 ring-1 ring-blue-100' : ''}`}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <Bell size={15} className="text-gray-400" />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-800">{notice.title}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${TYPE_COLORS[notice.type]}`}>
                {TYPE_LABELS[notice.type]}
              </span>
            </div>
            <p className="text-xs text-gray-400">Issued {notice.issuedDate} · Effective {notice.effectiveDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notice.status === 'PENDING_ACK' && !acked && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full">
              Please Acknowledge
            </span>
          )}
          {acked && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded-full flex items-center gap-1">
              <CheckCircle2 size={11} /> Acknowledged
            </span>
          )}
          {notice.status === 'EFFECTIVE' && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
              In Effect
            </span>
          )}
          {expanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
              <Calendar size={12} /> Effective date: <strong>{notice.effectiveDate}</strong>
            </div>
            <p className="text-sm text-gray-700 mb-3">{notice.detail}</p>
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
              <AlertTriangle size={12} className="inline mr-1" />
              {notice.legalNote}
            </div>
          </div>

          {notice.status === 'PENDING_ACK' && !acked && (
            <div className="px-4 pb-4">
              <button
                className="btn-primary text-sm flex items-center gap-1.5"
                onClick={() => setAcked(true)}
              >
                <CheckCircle2 size={13} /> Acknowledge Notice
              </button>
              <p className="text-xs text-gray-400 mt-1.5">
                Acknowledging confirms you have received this notice. It does not constitute agreement.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TenantNotices() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Notices</h1>
      <p className="text-sm text-gray-500 mb-5">12 Kings Park Rd, West Perth WA 6005</p>

      <div className="space-y-3">
        {NOTICES.map(n => <NoticeCard key={n.id} notice={n} />)}
      </div>

      <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
        <strong>Questions?</strong> Contact your property manager Sarah Mitchell at s.mitchell@pms.com or 0411 234 567.
      </div>
    </div>
  )
}
