import { useState } from 'react'
import { Clipboard, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react'

type PCRStatus = 'AWAITING_TENANT_REVIEW' | 'DISPUTED' | 'FINALIZED'

interface PCRItem {
  area: string
  condition: string
  notes: string
  photoCount: number
}

interface PCRRecord {
  id: string
  type: 'ENTRY' | 'QUARTERLY' | 'EXIT'
  status: PCRStatus
  date: string
  portfolioManagerName: string
  items: PCRItem[]
}

const PCRS: PCRRecord[] = [
  {
    id: 'pcr-q1',
    type: 'QUARTERLY',
    status: 'AWAITING_TENANT_REVIEW',
    date: '15 Apr 2026',
    portfolioManagerName: 'Sarah Mitchell',
    items: [
      { area: 'Kitchen',        condition: 'Good',       notes: 'Clean and tidy. Minor grease marks on rangehood — please wipe down.',     photoCount: 2 },
      { area: 'Living Room',    condition: 'Good',       notes: 'Well maintained.',                                                          photoCount: 1 },
      { area: 'Master Bedroom', condition: 'Good',       notes: 'Clean.',                                                                    photoCount: 1 },
      { area: 'Bathroom',       condition: 'Fair',       notes: 'Mould forming in grout near shower. Please treat before next inspection.',   photoCount: 2 },
      { area: 'Backyard',       condition: 'Attention',  notes: 'Lawn overdue for mowing. Please attend to within 7 days.',                  photoCount: 1 },
    ],
  },
  {
    id: 'pcr-entry',
    type: 'ENTRY',
    status: 'FINALIZED',
    date: '1 Oct 2025',
    portfolioManagerName: 'Sarah Mitchell',
    items: [
      { area: 'Kitchen',        condition: 'Excellent', notes: 'Newly renovated. All appliances working.',   photoCount: 4 },
      { area: 'Living Room',    condition: 'Excellent', notes: 'Freshly painted.',                           photoCount: 2 },
      { area: 'Master Bedroom', condition: 'Excellent', notes: 'New carpet.',                                photoCount: 2 },
      { area: 'Bathroom',       condition: 'Excellent', notes: 'Re-grouted and resealed.',                   photoCount: 3 },
      { area: 'Backyard',       condition: 'Good',      notes: 'Lawn maintained. Hose reel present.',        photoCount: 2 },
    ],
  },
]

const TYPE_LABELS: Record<PCRRecord['type'], string> = {
  ENTRY:     'Entry Condition Report',
  QUARTERLY: 'Quarterly Inspection Report',
  EXIT:      'Exit Condition Report',
}

const CONDITION_COLORS: Record<string, string> = {
  Excellent: 'text-green-700 bg-green-50 border-green-200',
  Good:      'text-blue-700 bg-blue-50 border-blue-200',
  Fair:      'text-amber-700 bg-amber-50 border-amber-200',
  Attention: 'text-red-700 bg-red-50 border-red-200',
}

function PCRCard({ pcr }: { pcr: PCRRecord }) {
  const [expanded, setExpanded] = useState(pcr.status === 'AWAITING_TENANT_REVIEW')
  const [acknowledged, setAcknowledged] = useState(pcr.status === 'FINALIZED')
  const [disputed, setDisputed]         = useState(false)
  const [disputeText, setDisputeText]   = useState('')
  const [disputeSubmitted, setDisputeSubmitted] = useState(false)

  const isPending = pcr.status === 'AWAITING_TENANT_REVIEW' && !acknowledged && !disputed

  return (
    <div className={`card overflow-hidden ${isPending ? 'border-amber-200 ring-1 ring-amber-100' : ''}`}>
      {/* Header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <Clipboard size={16} className="text-gray-400" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800">{TYPE_LABELS[pcr.type]}</p>
            <p className="text-xs text-gray-400">{pcr.date} · {pcr.portfolioManagerName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isPending && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-full">
              Action Required
            </span>
          )}
          {acknowledged && !disputeSubmitted && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 border border-green-200 rounded-full flex items-center gap-1">
              <CheckCircle2 size={11} /> Acknowledged
            </span>
          )}
          {disputeSubmitted && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded-full flex items-center gap-1">
              <AlertTriangle size={11} /> Disputed
            </span>
          )}
          {pcr.status === 'FINALIZED' && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 border border-gray-200 rounded-full">
              Finalised
            </span>
          )}
          {expanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="border-t border-gray-100">
          <div className="px-4 py-3 space-y-2">
            {pcr.items.map(item => (
              <div key={item.area} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-28 flex-shrink-0">
                  <p className="text-xs font-semibold text-gray-700">{item.area}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">{item.notes}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.photoCount} photo{item.photoCount !== 1 ? 's' : ''} attached</p>
                </div>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${CONDITION_COLORS[item.condition] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                  {item.condition}
                </span>
              </div>
            ))}
          </div>

          {/* Action zone — for pending tenant review */}
          {!acknowledged && !disputeSubmitted && pcr.status === 'AWAITING_TENANT_REVIEW' && (
            <div className="px-4 pb-4 pt-2 bg-amber-50 border-t border-amber-100">
              <p className="text-xs text-amber-800 mb-3 font-medium">
                Please review and acknowledge this inspection report. If you disagree with any findings, you may raise a dispute.
              </p>

              {!disputed ? (
                <div className="flex gap-2">
                  <button
                    className="btn-primary text-sm flex items-center gap-1.5"
                    onClick={() => setAcknowledged(true)}
                  >
                    <CheckCircle2 size={13} /> Acknowledge Report
                  </button>
                  <button
                    className="btn-secondary text-sm flex items-center gap-1.5"
                    onClick={() => setDisputed(true)}
                  >
                    <MessageSquare size={13} /> Raise Dispute
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700">Describe your dispute (e.g. which area and what you disagree with):</p>
                  <textarea
                    className="input text-sm w-full h-20 resize-none"
                    placeholder="e.g. The backyard was mowed on 12 Apr — see attached photo..."
                    value={disputeText}
                    onChange={e => setDisputeText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn-primary text-sm"
                      disabled={!disputeText.trim()}
                      onClick={() => setDisputeSubmitted(true)}
                    >
                      Submit Dispute
                    </button>
                    <button className="btn-secondary text-sm" onClick={() => setDisputed(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {acknowledged && (
            <div className="px-4 py-3 bg-green-50 border-t border-green-100">
              <div className="flex items-center gap-2 text-green-700 text-sm">
                <CheckCircle2 size={14} /> You acknowledged this report. No issues were raised.
              </div>
            </div>
          )}

          {disputeSubmitted && (
            <div className="px-4 py-3 bg-red-50 border-t border-red-100">
              <p className="text-sm text-red-700 font-medium flex items-center gap-1.5">
                <AlertTriangle size={14} /> Dispute submitted
              </p>
              <p className="text-xs text-red-600 mt-1">{disputeText}</p>
              <p className="text-xs text-gray-400 mt-1">Your agent will review and respond within 3 business days.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function TenantPCR() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Condition Reports</h1>
      <p className="text-sm text-gray-500 mb-5">12 Kings Park Rd, West Perth WA 6005</p>

      <div className="space-y-3">
        {PCRS.map(pcr => <PCRCard key={pcr.id} pcr={pcr} />)}
      </div>

      <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
        <strong>WA Tenancy Law:</strong> Tenants have the right to request a copy of all property condition reports under the Residential Tenancies Act 1987 (WA). Disputes must be raised within 5 business days of receiving the report.
      </div>
    </div>
  )
}
