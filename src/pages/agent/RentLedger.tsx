import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, DollarSign, CheckCircle2, AlertCircle, Clock, TrendingUp, ChevronRight } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { RENT_SCHEDULES } from '../../data/mockData'
import type { RentStatus, RentIncreaseStatus } from '../../types'

const STATUS_ICON: Record<RentStatus, typeof CheckCircle2> = {
  PAID: CheckCircle2, PARTIALLY_PAID: Clock,
  ACTIVE: Clock, OVERDUE: AlertCircle, WAIVED: CheckCircle2,
}
const STATUS_COLOR: Record<RentStatus, string> = {
  PAID: 'text-green-600', PARTIALLY_PAID: 'text-yellow-600',
  ACTIVE: 'text-blue-600', OVERDUE: 'text-red-600', WAIVED: 'text-gray-400',
}

// ─── Record Payment Modal ─────────────────────────────────────────
function PaymentModal({ invoiceNum, amount, onConfirm, onCancel }: {
  invoiceNum: string; amount: number
  onConfirm: (ref: string, partialAmount: number) => void
  onCancel: () => void
}) {
  const [ref, setRef]         = useState('')
  const [partial, setPartial] = useState(String(amount))
  const parsed = parseFloat(partial) || 0
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-sm p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Record Rent Payment</h2>
        <p className="text-sm text-gray-500 mb-4">{invoiceNum} · <strong>${amount}</strong> due</p>
        <div className="space-y-3 mb-5">
          <div>
            <label className="label">Amount Received ($)</label>
            <input className="input" type="number" value={partial} onChange={e => setPartial(e.target.value)} />
            {parsed < amount && parsed > 0 && <p className="text-xs text-yellow-600 mt-1">Partial — ${amount - parsed} still outstanding</p>}
          </div>
          <div>
            <label className="label">Payment Reference</label>
            <input className="input" placeholder="e.g. EFT Ref #48823" value={ref} onChange={e => setRef(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" disabled={parsed <= 0 || !ref.trim()} onClick={() => onConfirm(ref, parsed)}>
            Record Payment
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Rent Increase Modal ─────────────────────────────────────────
function RentIncreaseModal({ currentRent, onConfirm, onCancel }: {
  currentRent: number
  onConfirm: (newRent: number, date: string) => void
  onCancel: () => void
}) {
  const [newRent, setNewRent]   = useState(String(currentRent + 30))
  const [effDate, setEffDate]   = useState('1 Aug 2026')
  const diff = parseFloat(newRent) - currentRent
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card w-full max-w-sm p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Rent Increase (Form 20)</h2>
        <p className="text-sm text-gray-500 mb-4">Current rent: <strong>${currentRent}/week</strong></p>
        <div className="space-y-3 mb-4">
          <div>
            <label className="label">New Weekly Rent ($)</label>
            <input className="input" type="number" value={newRent} onChange={e => setNewRent(e.target.value)} />
            {diff > 0 && <p className="text-xs text-green-600 mt-1">+${diff.toFixed(0)}/wk increase</p>}
          </div>
          <div>
            <label className="label">Effective Date</label>
            <input className="input" value={effDate} onChange={e => setEffDate(e.target.value)} />
            <p className="text-xs text-gray-400 mt-1">WA law: minimum 60 days notice for fixed term, 8 weeks for periodic</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 mb-4">
          Confirming will generate a Form 20 notice and send it to the tenant by email.
        </div>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" disabled={parseFloat(newRent) <= currentRent} onClick={() => onConfirm(parseFloat(newRent), effDate)}>
            Generate Form 20
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────
export default function RentLedger() {
  const navigate = useNavigate()
  const src = RENT_SCHEDULES[0]

  type InvoiceState = typeof src.invoices[number] & { paidAmount?: number }
  const [invoices, setInvoices]         = useState<InvoiceState[]>(src.invoices)
  const [weeklyRent, setWeeklyRent]     = useState(src.weeklyRent)
  const [paymentTarget, setPaymentTarget] = useState<string | null>(null)
  const [showIncrease, setShowIncrease] = useState(false)
  const [increaseStatus, setIncreaseStatus] = useState<RentIncreaseStatus | null>(null)
  const [proposedRent, setProposedRent] = useState(0)
  const [increaseDate, setIncreaseDate] = useState('')

  function recordPayment(invoiceId: string, ref: string, amount: number) {
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv
      const newPaid = (inv.paidAmount ?? 0) + amount
      const status: RentStatus = newPaid >= inv.amount ? 'PAID' : 'PARTIALLY_PAID'
      return { ...inv, paidAmount: newPaid, paidDate: '1 Apr 2026', status }
    }))
    setPaymentTarget(null)
  }

  function initiateRentIncrease(newRent: number, date: string) {
    setProposedRent(newRent)
    setIncreaseDate(date)
    setIncreaseStatus('NOTICE_GENERATED')
    setShowIncrease(false)
  }

  const totalReceived  = invoices.reduce((s, i) => s + (i.paidAmount ?? 0), 0)
  const overdueCount   = invoices.filter(i => i.status === 'OVERDUE').length
  const targetInvoice  = invoices.find(i => i.id === paymentTarget)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4" onClick={() => navigate('/agent/leases')}>
        <ArrowLeft size={14} /> Back to Leases
      </button>

      {/* Header */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-0.5">Rent Ledger</h1>
            <p className="text-sm text-gray-500">{src.propertyAddress}</p>
            <p className="text-xs text-gray-400 mt-0.5">Tenant: {src.tenantName} · {src.frequency} · starts {src.startDate}</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-sm flex items-center gap-1.5" onClick={() => setShowIncrease(true)}>
              <TrendingUp size={13} /> Raise Rent
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400">Weekly Rent</p>
            <p className="text-xl font-bold text-gray-900">${weeklyRent}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
            <p className="text-xs text-gray-400">Total Received</p>
            <p className="text-xl font-bold text-green-700">${totalReceived.toLocaleString()}</p>
          </div>
          <div className={`rounded-xl p-3 text-center border ${overdueCount > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
            <p className="text-xs text-gray-400">Overdue</p>
            <p className={`text-xl font-bold ${overdueCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>{overdueCount}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
            <p className="text-xs text-gray-400">Invoices</p>
            <p className="text-xl font-bold text-blue-700">{invoices.length}</p>
          </div>
        </div>
      </div>

      {/* Rent Increase tracker */}
      {increaseStatus && (
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={15} className="text-blue-500" />
              <h2 className="text-sm font-semibold text-gray-700">Rent Increase — Form 20</h2>
            </div>
            <StatusBadge status={increaseStatus} />
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm mb-3">
            <div><p className="text-xs text-gray-400">Current</p><p className="font-medium">${weeklyRent}/wk</p></div>
            <div><p className="text-xs text-gray-400">New Rent</p><p className="font-semibold text-green-700">${proposedRent}/wk</p></div>
            <div><p className="text-xs text-gray-400">Effective</p><p className="font-medium">{increaseDate}</p></div>
          </div>
          <div className="flex gap-2">
            {increaseStatus === 'NOTICE_GENERATED' && (
              <button className="btn-primary text-sm" onClick={() => setIncreaseStatus('NOTICE_SERVED')}>
                Mark Notice Served
              </button>
            )}
            {increaseStatus === 'NOTICE_SERVED' && (
              <button className="btn-primary text-sm" onClick={() => { setIncreaseStatus('EFFECTIVE'); setWeeklyRent(proposedRent) }}>
                Mark Effective (update rent)
              </button>
            )}
            {increaseStatus === 'EFFECTIVE' && (
              <span className="text-sm text-green-600 font-semibold flex items-center gap-1.5"><CheckCircle2 size={14} /> Rent increased to ${proposedRent}/wk</span>
            )}
          </div>
        </div>
      )}

      {/* Invoice list */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Invoice History</h2>
        <div className="space-y-2">
          {[...invoices].reverse().map(inv => {
            const Icon = STATUS_ICON[inv.status]
            const color = STATUS_COLOR[inv.status]
            const isOverdue = inv.status === 'OVERDUE'
            return (
              <div key={inv.id} className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                <Icon size={16} className={`flex-shrink-0 ${color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-800">{inv.invoiceNumber}</span>
                    {inv.isProRata && <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full font-semibold">Pro-rata</span>}
                    <StatusBadge status={inv.status} size="sm" />
                  </div>
                  <p className="text-xs text-gray-500">{inv.periodStart} – {inv.periodEnd} · Due {inv.dueDate}</p>
                  {inv.paidDate && <p className="text-xs text-green-600">Paid {inv.paidDate} · ${(inv.paidAmount ?? inv.amount).toLocaleString()}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-gray-900">${inv.amount}</p>
                  {isOverdue && (
                    <button className="btn-primary text-xs mt-1" onClick={() => setPaymentTarget(inv.id)}>
                      Record Payment
                    </button>
                  )}
                  {inv.status === 'PARTIALLY_PAID' && (
                    <button className="btn-secondary text-xs mt-1" onClick={() => setPaymentTarget(inv.id)}>
                      Pay Remainder
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {paymentTarget && targetInvoice && (
        <PaymentModal
          invoiceNum={targetInvoice.invoiceNumber}
          amount={targetInvoice.amount - (targetInvoice.paidAmount ?? 0)}
          onConfirm={(ref, amount) => recordPayment(paymentTarget, ref, amount)}
          onCancel={() => setPaymentTarget(null)}
        />
      )}
      {showIncrease && (
        <RentIncreaseModal
          currentRent={weeklyRent}
          onConfirm={initiateRentIncrease}
          onCancel={() => setShowIncrease(false)}
        />
      )}
    </div>
  )
}
