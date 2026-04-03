import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

type InvoiceStatus = 'PAID' | 'OVERDUE' | 'DUE'

const INVOICES: { id: string; period: string; amount: number; due: string; paid: string | null; status: InvoiceStatus }[] = [
  { id: 'INV-009', period: '7 Apr – 13 Apr 2026',  amount: 750, due: '7 Apr 2026',  paid: null,           status: 'DUE' },
  { id: 'INV-008', period: '31 Mar – 6 Apr 2026',  amount: 750, due: '31 Mar 2026', paid: '31 Mar 2026',  status: 'PAID' },
  { id: 'INV-007', period: '24 Mar – 30 Mar 2026', amount: 750, due: '24 Mar 2026', paid: '24 Mar 2026',  status: 'PAID' },
  { id: 'INV-006', period: '17 Mar – 23 Mar 2026', amount: 750, due: '17 Mar 2026', paid: '18 Mar 2026',  status: 'PAID' },
  { id: 'INV-005', period: '10 Mar – 16 Mar 2026', amount: 750, due: '10 Mar 2026', paid: '10 Mar 2026',  status: 'PAID' },
  { id: 'INV-004', period: '3 Mar – 9 Mar 2026',   amount: 750, due: '3 Mar 2026',  paid: '3 Mar 2026',   status: 'PAID' },
  { id: 'INV-003', period: '24 Feb – 2 Mar 2026',  amount: 750, due: '24 Feb 2026', paid: '24 Feb 2026',  status: 'PAID' },
  { id: 'INV-002', period: '17 Feb – 23 Feb 2026', amount: 750, due: '17 Feb 2026', paid: '17 Feb 2026',  status: 'PAID' },
  { id: 'INV-001', period: '1 Oct – 16 Oct 2025',  amount: 857, due: '1 Oct 2025',  paid: '1 Oct 2025',   status: 'PAID' }, // pro-rata
]

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PAID:    { label: 'Paid',    color: 'text-green-600 bg-green-50 border-green-200',   icon: CheckCircle2 },
  DUE:     { label: 'Due',     color: 'text-blue-600 bg-blue-50 border-blue-200',      icon: Clock },
  OVERDUE: { label: 'Overdue', color: 'text-red-600 bg-red-50 border-red-200',         icon: AlertTriangle },
}

export default function TenantRent() {
  const totalPaid = INVOICES.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-1">Rent</h1>
      <p className="text-sm text-gray-500 mb-5">12 Kings Park Rd, West Perth WA 6005</p>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Weekly Rent</p>
          <p className="text-lg font-bold text-gray-900">$750</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Next Due</p>
          <p className="text-lg font-bold text-blue-600">$750</p>
          <p className="text-xs text-gray-400">7 Apr 2026</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Total Paid (Tenancy)</p>
          <p className="text-lg font-bold text-green-600">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment method note */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 mb-5">
        <CheckCircle2 size={15} />
        <span>Rent is collected by direct debit on the due date. Contact your agent if you need to change payment details.</span>
      </div>

      {/* Invoice list */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Payment History</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {INVOICES.map(inv => {
            const cfg = STATUS_CONFIG[inv.status]
            const Icon = cfg.icon
            return (
              <div key={inv.id} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{inv.period}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{inv.id}{inv.paid ? ` · Paid ${inv.paid}` : ''}</p>
                </div>
                <p className="text-sm font-semibold text-gray-700">${inv.amount}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                  <Icon size={11} />
                  {cfg.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-center">
        For billing queries contact your property manager — s.mitchell@pms.com · 0411 234 567
      </p>
    </div>
  )
}
