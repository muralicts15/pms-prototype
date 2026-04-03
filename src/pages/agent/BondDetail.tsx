import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, DollarSign, CheckCircle2, Download,
  FileText, AlertCircle, MapPin, Building2, ChevronRight,
  Send, Trash2, Plus
} from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { BONDS } from '../../data/mockData'
import type { BondStatus } from '../../types'

// ─── Bond status stepper ────────────────────────────────────────────
const BOND_STEPS: { key: BondStatus; label: string }[] = [
  { key: 'INVOICED',          label: 'Invoiced' },
  { key: 'PARTIALLY_PAID',    label: 'Part. Paid' },
  { key: 'RECEIVED',          label: 'Received' },
  { key: 'READY_TO_LODGE',    label: 'Ready to Lodge' },
  { key: 'LODGED',            label: 'Lodged' },
  { key: 'REFUND_IN_PROGRESS',label: 'Refund' },
  { key: 'REFUNDED',          label: 'Refunded' },
]
const BOND_STEP_ORDER: BondStatus[] = [
  'INVOICED', 'PARTIALLY_PAID', 'RECEIVED', 'READY_TO_LODGE',
  'LODGED', 'REFUND_IN_PROGRESS', 'REFUNDED',
]

function BondStepper({ current }: { current: BondStatus }) {
  const idx = BOND_STEP_ORDER.indexOf(current)
  return (
    <div className="flex items-center gap-0 flex-wrap">
      {BOND_STEPS.map((step, i) => {
        const done   = i < idx
        const active = i === idx
        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                done   ? 'bg-green-500 border-green-500 text-white' :
                active ? 'bg-blue-600 border-blue-600 text-white scale-110' :
                         'bg-white border-gray-300 text-gray-400'
              }`}>
                {done ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium whitespace-nowrap ${
                done ? 'text-green-600' : active ? 'text-blue-700' : 'text-gray-400'
              }`}>{step.label}</span>
            </div>
            {i < BOND_STEPS.length - 1 && (
              <div className={`h-0.5 w-10 mx-1 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Record Payment Modal ─────────────────────────────────────────
function RecordPaymentModal({
  remaining,
  onConfirm,
  onCancel,
}: {
  remaining: number
  onConfirm: (amount: number) => void
  onCancel: () => void
}) {
  const [amount, setAmount] = useState(String(remaining))
  const parsed = parseFloat(amount) || 0
  const isValid = parsed > 0 && parsed <= remaining

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-sm p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Record Bond Payment</h2>
        <p className="text-sm text-gray-500 mb-4">Amount outstanding: <strong>${remaining.toLocaleString()}</strong></p>

        <div className="mb-4">
          <label className="label">Payment Amount ($)</label>
          <input
            className="input"
            type="number"
            min="1"
            max={remaining}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
          />
          {parsed > 0 && parsed < remaining && (
            <p className="text-xs text-yellow-600 mt-1">
              Partial payment — ${(remaining - parsed).toLocaleString()} will still be outstanding
            </p>
          )}
          {parsed >= remaining && parsed > 0 && (
            <p className="text-xs text-green-600 mt-1">
              Full bond amount received ✓
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="label">Payment Reference</label>
          <input className="input" type="text" placeholder="e.g. EFT — BSB 086-006 / Ref BOND-001" />
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className="btn-primary"
            disabled={!isValid}
            onClick={() => onConfirm(parsed)}
          >
            Record Payment
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Lodge Modal ─────────────────────────────────────────────────
function LodgeModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (ref: string) => void
  onCancel: () => void
}) {
  const [ref, setRef]       = useState('')
  const [lodgedAt, setLodgedAt] = useState('1 Apr 2026')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <Building2 size={18} className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Lodge Bond with DMIRS</h2>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Enter the bond lodgement details provided by the Department of Mines, Industry Regulation and Safety (DMIRS).
        </p>

        <div className="space-y-3 mb-5">
          <div>
            <label className="label">DMIRS Lodgement Reference <span className="text-red-500">*</span></label>
            <input
              className="input font-mono"
              type="text"
              placeholder="e.g. WA-BND-2026-04-00123"
              value={ref}
              onChange={e => setRef(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Found on your DMIRS lodgement receipt</p>
          </div>
          <div>
            <label className="label">Lodgement Date</label>
            <input
              className="input"
              type="text"
              value={lodgedAt}
              onChange={e => setLodgedAt(e.target.value)}
            />
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
            <p className="font-semibold mb-0.5">⚠️ Legal Requirement</p>
            <p>WA law requires bond lodgement with DMIRS within a statutory period. Record this reference to confirm lodgement compliance.</p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button
            className="btn-primary"
            disabled={!ref.trim()}
            onClick={() => onConfirm(ref.trim())}
          >
            Confirm Lodgement
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export default function BondDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const source = BONDS.find(b => b.id === id) ?? BONDS[0]

  const [bondStatus, setBondStatus]     = useState<BondStatus>(source.status)
  const [amountPaid, setAmountPaid]     = useState(source.amountPaid)
  const [dmirsRef, setDmirsRef]         = useState<string | undefined>(source.dmirsReference)
  const [propertyUnderOffer, setPropertyUnderOffer] = useState(false)

  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showLodgeModal, setShowLodgeModal]     = useState(false)
  const [showReadyConfirm, setShowReadyConfirm] = useState(false)

  // Refund workflow state
  type Deduction = { id: string; label: string; amount: string }
  const isRefunded = source.status === 'REFUNDED'
  const [deductions, setDeductions] = useState<Deduction[]>(
    isRefunded
      ? [
          { id: 'd1', label: 'Cleaning costs',      amount: '180' },
          { id: 'd2', label: 'Damage from Exit PCR', amount: '300' },
        ]
      : [
          { id: 'd1', label: 'Cleaning costs',      amount: '' },
          { id: 'd2', label: 'Damage from Exit PCR', amount: '' },
        ]
  )
  const [tenantBankBSB, setTenantBankBSB]     = useState('')
  const [tenantBankAcc, setTenantBankAcc]     = useState('')
  const [refundStep, setRefundStep]           = useState<'calc' | 'agree' | 'submit' | 'done'>(
    source.status === 'REFUNDED'           ? 'done'  :
    source.status === 'REFUND_IN_PROGRESS' ? 'agree' : 'calc'
  )
  const [tenantAgreed, setTenantAgreed]       = useState(isRefunded)
  const [disputeNote, setDisputeNote]         = useState('')
  const [summaryEmailSent, setSummaryEmailSent] = useState(isRefunded)
  const [refundedAt, setRefundedAt]           = useState(isRefunded ? '7 Apr 2026' : '')

  const [timeline, setTimeline] = useState([
    { id: 't1', action: 'Bond invoice generated', actor: 'System', timestamp: '31 Mar 2026, 5:05pm' },
    { id: 't2', action: 'Lease fully signed', actor: 'System', timestamp: '31 Mar 2026, 5:00pm' },
  ])

  const remaining  = source.bondAmount - amountPaid
  const paidPct    = Math.round((amountPaid / source.bondAmount) * 100)

  function addTimeline(action: string, actor: string) {
    setTimeline(prev => [{ id: `t${Date.now()}`, action, actor, timestamp: '1 Apr 2026' }, ...prev])
  }

  function recordPayment(amount: number) {
    const newPaid   = amountPaid + amount
    const newRemain = source.bondAmount - newPaid
    setAmountPaid(newPaid)
    setShowPaymentModal(false)

    if (newRemain <= 0) {
      setBondStatus('RECEIVED')
      addTimeline(`Full bond received — $${source.bondAmount.toLocaleString()}`, 'Sarah Mitchell (Agent)')
    } else {
      setBondStatus('PARTIALLY_PAID')
      addTimeline(`Partial payment recorded — $${amount.toLocaleString()} received`, 'Sarah Mitchell (Agent)')
    }
  }

  function prepareForLodgement() {
    setBondStatus('READY_TO_LODGE')
    addTimeline('Bond marked ready to lodge with DMIRS', 'Sarah Mitchell (Agent)')
    setShowReadyConfirm(false)
  }

  function confirmLodge(ref: string) {
    setDmirsRef(ref)
    setBondStatus('LODGED')
    setPropertyUnderOffer(true)
    setShowLodgeModal(false)
    addTimeline(`Bond lodged with DMIRS — Ref: ${ref}`, 'Sarah Mitchell (Agent)')
    addTimeline('Property status changed to Under Offer', 'System')
  }

  function simulateDownload() {
    alert('Bond Form PDF — In production this would download the WA Bond Lodgement Form pre-filled from the database.')
  }

  // Refund helpers
  const totalDeductions = deductions.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0)
  const netRefund       = Math.max(0, source.bondAmount - totalDeductions)
  const tenantOwes      = Math.max(0, totalDeductions - source.bondAmount)

  function addDeductionRow() {
    setDeductions(prev => [...prev, { id: `d${Date.now()}`, label: '', amount: '' }])
  }
  function removeDeduction(id: string) {
    setDeductions(prev => prev.filter(d => d.id !== id))
  }
  function updateDeduction(id: string, field: 'label' | 'amount', val: string) {
    setDeductions(prev => prev.map(d => d.id === id ? { ...d, [field]: val } : d))
  }

  function sendRefundSummary() {
    setSummaryEmailSent(true)
    addTimeline('Refund summary emailed to tenant for agreement', 'Sarah Mitchell (Agent)')
    setBondStatus('REFUND_IN_PROGRESS')
    setRefundStep('agree')
  }

  function confirmTenantAgreed() {
    setTenantAgreed(true)
    addTimeline('Tenant agreed to bond refund breakdown', 'Tenant')
    setRefundStep('submit')
  }

  function confirmRefundSubmitted() {
    addTimeline(`Refund claim submitted to DMIRS — $${netRefund.toLocaleString()} to tenant`, 'Sarah Mitchell (Agent)')
    setRefundStep('done')
    setBondStatus('REFUNDED')
    setRefundedAt('2 Apr 2026')
    addTimeline('Bond refund confirmed — tenancy fully closed', 'System')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Back */}
      <button
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        onClick={() => navigate('/agent/leases')}
      >
        <ArrowLeft size={14} /> Back to Leases
      </button>

      {/* Property Under Offer banner */}
      {propertyUnderOffer && (
        <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-200 rounded-xl mb-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-purple-800">Property is now Under Offer</p>
            <p className="text-sm text-purple-600">{source.propertyAddress} — listing status changed to <strong>Under Offer</strong> on the public portal.</p>
          </div>
          <button
            className="btn-secondary text-xs flex items-center gap-1"
            onClick={() => navigate('/agent/properties')}
          >
            View Property <ChevronRight size={12} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">Bond</h1>
              <StatusBadge status={bondStatus} />
              {propertyUnderOffer && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  Property: Under Offer
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{source.propertyAddress}</p>
            <p className="text-xs text-gray-400 mt-0.5">Tenant: {source.tenantName} · Invoiced {source.invoicedAt}</p>
          </div>
          <button
            className="btn-secondary text-sm flex items-center gap-1.5"
            onClick={() => navigate(`/agent/leases/lease-001`)}
          >
            <FileText size={14} /> View Lease
          </button>
        </div>

        {/* Stepper */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <BondStepper current={bondStatus} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">

          {/* Payment tracker */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">Bond Payment</h2>
            </div>

            {/* Amount cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-400 mb-0.5">Total Bond</p>
                <p className="text-xl font-bold text-gray-900">${source.bondAmount.toLocaleString()}</p>
              </div>
              <div className={`rounded-xl p-3 text-center border ${amountPaid > 0 ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                <p className="text-xs text-gray-400 mb-0.5">Amount Received</p>
                <p className={`text-xl font-bold ${amountPaid > 0 ? 'text-green-700' : 'text-gray-400'}`}>
                  ${amountPaid.toLocaleString()}
                </p>
              </div>
              <div className={`rounded-xl p-3 text-center border ${remaining > 0 ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                <p className="text-xs text-gray-400 mb-0.5">Outstanding</p>
                <p className={`text-xl font-bold ${remaining > 0 ? 'text-orange-600' : 'text-green-700'}`}>
                  ${remaining.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>Payment progress</span>
                <span>{paidPct}% received</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${paidPct}%`,
                    background: paidPct === 100 ? '#22c55e' : paidPct >= 50 ? '#f59e0b' : '#3b82f6'
                  }}
                />
              </div>
            </div>

            {/* Status-specific info */}
            {bondStatus === 'INVOICED' && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-700">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                <span>Bond invoice sent to tenant. Record payment once funds are received in your trust account.</span>
              </div>
            )}
            {bondStatus === 'PARTIALLY_PAID' && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-700">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                <span>Partial payment recorded. Remaining <strong>${remaining.toLocaleString()}</strong> is still outstanding. Record the next payment when received.</span>
              </div>
            )}
            {bondStatus === 'RECEIVED' && (
              <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700">
                <CheckCircle2 size={15} />
                <span className="font-medium">Full bond amount received. Ready to prepare for DMIRS lodgement.</span>
              </div>
            )}
            {bondStatus === 'READY_TO_LODGE' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span className="font-medium">Download the bond form, then lodge with DMIRS and enter the reference number.</span>
                </div>
                <button
                  className="btn-secondary w-full text-sm flex items-center justify-center gap-2"
                  onClick={simulateDownload}
                >
                  <Download size={14} /> Download Bond Lodgement Form (PDF)
                </button>
              </div>
            )}
            {(bondStatus === 'LODGED' || bondStatus === 'REFUND_IN_PROGRESS' || bondStatus === 'REFUNDED') && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700 font-semibold mb-1">
                  <CheckCircle2 size={15} /> Bond Successfully Lodged
                </div>
                <p className="text-xs text-green-600">DMIRS Reference: <span className="font-mono font-semibold">{dmirsRef ?? 'WA-BND-2026-04-00199'}</span></p>
                {bondStatus === 'LODGED' && <p className="text-xs text-green-600 mt-0.5">Property listing updated to <strong>Under Offer</strong> on public portal.</p>}
              </div>
            )}
          </div>

          {/* ── BOND DISPOSAL (after tenancy ends) ─────────────────── */}
          {(bondStatus === 'LODGED' || bondStatus === 'REFUND_IN_PROGRESS' || bondStatus === 'REFUNDED') && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign size={15} className="text-blue-500" />
                <h2 className="text-sm font-semibold text-gray-700">Bond Disposal</h2>
                {bondStatus === 'REFUNDED' && <span className="ml-auto text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Complete</span>}
              </div>

              {/* Step indicators */}
              <div className="flex items-center gap-2 mb-5">
                {(['calc', 'agree', 'submit', 'done'] as const).map((s, i) => {
                  const labels = ['A. Deductions', 'B. Tenant Agreement', 'C. Submit Claim', '✓ Done']
                  const isDone   = ['calc','agree','submit','done'].indexOf(refundStep) > i
                  const isActive = refundStep === s
                  return (
                    <div key={s} className="flex items-center gap-1">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        isDone   ? 'bg-green-100 border-green-300 text-green-700' :
                        isActive ? 'bg-blue-100 border-blue-300 text-blue-700' :
                                   'bg-gray-100 border-gray-200 text-gray-400'
                      }`}>{labels[i]}</div>
                      {i < 3 && <div className="w-4 h-px bg-gray-200" />}
                    </div>
                  )
                })}
              </div>

              {/* ─ Step A: Calculate Deductions ─ */}
              {refundStep === 'calc' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                    <div><p className="text-xs text-gray-400">Original Bond</p><p className="font-bold text-gray-900">${source.bondAmount.toLocaleString()}</p></div>
                    <div><p className="text-xs text-gray-400">Total Deductions</p><p className={`font-bold ${totalDeductions > 0 ? 'text-red-600' : 'text-gray-400'}`}>${totalDeductions.toLocaleString()}</p></div>
                    <div><p className="text-xs text-gray-400">Net Refund to Tenant</p><p className={`font-bold text-lg ${netRefund > 0 ? 'text-green-700' : 'text-gray-400'}`}>${netRefund.toLocaleString()}</p></div>
                    {tenantOwes > 0 && <div><p className="text-xs text-red-500">Tenant Owes Additional</p><p className="font-bold text-red-600">${tenantOwes.toLocaleString()}</p></div>}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Deduction Lines</p>
                      <button onClick={addDeductionRow} className="text-xs text-blue-600 flex items-center gap-1 hover:underline"><Plus size={11} /> Add line</button>
                    </div>
                    <div className="space-y-2">
                      {deductions.map(d => (
                        <div key={d.id} className="flex items-center gap-2">
                          <input className="input flex-1 text-sm" placeholder="Description (e.g. Cleaning)" value={d.label} onChange={e => updateDeduction(d.id, 'label', e.target.value)} />
                          <div className="relative w-28 flex-shrink-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                            <input className="input pl-6 text-sm" type="number" placeholder="0" value={d.amount} onChange={e => updateDeduction(d.id, 'amount', e.target.value)} />
                          </div>
                          <button onClick={() => removeDeduction(d.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {tenantOwes > 0 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                      <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                      Deductions exceed bond. Tenant owes an additional <strong>${tenantOwes.toLocaleString()}</strong>. This should be pursued separately or agreed in writing.
                    </div>
                  )}

                  <button
                    className="btn-primary text-sm flex items-center gap-1.5"
                    onClick={sendRefundSummary}
                  >
                    <Send size={13} /> Send Refund Summary to Tenant
                  </button>
                </div>
              )}

              {/* ─ Step B: Tenant Agreement ─ */}
              {refundStep === 'agree' && (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm">
                    <div className="grid grid-cols-3 gap-3 mb-2">
                      <div><p className="text-xs text-gray-400">Bond</p><p className="font-semibold">${source.bondAmount.toLocaleString()}</p></div>
                      <div><p className="text-xs text-gray-400">Deductions</p><p className="font-semibold text-red-600">−${totalDeductions.toLocaleString()}</p></div>
                      <div><p className="text-xs text-gray-400">Net Refund</p><p className="font-bold text-green-700">${netRefund.toLocaleString()}</p></div>
                    </div>
                    {summaryEmailSent && (
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1"><CheckCircle2 size={11} /> Summary emailed to tenant</p>
                    )}
                  </div>

                  {!tenantAgreed ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Waiting for tenant to agree or dispute the refund breakdown.</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 transition-colors"
                          onClick={confirmTenantAgreed}
                        >
                          <CheckCircle2 size={15} /> Tenant Agrees
                        </button>
                        <div className="space-y-2">
                          <input className="input text-sm" placeholder="Dispute reason / resolution note" value={disputeNote} onChange={e => setDisputeNote(e.target.value)} />
                          <button
                            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 transition-colors"
                            disabled={!disputeNote.trim()}
                            onClick={() => {
                              addTimeline(`Tenant disputed refund — ${disputeNote}`, 'Tenant')
                              setDisputeNote('')
                            }}
                          >
                            <AlertCircle size={14} /> Tenant Disputes
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                        <CheckCircle2 size={14} /> Tenant agreed to refund breakdown
                      </div>
                      <button className="btn-primary text-sm" onClick={() => setRefundStep('submit')}>
                        Proceed to Submit Refund Claim →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ─ Step C: Submit DMIRS Claim ─ */}
              {refundStep === 'submit' && (
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm">
                    <p className="text-xs text-gray-500 mb-2">Refund breakdown confirmed</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><p className="text-xs text-gray-400">Bond</p><p className="font-semibold">${source.bondAmount.toLocaleString()}</p></div>
                      <div><p className="text-xs text-gray-400">Deductions</p><p className="font-semibold text-red-600">−${totalDeductions.toLocaleString()}</p></div>
                      <div><p className="text-xs text-gray-400">Refund</p><p className="font-bold text-green-700 text-lg">${netRefund.toLocaleString()}</p></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Tenant Bank BSB</label>
                      <input className="input font-mono" placeholder="e.g. 086-006" value={tenantBankBSB} onChange={e => setTenantBankBSB(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Tenant Account Number</label>
                      <input className="input font-mono" placeholder="e.g. 123456789" value={tenantBankAcc} onChange={e => setTenantBankAcc(e.target.value)} />
                    </div>
                    <div className="col-span-2">
                      <label className="label">Refund Date</label>
                      <input className="input" value={refundedAt} onChange={e => setRefundedAt(e.target.value)} placeholder="e.g. 5 Apr 2026" />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                    WA law: Bond refund must be processed within 7 business days of tenancy ending. Submit the DMIRS refund claim with the original lodgement reference.
                  </div>

                  <button
                    className="btn-primary text-sm flex items-center gap-1.5"
                    disabled={!tenantBankBSB.trim() || !tenantBankAcc.trim() || !refundedAt.trim()}
                    onClick={confirmRefundSubmitted}
                  >
                    <CheckCircle2 size={14} /> Confirm Bond Refunded
                  </button>
                </div>
              )}

              {/* ─ Done ─ */}
              {refundStep === 'done' && (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                      <CheckCircle2 size={18} /> Bond Disposal Complete
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm mb-2">
                      <div><p className="text-xs text-gray-400">Refunded to Tenant</p><p className="font-bold text-green-700">${netRefund.toLocaleString()}</p></div>
                      <div><p className="text-xs text-gray-400">Deductions Retained</p><p className="font-semibold">${totalDeductions.toLocaleString()}</p></div>
                      <div><p className="text-xs text-gray-400">Refund Date</p><p className="font-semibold">{refundedAt}</p></div>
                    </div>
                    <p className="text-xs text-green-600">Tenancy fully closed. All records archived.</p>
                  </div>

                  {/* Feedback prompt */}
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={18} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-amber-800 text-sm">One last step — submit tenant feedback</p>
                      <p className="text-xs text-amber-700 mt-0.5">Rate {source.tenantName} so future PMs have a reference record. This only takes a minute.</p>
                    </div>
                    <button
                      className="btn-primary text-sm whitespace-nowrap flex items-center gap-1.5"
                      onClick={() => navigate(`/agent/leases/${source.leaseId}`)}
                    >
                      <FileText size={14} /> Give Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Activity Timeline</h2>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200" />
              <div className="space-y-3">
                {timeline.map(entry => (
                  <div key={entry.id} className="relative">
                    <div className="absolute -left-3 top-1.5 w-2 h-2 rounded-full bg-blue-400 border-2 border-white" />
                    <p className="text-sm text-gray-800 font-medium">{entry.action}</p>
                    <p className="text-xs text-gray-400">{entry.actor} · {entry.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Actions</p>
            <div className="space-y-2">

              {(bondStatus === 'INVOICED' || bondStatus === 'PARTIALLY_PAID') && (
                <button
                  className="btn-primary w-full text-sm flex items-center justify-center gap-1.5"
                  onClick={() => setShowPaymentModal(true)}
                >
                  <DollarSign size={14} />
                  {bondStatus === 'PARTIALLY_PAID' ? 'Record Next Payment' : 'Record Payment'}
                </button>
              )}

              {bondStatus === 'RECEIVED' && (
                <button
                  className="btn-primary w-full text-sm flex items-center justify-center gap-1.5"
                  onClick={() => setShowReadyConfirm(true)}
                >
                  <CheckCircle2 size={14} /> Prepare for Lodgement
                </button>
              )}

              {bondStatus === 'READY_TO_LODGE' && (
                <>
                  <button
                    className="btn-secondary w-full text-sm flex items-center justify-center gap-1.5"
                    onClick={simulateDownload}
                  >
                    <Download size={14} /> Download Bond Form
                  </button>
                  <button
                    className="btn-primary w-full text-sm flex items-center justify-center gap-1.5"
                    onClick={() => setShowLodgeModal(true)}
                  >
                    <Building2 size={14} /> Lodge with DMIRS
                  </button>
                </>
              )}

              {bondStatus === 'LODGED' && (
                <div className="space-y-2">
                  <div className="text-center py-1 text-xs text-green-600 font-medium flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={14} /> Bond lodged with DMIRS
                  </div>
                  <p className="text-xs text-gray-400 text-center">When tenancy ends, use the Bond Disposal panel below to process the refund.</p>
                </div>
              )}
              {(bondStatus === 'REFUND_IN_PROGRESS') && (
                <div className="text-center py-1 text-xs text-blue-600 font-medium flex items-center justify-center gap-1.5">
                  <AlertCircle size={14} /> Refund in progress — see panel below
                </div>
              )}
              {bondStatus === 'REFUNDED' && (
                <div className="text-center py-1 text-xs text-green-600 font-medium flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} /> Bond fully refunded
                </div>
              )}
            </div>
          </div>

          {/* Bond summary */}
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Bond Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-semibold">${source.bondAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Received</span>
                <span className={`font-semibold ${amountPaid > 0 ? 'text-green-700' : 'text-gray-400'}`}>
                  ${amountPaid.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-500">Outstanding</span>
                <span className={`font-semibold ${remaining > 0 ? 'text-orange-600' : 'text-green-700'}`}>
                  ${remaining.toLocaleString()}
                </span>
              </div>
              {dmirsRef && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-400">DMIRS Reference</p>
                  <p className="font-mono text-xs font-semibold text-gray-700">{dmirsRef}</p>
                </div>
              )}
            </div>
          </div>

          {/* Compliance note */}
          <div className="card p-4 bg-amber-50 border-amber-100">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">WA Compliance</p>
            <p className="text-xs text-amber-600">Bond must be lodged with DMIRS within the statutory period after receipt. Failure to lodge is a breach of the Residential Tenancies Act 1987 (WA).</p>
          </div>
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <RecordPaymentModal
          remaining={remaining}
          onConfirm={recordPayment}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}

      {/* Prepare for Lodgement Confirm */}
      {showReadyConfirm && (
        <ConfirmModal
          title="Prepare Bond for Lodgement?"
          message="This will mark the bond as ready to lodge with DMIRS. You can then download the bond form and enter the lodgement reference."
          confirmLabel="Mark Ready to Lodge"
          variant="primary"
          onConfirm={prepareForLodgement}
          onCancel={() => setShowReadyConfirm(false)}
        />
      )}

      {/* Lodge Modal */}
      {showLodgeModal && (
        <LodgeModal
          onConfirm={confirmLodge}
          onCancel={() => setShowLodgeModal(false)}
        />
      )}
    </div>
  )
}
