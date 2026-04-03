import { useState } from 'react'
import { DollarSign, CheckCircle2, AlertTriangle, Shield } from 'lucide-react'

type BondStatus = 'LODGED' | 'REFUND_IN_PROGRESS' | 'REFUNDED'

const BOND = {
  amount: 3000,
  status: 'LODGED' as BondStatus,
  lodgedDate: '15 Oct 2025',
  dmirsReference: 'WA-BND-2025-10-00412',
  propertyAddress: '12 Kings Park Rd, West Perth WA 6005',
}

const STATUS_STEPS: { key: BondStatus; label: string }[] = [
  { key: 'LODGED',              label: 'Lodged with DMIRS' },
  { key: 'REFUND_IN_PROGRESS',  label: 'Refund in Progress' },
  { key: 'REFUNDED',            label: 'Refunded' },
]

export default function TenantBond() {
  const [disputeOpen, setDisputeOpen] = useState(false)
  const [disputeText, setDisputeText] = useState('')
  const [disputeSubmitted, setDisputeSubmitted] = useState(false)

  const stepIdx = STATUS_STEPS.findIndex(s => s.key === BOND.status)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Bond</h1>
      <p className="text-sm text-gray-500 mb-5">12 Kings Park Rd, West Perth WA 6005</p>

      {/* Bond summary */}
      <div className="card p-5 mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Shield size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Bond Amount Lodged</p>
            <p className="text-2xl font-bold text-gray-900">${BOND.amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Status</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={14} /> Lodged with DMIRS
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Lodged Date</p>
            <p className="font-medium text-gray-700">{BOND.lodgedDate}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-400 mb-0.5">DMIRS Reference</p>
            <p className="font-mono text-sm text-gray-700">{BOND.dmirsReference}</p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => (
              <div key={step.key} className="flex items-center flex-1 last:flex-none">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i <= stepIdx ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i < stepIdx ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <div className="ml-2 flex-1">
                  <p className={`text-xs font-medium ${i <= stepIdx ? 'text-emerald-700' : 'text-gray-400'}`}>{step.label}</p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-2 ${i < stepIdx ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal info */}
      <div className="card p-4 mb-4 bg-blue-50 border-blue-100">
        <h2 className="text-sm font-semibold text-blue-800 mb-2">Your Bond Rights (WA)</h2>
        <ul className="text-xs text-blue-700 space-y-1.5">
          <li>• Your bond is held by the <strong>Department of Mines, Industry Regulation and Safety (DMIRS)</strong> — not the landlord or agent.</li>
          <li>• Your bond can only be claimed by the lessor for unpaid rent, cleaning costs, or damage beyond fair wear and tear.</li>
          <li>• At the end of your tenancy, you will receive a bond refund breakdown from your agent. You have the right to agree or dispute any deductions.</li>
          <li>• If a dispute cannot be resolved, you may apply to the <strong>Magistrates Court of WA</strong> for a determination.</li>
        </ul>
      </div>

      {/* Dispute section — only relevant if bond is in refund */}
      {BOND.status === 'REFUND_IN_PROGRESS' && !disputeSubmitted && (
        <div className="card p-4 border-amber-200 bg-amber-50">
          <h2 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-1.5">
            <AlertTriangle size={15} /> Bond Refund Breakdown Received
          </h2>
          <p className="text-xs text-amber-700 mb-3">
            Your agent has submitted a bond refund breakdown. If you disagree with any deductions, you can raise a dispute below.
          </p>
          {!disputeOpen ? (
            <button
              className="btn-secondary text-sm flex items-center gap-1.5"
              onClick={() => setDisputeOpen(true)}
            >
              <AlertTriangle size={13} /> Raise a Dispute
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                className="input w-full text-sm h-24 resize-none"
                placeholder="Describe what you are disputing and why (e.g. professional cleaning was done — receipt attached)..."
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
                <button className="btn-secondary text-sm" onClick={() => setDisputeOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {disputeSubmitted && (
        <div className="card p-4 border-red-200 bg-red-50">
          <p className="text-sm font-semibold text-red-700 flex items-center gap-1.5">
            <AlertTriangle size={15} /> Dispute submitted
          </p>
          <p className="text-xs text-red-600 mt-1">{disputeText}</p>
          <p className="text-xs text-gray-500 mt-2">Your agent will review your dispute. If unresolved, either party may apply to the Magistrates Court of WA.</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400 text-center">
        <DollarSign size={12} className="inline" /> Bond reference {BOND.dmirsReference} — DMIRS WA
      </div>
    </div>
  )
}
