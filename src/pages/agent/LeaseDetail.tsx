import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, FileText, Building2, User, Briefcase,
  CheckCircle2, Clock, Send, Eye, PenLine, DollarSign,
  Calendar, AlertCircle, Key, Home, RefreshCw, XCircle,
  ChevronRight, ToggleLeft, ToggleRight, Clipboard, Star, Lock
} from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { LEASES } from '../../data/mockData'
import type { LeaseStatus, ESignParty, ESignPartyStatus } from '../../types'

// ─── Stepper ────────────────────────────────────────────────────
const ALL_STEPS: { key: LeaseStatus; label: string; phase: 'setup' | 'tenancy' }[] = [
  { key: 'GENERATED',          label: 'Generated',      phase: 'setup' },
  { key: 'SENT_FOR_SIGNATURE', label: 'Sent',           phase: 'setup' },
  { key: 'PARTIALLY_SIGNED',   label: 'Part. Signed',   phase: 'setup' },
  { key: 'FULLY_SIGNED',       label: 'Fully Signed',   phase: 'setup' },
  { key: 'ACTIVE',             label: 'Active',         phase: 'tenancy' },
  { key: 'NOTICE_GIVEN',       label: 'Notice Given',   phase: 'tenancy' },
  { key: 'VACATING',           label: 'Vacating',       phase: 'tenancy' },
  { key: 'ENDED',              label: 'Ended',          phase: 'tenancy' },
]
const STEP_ORDER: LeaseStatus[] = ALL_STEPS.map(s => s.key)

function LeaseStepper({ current }: { current: LeaseStatus }) {
  const idx = STEP_ORDER.indexOf(current)
  return (
    <div className="flex items-start gap-0 flex-wrap">
      {ALL_STEPS.map((step, i) => {
        const done   = i < idx
        const active = i === idx
        const isPhaseBreak = i === 4
        return (
          <div key={step.key} className="flex items-center">
            {isPhaseBreak && <div className="w-3 h-px border-t-2 border-dashed border-gray-300 mx-1 mb-4" />}
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                done   ? 'bg-green-500 border-green-500 text-white' :
                active ? 'bg-blue-600 border-blue-600 text-white scale-110' :
                         'bg-white border-gray-200 text-gray-400'
              }`}>
                {done ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-medium whitespace-nowrap ${
                done ? 'text-green-600' : active ? 'text-blue-700' : 'text-gray-400'
              }`}>{step.label}</span>
            </div>
            {i < ALL_STEPS.length - 1 && i !== 3 && (
              <div className={`h-0.5 w-8 mx-0.5 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── E-Sign party card ────────────────────────────────────────────
const PARTY_ICONS = { LESSOR: Building2, TENANT: User, PORTFOLIO_MANAGER: Briefcase }
const PARTY_LABELS = { LESSOR: 'Lessor (Portfolio Director)', TENANT: 'Tenant', PORTFOLIO_MANAGER: 'Portfolio Manager' }

function PartyCard({ party, onAdvance, disabled }: {
  party: ESignParty
  onAdvance: (role: ESignParty['role'], next: ESignPartyStatus) => void
  disabled: boolean
}) {
  const Icon     = PARTY_ICONS[party.role]
  const isSigned = party.status === 'SIGNED'
  const statusColors: Record<ESignPartyStatus, string> = {
    PENDING:  'text-gray-500 bg-gray-100',
    SENT:     'text-blue-600 bg-blue-50',
    OPENED:   'text-yellow-700 bg-yellow-50',
    SIGNED:   'text-green-700 bg-green-50',
    DECLINED: 'text-red-700 bg-red-50',
  }
  return (
    <div className={`card p-3 flex-1 transition-all ${isSigned ? 'ring-2 ring-green-300 border-green-200' : ''}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSigned ? 'bg-green-100' : 'bg-blue-50'}`}>
          <Icon size={16} className={isSigned ? 'text-green-600' : 'text-blue-600'} />
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{PARTY_LABELS[party.role]}</p>
          <p className="text-xs font-semibold text-gray-900">{party.name}</p>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[party.status]} mb-2`}>
        {isSigned && <CheckCircle2 size={10} />} {party.status}
      </span>
      {!disabled && !isSigned && (
        <div className="space-y-1">
          {party.status === 'SENT' && (
            <button className="btn-secondary w-full text-[10px] py-1" onClick={() => onAdvance(party.role, 'OPENED')}>
              <Eye size={10} /> Email Opened
            </button>
          )}
          {(party.status === 'SENT' || party.status === 'OPENED') && (
            <button className="btn-primary w-full text-[10px] py-1" onClick={() => onAdvance(party.role, 'SIGNED')}>
              <PenLine size={10} /> Sign Document
            </button>
          )}
        </div>
      )}
      {(disabled && party.status === 'PENDING') && (
        <p className="text-[10px] text-gray-400">Send for signature first</p>
      )}
      {isSigned && (
        <p className="text-[10px] text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={10} /> Signed</p>
      )}
    </div>
  )
}

// ─── End checklist item ───────────────────────────────────────────
function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`flex items-center gap-3 w-full p-2.5 rounded-lg border text-sm transition-all text-left ${
        checked ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
      }`}
    >
      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
        checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
      }`}>
        {checked && <CheckCircle2 size={12} className="text-white" />}
      </div>
      {label}
    </button>
  )
}

// ─── Star Rating ─────────────────────────────────────────────────
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            size={20}
            className={`transition-colors ${(hovered || value) >= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
      {value > 0 && <span className="text-xs text-gray-400 self-center ml-1">{value}/5</span>}
    </div>
  )
}

// ─── Tenant Feedback Panel ────────────────────────────────────────
function TenantFeedbackPanel({ tenantName }: { tenantName: string }) {
  const [submitted, setSubmitted]         = useState(false)
  const [overall, setOverall]             = useState(0)
  const [propertyCare, setPropertyCare]   = useState(0)
  const [rentReliability, setRentReliability] = useState(0)
  const [communication, setCommunication] = useState(0)
  const [wouldRentAgain, setWouldRentAgain] = useState<'YES' | 'CONDITIONAL' | 'NO' | null>(null)
  const [notes, setNotes]                 = useState('')
  const [incidents, setIncidents]         = useState('')

  const canSubmit = overall > 0 && wouldRentAgain !== null

  if (submitted) {
    return (
      <div className="card p-4 ring-2 ring-green-300 border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={14} className="text-green-500" />
          <h2 className="text-sm font-semibold text-gray-700">Tenant Feedback</h2>
          <span className="ml-auto text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 size={12} /> Submitted &amp; Locked</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-1">Overall Rating</p>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(n => <Star key={n} size={14} className={overall >= n ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />)}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Would Rent Again</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              wouldRentAgain === 'YES' ? 'bg-green-100 text-green-700' :
              wouldRentAgain === 'CONDITIONAL' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>{wouldRentAgain}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">This record is visible to future property managers when {tenantName} applies for another property.</p>
      </div>
    )
  }

  return (
    <div className="card p-4 ring-2 ring-blue-200 border-blue-100">
      <div className="flex items-center gap-2 mb-1">
        <Star size={15} className="text-blue-500" />
        <h2 className="text-sm font-semibold text-gray-700">Tenant Feedback</h2>
        <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">PM Only — Not shared with tenant</span>
      </div>
      <p className="text-xs text-gray-400 mb-4">Post-tenancy performance record for {tenantName}. Once submitted this record is locked and visible to future PMs reviewing their applications.</p>

      <div className="space-y-4">
        {/* Ratings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Overall Rating <span className="text-red-500">*</span></label>
            <StarRating value={overall} onChange={setOverall} />
          </div>
          <div>
            <label className="label">Property Care</label>
            <StarRating value={propertyCare} onChange={setPropertyCare} />
          </div>
          <div>
            <label className="label">Rent Reliability</label>
            <StarRating value={rentReliability} onChange={setRentReliability} />
          </div>
          <div>
            <label className="label">Communication</label>
            <StarRating value={communication} onChange={setCommunication} />
          </div>
        </div>

        {/* Would rent again */}
        <div>
          <label className="label">Would You Rent to This Tenant Again? <span className="text-red-500">*</span></label>
          <div className="flex gap-2 mt-1">
            {(['YES', 'CONDITIONAL', 'NO'] as const).map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setWouldRentAgain(opt)}
                className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-colors ${
                  wouldRentAgain === opt
                    ? opt === 'YES' ? 'bg-green-100 border-green-400 text-green-700'
                      : opt === 'CONDITIONAL' ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                      : 'bg-red-100 border-red-400 text-red-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {opt === 'YES' ? 'Yes' : opt === 'CONDITIONAL' ? 'Conditional' : 'No'}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Internal Notes <span className="text-gray-400 font-normal">(not shown to tenant)</span></label>
          <textarea
            className="input h-20 resize-none"
            placeholder="e.g. Always paid on time, kept property in great condition, would recommend"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Notable Incidents <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            className="input"
            placeholder="e.g. Bond deducted $300 for carpet cleaning"
            value={incidents}
            onChange={e => setIncidents(e.target.value)}
          />
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-700">
          Once submitted this feedback is locked. Future PMs can see the overall rating and "Would Rent Again" answer when reviewing this tenant's applications — internal notes remain PM-only.
        </div>

        <button
          className={`btn-primary text-sm flex items-center gap-1.5 ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}`}
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
        >
          <Lock size={13} /> Submit &amp; Lock Tenant Feedback
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────
export default function LeaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const source = LEASES.find(l => l.id === id) ?? LEASES[0]

  // Core state
  const [leaseStatus, setLeaseStatus] = useState<LeaseStatus>(source.status)
  const [parties, setParties]         = useState<ESignParty[]>(source.parties)

  // Bond lodge gate
  const [bondLodged, setBondLodged]   = useState(false)

  // Key handover (only after bond lodged)
  const [keyDone, setKeyDone]         = useState(false)
  const [keyCount, setKeyCount]       = useState('2')
  const [keyRemote, setKeyRemote]     = useState('1')
  const [keyDate, setKeyDate]         = useState('1 May 2026')
  const [keyNotes, setKeyNotes]       = useState('')
  const [rentStart, setRentStart]     = useState('1 May 2026')

  // Entry PCR (created after key handover)
  const [entryPcrCreated, setEntryPcrCreated] = useState(false)

  // 60-day / tenancy actions
  const [simulate60, setSimulate60]         = useState(source.status === 'ACTIVE')
  const [tenancyAction, setTenancyAction]   = useState<
    'RENEWING' | 'NOT_RENEWING' |
    'EARLY_TERM_PM' | 'EARLY_TERM_TENANT' |
    'RENT_DEFAULT' | 'PCR_BREACH' | null
  >(null)
  // Sub-state for early termination
  const [termReason, setTermReason]         = useState('')
  const [termDate, setTermDate]             = useState('1 Jun 2026')
  // Sub-state for rent default
  const [defaultWeeks, setDefaultWeeks]     = useState('3')
  const [defaultNoticeIssued, setDefaultNoticeIssued] = useState(false)
  // Sub-state for PCR breach
  const [pcrBreachItems, setPcrBreachItems] = useState('')
  const [pcrNoticeIssued, setPcrNoticeIssued] = useState(false)

  // End checklist
  const [checklist, setChecklist]     = useState({ exitPcr: false, bondCalc: false, finalRent: false, keysReturned: false })

  // Modals
  const [confirmSend, setConfirmSend]         = useState(false)
  const [confirmActivate, setConfirmActivate] = useState(false)
  const [confirmNotice, setConfirmNotice]     = useState(false)
  const [confirmEnd, setConfirmEnd]           = useState(false)
  const [showRelistBanner, setShowRelistBanner] = useState(false)

  // Timeline
  const [timeline, setTimeline] = useState([
    { id: 't1', action: 'Lease draft generated',            actor: 'System',                  timestamp: '31 Mar 2026, 5:00pm' },
    { id: 't2', action: 'Application approved for offer',   actor: 'Sarah Mitchell (Agent)',   timestamp: '31 Mar 2026, 4:45pm' },
  ])

  const signedCount = parties.filter(p => p.status === 'SIGNED').length
  const allSigned   = signedCount === 3
  const isSentPhase = leaseStatus === 'SENT_FOR_SIGNATURE' || leaseStatus === 'PARTIALLY_SIGNED'
  const allChecksDone = Object.values(checklist).every(Boolean)

  function addTimeline(action: string, actor = 'Sarah Mitchell (Agent)') {
    setTimeline(prev => [{ id: `t${Date.now()}`, action, actor, timestamp: '1 Apr 2026' }, ...prev])
  }

  function sendForSignature() {
    setParties(prev => prev.map(p => ({ ...p, status: 'SENT' })))
    setLeaseStatus('SENT_FOR_SIGNATURE')
    addTimeline('Lease sent for e-signature — all parties notified', 'System')
    setConfirmSend(false)
  }

  function advanceParty(role: ESignParty['role'], next: ESignPartyStatus) {
    const updated = parties.map(p => p.role === role ? { ...p, status: next } : p)
    setParties(updated)
    if (next === 'SIGNED') {
      const n = updated.filter(p => p.status === 'SIGNED').length
      addTimeline(`${parties.find(p => p.role === role)?.name} signed the lease agreement`)
      if (n === 3) { setLeaseStatus('FULLY_SIGNED'); addTimeline('All parties signed — lease fully executed', 'System') }
      else if (n >= 1) setLeaseStatus('PARTIALLY_SIGNED')
    }
  }

  function activateLease() {
    setLeaseStatus('ACTIVE')
    addTimeline(`Lease activated — rent starts ${rentStart}`, 'System')
    setConfirmActivate(false)
  }

  function giveNotice(reason: string, actor = 'Sarah Mitchell (Agent)') {
    setLeaseStatus('NOTICE_GIVEN')
    setShowRelistBanner(true)
    addTimeline(reason, actor)
    addTimeline('Exit PCR created', 'System')
    setConfirmNotice(false)
  }

  function startVacating() {
    setLeaseStatus('VACATING')
    addTimeline('Lease entered vacating period')
  }

  function endTenancy() {
    setLeaseStatus('ENDED')
    addTimeline('Tenancy ended — tenant status changed to Former Tenant', 'System')
    addTimeline('Bond refund workflow initiated', 'System')
    setConfirmEnd(false)
  }

  const isSetupPhase   = ['GENERATED','SENT_FOR_SIGNATURE','PARTIALLY_SIGNED','FULLY_SIGNED'].includes(leaseStatus)
  const isTenancyPhase = ['ACTIVE','NOTICE_GIVEN','VACATING','ENDED'].includes(leaseStatus)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4" onClick={() => navigate('/pm/leases')}>
        <ArrowLeft size={14} /> Back to Leases
      </button>

      {/* Relist banner */}
      {showRelistBanner && (
        <div className="flex items-center gap-3 p-4 bg-pink-50 border border-pink-200 rounded-xl mb-4">
          <Home size={18} className="text-pink-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-pink-800">Tenant is vacating — relist this property?</p>
            <p className="text-sm text-pink-600">You can list the property now with a future available date so new applications come in before the tenant leaves.</p>
          </div>
          <button className="btn-primary text-sm" onClick={() => navigate('/pm/properties/prop-005')}>
            Relist Property <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">Residential Tenancy Agreement</h1>
              <StatusBadge status={leaseStatus} />
            </div>
            <p className="text-sm text-gray-500">{source.propertyAddress}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Tenant: {source.tenantName} · {source.agreementType} · {source.leaseStart} – {source.leaseEnd}
            </p>
          </div>
          <div className="flex gap-2">
            {isTenancyPhase && (
              <button className="btn-secondary text-sm flex items-center gap-1.5" onClick={() => navigate('/pm/rent/rent-001')}>
                <DollarSign size={13} /> Rent Ledger
              </button>
            )}
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <FileText size={13} /> Form 1AA
            </button>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <LeaseStepper current={leaseStatus} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">

          {/* ── E-SIGN TRACKER (setup phase) ─────────────────────── */}
          {isSetupPhase && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PenLine size={15} className="text-gray-400" />
                  <h2 className="text-sm font-semibold text-gray-700">E-Sign Tracker</h2>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  allSigned ? 'bg-green-100 text-green-700' : isSentPhase ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {allSigned ? 'All Signed ✓' : `${signedCount} / 3 Signed`}
                </span>
              </div>

              {isSentPhase && (
                <div className="mb-3">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full transition-all duration-500" style={{ width: `${(signedCount / 3) * 100}%` }} />
                  </div>
                </div>
              )}

              {allSigned && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg mb-3 text-sm text-green-700">
                  <CheckCircle2 size={15} /> <span className="font-medium">All parties signed. Confirm bond lodgement to proceed.</span>
                </div>
              )}
              {leaseStatus === 'GENERATED' && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg mb-3 text-sm text-blue-700">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  Click <strong className="mx-1">Send for Signature</strong> to dispatch the lease to all parties.
                </div>
              )}

              <div className="flex gap-3">
                {parties.map(party => (
                  <PartyCard key={party.role} party={party} onAdvance={advanceParty} disabled={!isSentPhase && !allSigned} />
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: BOND LODGEMENT (after fully signed) ──────── */}
          {leaseStatus === 'FULLY_SIGNED' && (
            <div className={`card p-4 ${bondLodged ? 'ring-2 ring-green-300 border-green-200' : 'ring-2 ring-blue-200 border-blue-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={15} className={bondLodged ? 'text-green-500' : 'text-blue-500'} />
                <h2 className="text-sm font-semibold text-gray-700">Step 1 — Bond Lodgement</h2>
                {bondLodged && <span className="text-xs text-green-600 font-semibold ml-auto">✓ Lodged</span>}
              </div>
              {bondLodged ? (
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 size={14} /> Bond lodged with DMIRS — proceed to key handover below.
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-3">The bond must be lodged with DMIRS before keys can be handed over. Complete the bond lodgement in the Bond module, then confirm here.</p>
                  <div className="flex items-center gap-3">
                    <button
                      className="btn-secondary text-sm flex items-center gap-1.5"
                      onClick={() => navigate('/pm/bonds')}
                    >
                      <DollarSign size={13} /> Go to Bond Module
                    </button>
                    <button
                      className="btn-primary text-sm flex items-center gap-1.5"
                      onClick={() => {
                        setBondLodged(true)
                        addTimeline('Bond lodgement confirmed — DMIRS reference recorded', 'System')
                      }}
                    >
                      <CheckCircle2 size={13} /> Confirm Bond Lodged
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── STEP 2: KEY HANDOVER (after bond lodged) ─────────── */}
          {leaseStatus === 'FULLY_SIGNED' && bondLodged && (
            <div className={`card p-4 ${keyDone ? 'ring-2 ring-green-300 border-green-200' : 'ring-2 ring-blue-200 border-blue-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Key size={15} className={keyDone ? 'text-green-500' : 'text-blue-500'} />
                <h2 className="text-sm font-semibold text-gray-700">Step 2 — Key Handover</h2>
                {keyDone && <span className="text-xs text-green-600 font-semibold ml-auto">✓ Recorded</span>}
              </div>
              {!keyDone ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Handover Date</label>
                    <input className="input" value={keyDate} onChange={e => setKeyDate(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="label">Keys</label>
                      <input className="input" type="number" value={keyCount} onChange={e => setKeyCount(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Remotes</label>
                      <input className="input" type="number" value={keyRemote} onChange={e => setKeyRemote(e.target.value)} />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="label">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
                    <input className="input" placeholder="e.g. Tenant collected keys in person" value={keyNotes} onChange={e => setKeyNotes(e.target.value)} />
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button className="btn-primary text-sm flex items-center gap-1.5" onClick={() => {
                      setKeyDone(true)
                      addTimeline(`Key handover recorded — ${keyCount} keys, ${keyRemote} remote(s) on ${keyDate}`)
                    }}>
                      <Key size={14} /> Record Key Handover
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><p className="text-xs text-gray-400">Date</p><p className="font-medium">{keyDate}</p></div>
                  <div><p className="text-xs text-gray-400">Keys Issued</p><p className="font-medium">{keyCount} sets</p></div>
                  <div><p className="text-xs text-gray-400">Remotes</p><p className="font-medium">{keyRemote}</p></div>
                  {keyNotes && <div className="col-span-3"><p className="text-xs text-gray-400">Notes</p><p className="font-medium">{keyNotes}</p></div>}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: ENTRY PCR (after key handover) ───────────── */}
          {leaseStatus === 'FULLY_SIGNED' && keyDone && (
            <div className={`card p-4 ${entryPcrCreated ? 'ring-2 ring-green-300 border-green-200' : 'ring-2 ring-blue-200 border-blue-100'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Clipboard size={15} className={entryPcrCreated ? 'text-green-500' : 'text-blue-500'} />
                <h2 className="text-sm font-semibold text-gray-700">Step 3 — Entry PCR</h2>
                {entryPcrCreated && <span className="text-xs text-green-600 font-semibold ml-auto">✓ Created</span>}
              </div>
              {entryPcrCreated ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 size={14} /> Entry PCR created — complete the inspection and submit for tenant review.
                  </div>
                  <button
                    className="btn-secondary text-sm flex items-center gap-1.5"
                    onClick={() => navigate('/pm/pcr/pcr-001')}
                  >
                    <Clipboard size={13} /> Open Entry PCR
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-3">Create the Entry PCR to document the property condition before the tenant moves in. This is a legal requirement.</p>
                  <button
                    className="btn-primary text-sm flex items-center gap-1.5"
                    onClick={() => {
                      setEntryPcrCreated(true)
                      addTimeline('Entry PCR created — property condition to be recorded before tenant move-in', 'System')
                    }}
                  >
                    <Clipboard size={14} /> Create Entry PCR
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STEP 4: ACTIVATE LEASE (after entry PCR created) ─── */}
          {leaseStatus === 'FULLY_SIGNED' && entryPcrCreated && (
            <div className="card p-4 ring-2 ring-blue-200 border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <Home size={15} className="text-blue-500" />
                <h2 className="text-sm font-semibold text-gray-700">Step 4 — Activate Lease</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="label">Rent Start Date</label>
                  <input className="input" value={rentStart} onChange={e => setRentStart(e.target.value)} />
                  <p className="text-xs text-gray-400 mt-1">First rent invoice will be pro-rated from this date</p>
                </div>
                <div className="flex flex-col justify-end">
                  <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-1.5 text-green-600"><CheckCircle2 size={12} /> Lease fully signed</div>
                    <div className="flex items-center gap-1.5 text-green-600"><CheckCircle2 size={12} /> Bond lodged</div>
                    <div className="flex items-center gap-1.5 text-green-600"><CheckCircle2 size={12} /> Keys handed over</div>
                    <div className="flex items-center gap-1.5 text-green-600"><CheckCircle2 size={12} /> Entry PCR created</div>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 mb-3">
                Activating will: set tenant status to Active · generate first rent invoice from {rentStart} · mark property as Tenanted
              </div>
              <button className="btn-primary text-sm flex items-center gap-1.5" onClick={() => setConfirmActivate(true)}>
                <Home size={14} /> Activate Lease
              </button>
            </div>
          )}

          {/* ── TENANCY ACTIONS (active lease) ───────────────────── */}
          {leaseStatus === 'ACTIVE' && (
            <div className={`card p-4 ${simulate60 ? 'ring-2 ring-orange-300 border-orange-200' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar size={15} className={simulate60 ? 'text-orange-500' : 'text-gray-400'} />
                  <h2 className="text-sm font-semibold text-gray-700">Tenancy Actions</h2>
                </div>
                <button
                  onClick={() => { setSimulate60(v => !v); setTenancyAction(null) }}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors"
                  style={simulate60
                    ? { background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa' }
                    : { background: '#f9fafb', color: '#6b7280', borderColor: '#e5e7eb' }
                  }
                >
                  {simulate60 ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                  {simulate60 ? '60-day warning ON' : 'Simulate 60-day warning'}
                </button>
              </div>

              {simulate60 && (
                <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg mb-4 text-sm text-orange-700">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">59 days until lease expiry — {source.leaseEnd}</p>
                    <p className="text-orange-600 text-xs mt-0.5">Contact the tenant to confirm their intention to renew or vacate.</p>
                  </div>
                </div>
              )}

              {/* Action grid — always visible for active leases */}
              {tenancyAction === null && (
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => setTenancyAction('RENEWING')}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-700 font-semibold text-sm hover:bg-green-100 transition-colors text-left">
                    <RefreshCw size={15} className="flex-shrink-0" />
                    <span>Tenant Renewing</span>
                  </button>
                  <button onClick={() => setTenancyAction('NOT_RENEWING')}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 transition-colors text-left">
                    <XCircle size={15} className="flex-shrink-0" />
                    <span>Tenant Not Renewing</span>
                  </button>
                  <button onClick={() => setTenancyAction('EARLY_TERM_PM')}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 border-orange-200 bg-orange-50 text-orange-700 font-semibold text-sm hover:bg-orange-100 transition-colors text-left">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>Early Termination (PM)</span>
                  </button>
                  <button onClick={() => setTenancyAction('EARLY_TERM_TENANT')}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 border-orange-200 bg-orange-50 text-orange-700 font-semibold text-sm hover:bg-orange-100 transition-colors text-left">
                    <XCircle size={15} className="flex-shrink-0" />
                    <span>Early Termination (Tenant)</span>
                  </button>
                  <button onClick={() => setTenancyAction('RENT_DEFAULT')}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 border-red-300 bg-red-50 text-red-800 font-semibold text-sm hover:bg-red-100 transition-colors text-left">
                    <DollarSign size={15} className="flex-shrink-0" />
                    <span>Rent Default / Arrears</span>
                  </button>
                  <button onClick={() => setTenancyAction('PCR_BREACH')}
                    className="flex items-center gap-2 p-3 rounded-xl border-2 border-yellow-200 bg-yellow-50 text-yellow-800 font-semibold text-sm hover:bg-yellow-100 transition-colors text-left">
                    <Clipboard size={15} className="flex-shrink-0" />
                    <span>PCR Breach (Quarterly)</span>
                  </button>
                </div>
              )}

              {/* ─ RENEWING ─ */}
              {tenancyAction === 'RENEWING' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-green-800">Tenant confirmed renewal</p>
                    <button onClick={() => setTenancyAction(null)} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
                  </div>
                  <p className="text-green-700 text-xs mb-3">Extend the current lease or create a new fixed-term agreement.</p>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-sm">Extend Current Lease</button>
                    <button className="btn-primary text-sm">Create Renewal Lease</button>
                  </div>
                </div>
              )}

              {/* ─ NOT RENEWING ─ */}
              {tenancyAction === 'NOT_RENEWING' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-red-800">Tenant not renewing — issue vacating notice</p>
                    <button onClick={() => setTenancyAction(null)} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
                  </div>
                  <p className="text-red-600 text-xs mb-3">Changes lease to Notice Given, creates Exit PCR, and allows property relisting.</p>
                  <button className="btn-danger text-sm" onClick={() => setConfirmNotice(true)}>Issue Vacating Notice</button>
                </div>
              )}

              {/* ─ EARLY TERMINATION — PM ─ */}
              {tenancyAction === 'EARLY_TERM_PM' && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-orange-800">Early Termination — issued by PM / Lessor</p>
                    <button onClick={() => setTenancyAction(null)} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
                  </div>
                  <p className="text-orange-700 text-xs">Issue Form 21 (Notice of Termination by Lessor). Minimum notice periods apply under WA law.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Termination Date</label>
                      <input className="input" value={termDate} onChange={e => setTermDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Reason (for Form 21)</label>
                      <input className="input" placeholder="e.g. Non-payment, property sale" value={termReason} onChange={e => setTermReason(e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-orange-100 border border-orange-200 rounded-lg p-2.5 text-xs text-orange-700">
                    WA law: Non-payment of rent — 7 days notice. Breach of agreement — 7 days. Sale of premises — 60 days.
                  </div>
                  <button className="btn-primary text-sm flex items-center gap-1.5" onClick={() => {
                    addTimeline(`Early termination initiated by PM — Form 21 issued. Reason: ${termReason || 'Not specified'}. Vacate by: ${termDate}`)
                    giveNotice(`Early termination by PM — Form 21 issued (${termReason || 'No reason'})`)
                  }}>
                    <Send size={13} /> Issue Form 21 &amp; Record Termination
                  </button>
                </div>
              )}

              {/* ─ EARLY TERMINATION — TENANT ─ */}
              {tenancyAction === 'EARLY_TERM_TENANT' && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-orange-800">Early Termination — requested by Tenant</p>
                    <button onClick={() => setTenancyAction(null)} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
                  </div>
                  <p className="text-orange-700 text-xs">Tenant has submitted Form 1A (Notice of Termination by Tenant). Record it and confirm the vacate date.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Tenant Vacate Date</label>
                      <input className="input" value={termDate} onChange={e => setTermDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Form 1A Reference</label>
                      <input className="input" placeholder="Form 1A received date or reference" value={termReason} onChange={e => setTermReason(e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-orange-100 border border-orange-200 rounded-lg p-2.5 text-xs text-orange-700">
                    Tenant must give 21 days written notice on a fixed-term lease or periodic tenancy (WA law). A break fee may apply.
                  </div>
                  <button className="btn-primary text-sm flex items-center gap-1.5" onClick={() => {
                    addTimeline(`Early termination by tenant — Form 1A received. Vacate date: ${termDate}`, 'Tenant')
                    giveNotice(`Early termination by tenant — Form 1A recorded. Vacate: ${termDate}`, 'Tenant')
                  }}>
                    <CheckCircle2 size={13} /> Record Tenant Termination
                  </button>
                </div>
              )}

              {/* ─ RENT DEFAULT ─ */}
              {tenancyAction === 'RENT_DEFAULT' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-red-800">Rent Default / Arrears</p>
                    <button onClick={() => setTenancyAction(null)} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Weeks in Arrears</label>
                      <input className="input" type="number" value={defaultWeeks} onChange={e => setDefaultWeeks(e.target.value)} />
                    </div>
                    <div className="flex flex-col justify-end">
                      <p className="text-xs text-red-600">Outstanding: <span className="font-bold">${(parseInt(defaultWeeks) * source.weeklyRent).toLocaleString()}</span></p>
                    </div>
                  </div>
                  <div className="bg-red-100 border border-red-200 rounded-lg p-2.5 text-xs text-red-700">
                    WA law: Issue a breach notice (Form 20) once rent is 7+ days overdue. If unpaid after 7 days, Form 21 can be issued. Tenant has right to remedy.
                  </div>
                  {!defaultNoticeIssued ? (
                    <div className="flex gap-2">
                      <button className="btn-secondary text-sm" onClick={() => navigate('/pm/rent/rent-001')}>
                        <DollarSign size={13} /> View Rent Ledger
                      </button>
                      <button className="btn-danger text-sm flex items-center gap-1.5" onClick={() => {
                        setDefaultNoticeIssued(true)
                        addTimeline(`Breach notice issued — tenant ${defaultWeeks} weeks in arrears ($${(parseInt(defaultWeeks) * source.weeklyRent).toLocaleString()})`)
                      }}>
                        <Send size={13} /> Issue Breach Notice (Form 20)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-700 text-xs font-medium"><CheckCircle2 size={12} /> Breach notice issued — tenant has 7 days to remedy</div>
                      <button className="btn-danger text-sm flex items-center gap-1.5" onClick={() => {
                        addTimeline('Form 21 issued — non-payment of rent. Tenancy to be terminated.')
                        giveNotice('Tenancy terminated — non-payment of rent (Form 21 issued)')
                      }}>
                        <AlertCircle size={13} /> Escalate — Issue Form 21 (Termination)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ─ PCR BREACH ─ */}
              {tenancyAction === 'PCR_BREACH' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-yellow-800">PCR Breach — Quarterly Inspection</p>
                    <button onClick={() => setTenancyAction(null)} className="text-xs text-gray-400 hover:text-gray-600">← Back</button>
                  </div>
                  <p className="text-yellow-700 text-xs">The quarterly inspection found conditions not meeting the standard required by the tenancy agreement.</p>
                  <div>
                    <label className="label">Items Not Met (from PCR)</label>
                    <input className="input" placeholder="e.g. Walls damaged, carpet stained, garden unkempt" value={pcrBreachItems} onChange={e => setPcrBreachItems(e.target.value)} />
                  </div>
                  <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-2.5 text-xs text-yellow-700">
                    First step: issue a written breach notice and allow the tenant reasonable time to remedy. If not remedied, Form 21 can follow.
                  </div>
                  {!pcrNoticeIssued ? (
                    <div className="flex gap-2">
                      <button className="btn-secondary text-sm flex items-center gap-1.5" onClick={() => navigate('/pm/pcr/pcr-quarterly')}>
                        <Clipboard size={13} /> View Quarterly PCR
                      </button>
                      <button className="btn-primary text-sm flex items-center gap-1.5" disabled={!pcrBreachItems.trim()} onClick={() => {
                        setPcrNoticeIssued(true)
                        addTimeline(`PCR breach notice issued — items: ${pcrBreachItems}`)
                      }}>
                        <Send size={13} /> Issue Breach Notice
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-700 text-xs font-medium"><CheckCircle2 size={12} /> Breach notice issued — tenant has 14 days to remedy</div>
                      <div className="flex gap-2">
                        <button className="btn-secondary text-sm" onClick={() => navigate('/pm/pcr/pcr-quarterly')}>Follow Up in PCR</button>
                        <button className="btn-danger text-sm flex items-center gap-1.5" onClick={() => {
                          addTimeline('PCR breach unresolved — Form 21 issued. Tenancy to be terminated.')
                          giveNotice('Tenancy terminated — PCR breach unresolved after notice period (Form 21 issued)')
                        }}>
                          <AlertCircle size={13} /> Escalate — Issue Form 21
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── NOTICE GIVEN ─────────────────────────────────────── */}
          {leaseStatus === 'NOTICE_GIVEN' && (
            <div className="card p-4 ring-2 ring-orange-300 border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={15} className="text-orange-500" />
                <h2 className="text-sm font-semibold text-gray-700">Notice of Vacation</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                <div><p className="text-xs text-gray-400">Notice Issued</p><p className="font-medium">1 Feb 2027</p></div>
                <div><p className="text-xs text-gray-400">Vacate Date</p><p className="font-medium">{source.leaseEnd}</p></div>
                <div><p className="text-xs text-gray-400">Days Remaining</p><p className="font-semibold text-orange-600">88 days</p></div>
              </div>
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-xs text-orange-700 mb-3">
                Exit PCR has been created. You can relist this property now with a future available date.
              </div>
              <div className="flex gap-2">
                <button className="btn-primary text-sm" onClick={() => navigate('/pm/pcr/pcr-exit')}>
                  <Clipboard size={13} /> View Exit PCR
                </button>
                <button className="btn-secondary text-sm" onClick={() => navigate('/pm/properties/prop-005')}>
                  <Home size={13} /> Relist Property
                </button>
                <button className="btn-ghost text-sm text-orange-600" onClick={startVacating}>
                  Mark as Vacating →
                </button>
              </div>
            </div>
          )}

          {/* ── VACATING / END CHECKLIST ──────────────────────────── */}
          {leaseStatus === 'VACATING' && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clipboard size={15} className="text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700">End of Tenancy Checklist</h2>
              </div>
              <div className="space-y-2 mb-4">
                <CheckItem label="Exit PCR finalized" checked={checklist.exitPcr} onChange={() => setChecklist(c => ({ ...c, exitPcr: !c.exitPcr }))} />
                <CheckItem label="Bond deduction amount calculated" checked={checklist.bondCalc} onChange={() => setChecklist(c => ({ ...c, bondCalc: !c.bondCalc }))} />
                <CheckItem label="Final rent invoice settled" checked={checklist.finalRent} onChange={() => setChecklist(c => ({ ...c, finalRent: !c.finalRent }))} />
                <CheckItem label="Keys returned by tenant" checked={checklist.keysReturned} onChange={() => setChecklist(c => ({ ...c, keysReturned: !c.keysReturned }))} />
              </div>
              {!allChecksDone && (
                <p className="text-xs text-gray-400 mb-3">Complete all checklist items to end the tenancy.</p>
              )}
              <button
                className={`btn-danger text-sm ${!allChecksDone ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={!allChecksDone}
                onClick={() => allChecksDone && setConfirmEnd(true)}
              >
                End Tenancy
              </button>
            </div>
          )}

          {/* ── ENDED SUMMARY ─────────────────────────────────────── */}
          {leaseStatus === 'ENDED' && (
            <div className="card p-4 bg-gray-50 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={15} className="text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-700">Tenancy Ended</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                <div><p className="text-xs text-gray-400">Lease End</p><p className="font-medium">{source.leaseEnd}</p></div>
                <div><p className="text-xs text-gray-400">Tenant Status</p><p className="font-medium text-gray-500">Former Tenant</p></div>
                <div><p className="text-xs text-gray-400">Bond</p><p className="font-medium text-blue-600">Disposal Required</p></div>
              </div>
              {source.bondId && (
                <button className="btn-secondary text-sm flex items-center gap-1.5" onClick={() => navigate(`/pm/bonds/${source.bondId}`)}>
                  <DollarSign size={13} /> Go to Bond Disposal
                </button>
              )}
            </div>
          )}

          {/* ── TENANT FEEDBACK (after ended) ────────────────────── */}
          {leaseStatus === 'ENDED' && (
            <TenantFeedbackPanel tenantName={source.tenantName} />
          )}

          {/* ── LEASE DETAILS ──────────────────────────────────────── */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">Lease Details</h2>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><p className="text-xs text-gray-400">Agreement Type</p><p className="font-medium">{source.agreementType}</p></div>
              <div><p className="text-xs text-gray-400">Start</p><p className="font-medium">{source.leaseStart}</p></div>
              <div><p className="text-xs text-gray-400">End</p><p className="font-medium">{source.leaseEnd}</p></div>
              <div><p className="text-xs text-gray-400">Weekly Rent</p><p className="font-semibold text-green-700">${source.weeklyRent}</p></div>
              <div><p className="text-xs text-gray-400">Bond</p><p className="font-semibold text-blue-700">${source.bondAmount.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-400">Lessor</p><p className="font-medium">{source.lessorName}</p></div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Activity Timeline</h2>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gray-200" />
              <div className="space-y-3">
                {timeline.map(e => (
                  <div key={e.id} className="relative">
                    <div className="absolute -left-3 top-1.5 w-2 h-2 rounded-full bg-blue-400 border-2 border-white" />
                    <p className="text-sm text-gray-800 font-medium">{e.action}</p>
                    <p className="text-xs text-gray-400">{e.actor} · {e.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Actions</p>
            <div className="space-y-2">
              {leaseStatus === 'GENERATED' && (
                <button className="btn-primary w-full text-sm flex items-center justify-center gap-1.5" onClick={() => setConfirmSend(true)}>
                  <Send size={14} /> Send for Signature
                </button>
              )}
              {(leaseStatus === 'SENT_FOR_SIGNATURE' || leaseStatus === 'PARTIALLY_SIGNED') && (
                <>
                  <div className="text-xs bg-gray-50 rounded-lg p-2.5 border space-y-1">
                    {parties.map(p => (
                      <div key={p.role} className="flex justify-between">
                        <span className="text-gray-500">{PARTY_LABELS[p.role]}</span>
                        <span className={p.status === 'SIGNED' ? 'text-green-600 font-semibold' : 'text-gray-400'}>{p.status === 'SIGNED' ? '✓' : p.status}</span>
                      </div>
                    ))}
                  </div>
                  <button className="btn-secondary w-full text-sm">
                    <Send size={13} /> Resend Reminder
                  </button>
                </>
              )}
              {leaseStatus === 'FULLY_SIGNED' && !keyDone && (
                <div className="text-xs text-blue-600 font-medium flex items-center gap-1.5">
                  <Key size={13} /> Record key handover to continue
                </div>
              )}
              {leaseStatus === 'FULLY_SIGNED' && keyDone && (
                <div className="text-xs text-blue-600 font-medium flex items-center gap-1.5">
                  <Home size={13} /> Set rent start date then activate
                </div>
              )}
              {leaseStatus === 'ACTIVE' && (
                <>
                  <button className="btn-secondary w-full text-sm flex items-center justify-center gap-1.5" onClick={() => navigate('/pm/pcr/pcr-001')}>
                    <Clipboard size={13} /> Entry PCR
                  </button>
                  <button className="btn-secondary w-full text-sm flex items-center justify-center gap-1.5" onClick={() => navigate('/pm/rent/rent-001')}>
                    <DollarSign size={13} /> Rent Ledger
                  </button>
                  <button className="btn-ghost w-full text-sm flex items-center justify-center gap-1.5 text-blue-600" onClick={() => navigate('/pm/pcr/pcr-quarterly')}>
                    <Clipboard size={13} /> + New Inspection
                  </button>
                </>
              )}
              {leaseStatus === 'FULLY_SIGNED' && (
                <button className="btn-secondary w-full text-sm flex items-center justify-center gap-1.5" onClick={() => navigate(`/pm/bonds/${source.bondId}`)}>
                  <DollarSign size={14} /> View Bond
                </button>
              )}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Dates</p>
            <div className="space-y-2 text-sm">
              <div><p className="text-xs text-gray-400">Lease Start</p><p className="font-medium">{source.leaseStart}</p></div>
              <div><p className="text-xs text-gray-400">Lease End</p><p className="font-medium">{source.leaseEnd}</p></div>
              {keyDone && <div><p className="text-xs text-gray-400">Keys Issued</p><p className="font-medium">{keyDate}</p></div>}
              {leaseStatus === 'ACTIVE' && <div><p className="text-xs text-gray-400">Rent Start</p><p className="font-medium">{rentStart}</p></div>}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Documents</p>
            <div className="space-y-1.5">
              {['Form 1AA (Lease)', 'Form 1AC (Info for Tenant)'].map(doc => (
                <div key={doc} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FileText size={12} className="text-blue-500" />
                  <span className="text-xs text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {confirmSend && (
        <ConfirmModal title="Send Lease for Signature?" message="This will email the Form 1AA to the Lessor, Tenant, and Agent for e-signing via a secure link." confirmLabel="Send for Signature" variant="primary" onConfirm={sendForSignature} onCancel={() => setConfirmSend(false)} />
      )}
      {confirmActivate && (
        <ConfirmModal title="Activate Lease?" message={`Rent will start from ${rentStart}. The Entry PCR will be created and the tenant's status will change to Active.`} confirmLabel="Activate Lease" variant="primary" onConfirm={activateLease} onCancel={() => setConfirmActivate(false)} />
      )}
      {confirmNotice && (
        <ConfirmModal title="Issue Notice of Vacation?" message="The lease will move to Notice Given. An Exit PCR will be created and you'll be prompted to relist the property with a future available date." confirmLabel="Issue Notice" variant="danger" onConfirm={() => giveNotice('Notice of vacation given — tenant not renewing')} onCancel={() => setConfirmNotice(false)} />
      )}
      {confirmEnd && (
        <ConfirmModal title="End Tenancy?" message="This will permanently close the lease. The tenant will become a Former Tenant with read-only access. The bond refund workflow will be initiated." confirmLabel="End Tenancy" variant="danger" onConfirm={endTenancy} onCancel={() => setConfirmEnd(false)} />
      )}
    </div>
  )
}
