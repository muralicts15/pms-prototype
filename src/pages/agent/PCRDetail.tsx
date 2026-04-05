import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Camera, Clipboard } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import type { PCRType, PCRStatus, Condition, PCRSection, PCRItem } from '../../types'

// ─── Condition config ────────────────────────────────────────────
const CONDITIONS: { key: Condition; label: string; color: string; bg: string }[] = [
  { key: 'EXCELLENT', label: 'Exc',  color: 'text-green-700',  bg: 'bg-green-100 border-green-400' },
  { key: 'GOOD',      label: 'Good', color: 'text-blue-700',   bg: 'bg-blue-100 border-blue-400' },
  { key: 'FAIR',      label: 'Fair', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-400' },
  { key: 'POOR',      label: 'Poor', color: 'text-red-700',    bg: 'bg-red-100 border-red-400' },
  { key: 'NA',        label: 'N/A',  color: 'text-gray-500',   bg: 'bg-gray-100 border-gray-300' },
]

const CONDITION_DOT: Record<Condition, string> = {
  EXCELLENT: 'bg-green-500', GOOD: 'bg-blue-500',
  FAIR: 'bg-yellow-400', POOR: 'bg-red-500', NA: 'bg-gray-300',
}

function ConditionPicker({ value, onChange, size = 'md' }: { value: Condition; onChange: (v: Condition) => void; size?: 'sm' | 'md' }) {
  return (
    <div className="flex gap-1">
      {CONDITIONS.map(c => (
        <button
          key={c.key}
          onClick={() => onChange(c.key)}
          className={`rounded border font-medium transition-all ${
            size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
          } ${value === c.key ? `${c.bg} ${c.color} border-current` : 'bg-white border-gray-200 text-gray-400 hover:border-gray-400'}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}

// ─── PCR Status stepper ──────────────────────────────────────────
function PCRStepper({ type, current }: { type: PCRType; current: PCRStatus }) {
  const steps: PCRStatus[] = type === 'QUARTERLY'
    ? ['DRAFT', 'IN_PROGRESS', 'FINALIZED']
    : ['DRAFT', 'IN_PROGRESS', 'AWAITING_TENANT_REVIEW', 'DISPUTED', 'FINALIZED']

  const labels: Partial<Record<PCRStatus, string>> = {
    DRAFT: 'Draft', IN_PROGRESS: 'In Progress',
    AWAITING_TENANT_REVIEW: 'Tenant Review', DISPUTED: 'Disputed',
    RESOLUTION_IN_PROGRESS: 'Resolving', FINALIZED: 'Finalized',
  }
  const idx = steps.indexOf(current)
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done   = i < idx
        const active = i === idx
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                done ? 'bg-green-500 border-green-500 text-white' :
                active ? 'bg-blue-600 border-blue-600 text-white scale-110' :
                'bg-white border-gray-200 text-gray-400'
              }`}>{done ? <CheckCircle2 size={14} /> : i + 1}</div>
              <span className={`text-[9px] mt-1 whitespace-nowrap font-medium ${done ? 'text-green-600' : active ? 'text-blue-700' : 'text-gray-400'}`}>
                {labels[step]}
              </span>
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 w-12 mx-1 mb-4 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}

// ─── Default sections builder ─────────────────────────────────────
function buildSections(type: PCRType): PCRSection[] {
  const base: PCRSection[] = [
    {
      id: 's1', name: 'Living / Dining', overallCondition: 'GOOD', open: true,
      items: [
        { id: 'i1', name: 'Walls',           condition: 'GOOD', notes: '' },
        { id: 'i2', name: 'Ceiling',         condition: 'GOOD', notes: '' },
        { id: 'i3', name: 'Floor / Carpet',  condition: 'GOOD', notes: '' },
        { id: 'i4', name: 'Windows & Blinds',condition: 'GOOD', notes: '' },
        { id: 'i5', name: 'Light Fittings',  condition: 'GOOD', notes: '' },
      ],
    },
    {
      id: 's2', name: 'Kitchen', overallCondition: 'GOOD', open: false,
      items: [
        { id: 'i6', name: 'Benchtops',      condition: 'GOOD', notes: '' },
        { id: 'i7', name: 'Sink & Taps',    condition: 'GOOD', notes: '' },
        { id: 'i8', name: 'Oven / Cooktop', condition: 'GOOD', notes: '' },
        { id: 'i9', name: 'Rangehood',      condition: 'GOOD', notes: '' },
        { id: 'i10', name: 'Cupboards',     condition: 'GOOD', notes: '' },
      ],
    },
    {
      id: 's3', name: 'Bedroom 1', overallCondition: 'GOOD', open: false,
      items: [
        { id: 'i11', name: 'Walls',    condition: 'GOOD', notes: '' },
        { id: 'i12', name: 'Ceiling',  condition: 'GOOD', notes: '' },
        { id: 'i13', name: 'Floor',    condition: 'GOOD', notes: '' },
        { id: 'i14', name: 'Wardrobe', condition: 'GOOD', notes: '' },
        { id: 'i15', name: 'Windows',  condition: 'GOOD', notes: '' },
      ],
    },
    {
      id: 's4', name: 'Bedroom 2', overallCondition: 'GOOD', open: false,
      items: [
        { id: 'i16', name: 'Walls',    condition: 'GOOD', notes: '' },
        { id: 'i17', name: 'Ceiling',  condition: 'GOOD', notes: '' },
        { id: 'i18', name: 'Floor',    condition: 'GOOD', notes: '' },
        { id: 'i19', name: 'Wardrobe', condition: 'GOOD', notes: '' },
      ],
    },
    {
      id: 's5', name: 'Bathroom', overallCondition: 'GOOD', open: false,
      items: [
        { id: 'i20', name: 'Shower / Bath', condition: 'GOOD', notes: '' },
        { id: 'i21', name: 'Toilet',        condition: 'GOOD', notes: '' },
        { id: 'i22', name: 'Vanity & Taps', condition: 'GOOD', notes: '' },
        { id: 'i23', name: 'Tiles / Floor', condition: 'GOOD', notes: '' },
      ],
    },
    {
      id: 's6', name: 'General', overallCondition: 'GOOD', open: false,
      items: [
        { id: 'i24', name: 'Smoke Alarms',  condition: 'EXCELLENT', notes: '' },
        { id: 'i25', name: 'Door Locks',    condition: 'GOOD', notes: '' },
        { id: 'i26', name: 'Meter Readings',condition: 'NA',  notes: 'Elec: 4521 kWh · Gas: 892 MJ' },
      ],
    },
  ]
  // For EXIT, seed exit conditions slightly worse on a couple items to show comparison
  if (type === 'EXIT') {
    return base.map(sec => ({
      ...sec,
      items: sec.items.map(item => {
        const entryCondition = item.condition as Condition
        // Make a couple things worse for EXIT demo
        const worse = (item.id === 'i3' || item.id === 'i13') ? 'POOR' as Condition : entryCondition
        return { ...item, entryCondition, condition: worse }
      }),
    }))
  }
  return base
}

// ─── Comparison row for EXIT PCR ─────────────────────────────────
function ComparisonItem({ item, onDisputeToggle, tenantMode }: {
  item: PCRItem
  onDisputeToggle?: (id: string) => void
  tenantMode?: boolean
}) {
  const isWorse = item.entryCondition !== undefined && (
    ['EXCELLENT','GOOD','FAIR','POOR'].indexOf(item.condition) >
    ['EXCELLENT','GOOD','FAIR','POOR'].indexOf(item.entryCondition)
  )
  return (
    <div className={`flex items-center gap-3 py-2 px-2 rounded-lg ${isWorse ? 'bg-red-50' : ''}`}>
      <span className="text-sm text-gray-700 w-36 flex-shrink-0">{item.name}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${CONDITION_DOT[item.entryCondition ?? 'NA']}`} />
        <span className="text-xs text-gray-500">{item.entryCondition ?? 'NA'}</span>
      </div>
      <span className="text-gray-300">→</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${CONDITION_DOT[item.condition]}`} />
        <span className={`text-xs font-semibold ${isWorse ? 'text-red-600' : 'text-gray-700'}`}>{item.condition}</span>
        {isWorse && <AlertCircle size={11} className="text-red-500" />}
      </div>
      {item.notes && <span className="text-xs text-gray-400 flex-1 truncate">{item.notes}</span>}
      {tenantMode && isWorse && onDisputeToggle && (
        <button
          onClick={() => onDisputeToggle(item.id)}
          className={`text-xs px-2 py-0.5 rounded border font-medium transition-colors flex-shrink-0 ${
            item.disputed ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'
          }`}
        >
          {item.disputed ? '⚠ Disputed' : 'Dispute'}
        </button>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────
export default function PCRDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Determine type from URL param for prototype navigation
  const type: PCRType = id === 'pcr-quarterly' ? 'QUARTERLY' : id === 'pcr-exit' ? 'EXIT' : 'ENTRY'
  const typeLabels = { ENTRY: 'Entry PCR', QUARTERLY: 'Quarterly Inspection', EXIT: 'Exit PCR' }
  const typeColors = { ENTRY: 'bg-blue-50 text-blue-700', QUARTERLY: 'bg-teal-50 text-teal-700', EXIT: 'bg-orange-50 text-orange-700' }

  const initStatus: PCRStatus = 'IN_PROGRESS'
  const [pcrStatus, setPcrStatus]   = useState<PCRStatus>(initStatus)
  const [sections, setSections]     = useState<PCRSection[]>(() => buildSections(type))
  const [activeTab, setActiveTab]   = useState<'pm' | 'tenant'>('pm')
  const [bondDeduction, setBondDeduction] = useState('')
  const [confirmFinalize, setConfirmFinalize]     = useState(false)
  const [confirmSubmitReview, setConfirmSubmitReview] = useState(false)
  const [inspectionDate, setInspectionDate]       = useState('1 May 2026')
  const [inspectorName, setInspectorName]         = useState('Sarah Mitchell')
  const [pmNotes, setPmNotes]                     = useState('')

  function toggleSection(sectionId: string) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, open: !s.open } : s))
  }

  function updateItem(sectionId: string, itemId: string, field: 'condition' | 'notes', value: string) {
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) }
        : s
    ))
  }

  function updateOverall(sectionId: string, condition: Condition) {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, overallCondition: condition } : s))
  }

  function toggleDispute(sectionId: string, itemId: string) {
    setSections(prev => prev.map(s =>
      s.id === sectionId
        ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, disputed: !i.disputed } : i) }
        : s
    ))
  }

  function submitForReview() {
    setPcrStatus('AWAITING_TENANT_REVIEW')
    setConfirmSubmitReview(false)
    setActiveTab('tenant')
  }

  function tenantSubmitReview() {
    const hasDisputes = sections.some(s => s.items.some(i => i.disputed))
    setPcrStatus(hasDisputes ? 'DISPUTED' : 'FINALIZED')
  }

  function resolveDisputes() {
    setSections(prev => prev.map(s => ({ ...s, items: s.items.map(i => ({ ...i, disputed: false, resolved: true })) })))
    setPcrStatus('FINALIZED')
  }

  function finalizePCR() {
    setPcrStatus('FINALIZED')
    setConfirmFinalize(false)
  }

  const isTenantTab   = activeTab === 'tenant'
  const disputedCount = sections.flatMap(s => s.items).filter(i => i.disputed).length
  const worseCount    = sections.flatMap(s => s.items).filter(i =>
    i.entryCondition !== undefined &&
    ['EXCELLENT','GOOD','FAIR','POOR'].indexOf(i.condition) > ['EXCELLENT','GOOD','FAIR','POOR'].indexOf(i.entryCondition)
  ).length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4" onClick={() => navigate('/pm/pcr')}>
        <ArrowLeft size={14} /> Back to PCRs
      </button>

      {/* Header */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColors[type]}`}>{type}</span>
              <h1 className="text-xl font-bold text-gray-900">{typeLabels[type]}</h1>
              <StatusBadge status={pcrStatus} />
            </div>
            <p className="text-sm text-gray-500">33 Hay St, Subiaco WA 6008 · Tenant: Sarah Johnson</p>
            <p className="text-xs text-gray-400 mt-0.5">Inspection date: {inspectionDate} · Inspector: {inspectorName}</p>
          </div>
          {pcrStatus === 'FINALIZED' && (
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <Clipboard size={13} /> Download PDF
            </button>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <PCRStepper type={type} current={pcrStatus} />
        </div>
      </div>

      {/* Finalized banner */}
      {pcrStatus === 'FINALIZED' && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
          <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-800">PCR Finalized</p>
            <p className="text-sm text-green-600">
              {type === 'EXIT' && bondDeduction ? `Bond deduction: $${bondDeduction} — ` : ''}
              This PCR is now legally recorded and cannot be modified.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">

          {/* Tab switcher (entry/exit only) */}
          {type !== 'QUARTERLY' && pcrStatus !== 'IN_PROGRESS' && pcrStatus !== 'DRAFT' && (
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button onClick={() => setActiveTab('pm')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'pm' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>PM View</button>
              <button onClick={() => setActiveTab('tenant')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === 'tenant' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                Tenant View
                {disputedCount > 0 && <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">{disputedCount}</span>}
              </button>
            </div>
          )}

          {/* EXIT — comparison table */}
          {type === 'EXIT' && activeTab === 'pm' && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">Entry vs Exit Comparison</h2>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300" /> Entry</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Exit</span>
                  {worseCount > 0 && <span className="flex items-center gap-1 text-red-600 font-semibold"><AlertCircle size={11} /> {worseCount} condition change{worseCount > 1 ? 's' : ''}</span>}
                </div>
              </div>
              {sections.map(sec => (
                <div key={sec.id} className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{sec.name}</p>
                  <div className="divide-y divide-gray-100">
                    {sec.items.map(item => (
                      <ComparisonItem key={item.id} item={item} tenantMode={isTenantTab} />
                    ))}
                  </div>
                </div>
              ))}
              {pcrStatus !== 'FINALIZED' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <label className="label">Bond Deduction Amount ($)</label>
                  <div className="flex gap-2">
                    <input className="input flex-1" placeholder="Enter deduction based on damage assessment" value={bondDeduction} onChange={e => setBondDeduction(e.target.value)} />
                    <span className="text-sm text-gray-500 self-center">of $1,920 bond</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tenant review tab */}
          {activeTab === 'tenant' && type !== 'QUARTERLY' && pcrStatus !== 'IN_PROGRESS' && (
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={15} className="text-yellow-500" />
                <h2 className="text-sm font-semibold text-gray-700">Tenant Review</h2>
                <span className="text-xs text-gray-400 ml-auto">Click "Dispute" on any item you disagree with</span>
              </div>
              {sections.map(sec => (
                <div key={sec.id} className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{sec.name}</p>
                  <div className="divide-y divide-gray-100">
                    {sec.items.filter(i => type === 'EXIT' ? (i.entryCondition !== undefined) : true).map(item => (
                      <ComparisonItem
                        key={item.id} item={item}
                        onDisputeToggle={(itemId) => toggleDispute(sec.id, itemId)}
                        tenantMode
                      />
                    ))}
                  </div>
                </div>
              ))}
              {pcrStatus === 'AWAITING_TENANT_REVIEW' && (
                <button className="btn-primary text-sm mt-2" onClick={tenantSubmitReview}>
                  Submit Tenant Review
                </button>
              )}
              {pcrStatus === 'DISPUTED' && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="text-sm font-semibold text-orange-700 mb-1">{disputedCount} dispute{disputedCount > 1 ? 's' : ''} raised by tenant</p>
                  <button className="btn-secondary text-sm" onClick={resolveDisputes}>Mark All Resolved</button>
                </div>
              )}
            </div>
          )}

          {/* PM condition form (entry/quarterly, or exit PM tab) */}
          {(type !== 'EXIT' || activeTab === 'pm') && pcrStatus !== 'FINALIZED' && (
            sections.map(section => (
              <div key={section.id} className="card overflow-hidden">
                <button
                  className="flex items-center justify-between w-full p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${CONDITION_DOT[section.overallCondition]}`} />
                    <span className="text-sm font-semibold text-gray-800">{section.name}</span>
                    <span className="text-xs text-gray-400">({section.items.length} items)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {!section.open && (
                      <ConditionPicker value={section.overallCondition} onChange={v => updateOverall(section.id, v)} size="sm" />
                    )}
                    {section.open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </button>

                {section.open && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="mt-3 mb-3 flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-500">Section Overall:</span>
                      <ConditionPicker value={section.overallCondition} onChange={v => updateOverall(section.id, v)} />
                    </div>
                    <div className="space-y-2">
                      {section.items.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          <span className="text-sm text-gray-700 w-36 flex-shrink-0">{item.name}</span>
                          <ConditionPicker value={item.condition} onChange={v => updateItem(section.id, item.id, 'condition', v)} />
                          <input
                            className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-1 focus:ring-blue-400"
                            placeholder="Notes (optional)"
                            value={item.notes}
                            onChange={e => updateItem(section.id, item.id, 'notes', e.target.value)}
                          />
                          <button className="text-gray-300 hover:text-blue-400 flex-shrink-0" title="Add photo">
                            <Camera size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}

          {/* Finalized — read-only section list */}
          {pcrStatus === 'FINALIZED' && activeTab === 'pm' && type !== 'EXIT' && (
            <div className="card p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Condition Summary</h2>
              <div className="space-y-2">
                {sections.map(sec => (
                  <div key={sec.id} className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${CONDITION_DOT[sec.overallCondition]}`} />
                    <span className="text-sm text-gray-700 flex-1">{sec.name}</span>
                    <span className="text-xs font-semibold text-gray-500">{sec.overallCondition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Actions</p>
            <div className="space-y-2">

              {pcrStatus === 'IN_PROGRESS' && type === 'QUARTERLY' && (
                <button className="btn-primary w-full text-sm" onClick={() => setConfirmFinalize(true)}>
                  Finalize Inspection
                </button>
              )}
              {pcrStatus === 'IN_PROGRESS' && type !== 'QUARTERLY' && (
                <button className="btn-primary w-full text-sm" onClick={() => setConfirmSubmitReview(true)}>
                  Submit for Tenant Review
                </button>
              )}
              {pcrStatus === 'AWAITING_TENANT_REVIEW' && (
                <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-2.5">
                  Awaiting tenant review. Switch to Tenant View tab to simulate.
                </div>
              )}
              {pcrStatus === 'DISPUTED' && (
                <button className="btn-primary w-full text-sm" onClick={resolveDisputes}>
                  Resolve All Disputes
                </button>
              )}
              {pcrStatus === 'FINALIZED' && (
                <div className="text-xs text-green-700 font-medium flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> PCR Finalized
                </div>
              )}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Inspection Details</p>
            <div className="space-y-2">
              <div>
                <label className="label">Date</label>
                <input className="input" value={inspectionDate} onChange={e => setInspectionDate(e.target.value)} disabled={pcrStatus === 'FINALIZED'} />
              </div>
              <div>
                <label className="label">Inspector</label>
                <input className="input" value={inspectorName} onChange={e => setInspectorName(e.target.value)} disabled={pcrStatus === 'FINALIZED'} />
              </div>
              <div>
                <label className="label">PM Notes <span className="text-gray-400 font-normal text-[10px]">Internal</span></label>
                <textarea className="input resize-none text-xs" rows={2} value={pmNotes} onChange={e => setPmNotes(e.target.value)} placeholder="Internal notes..." disabled={pcrStatus === 'FINALIZED'} />
              </div>
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Condition Legend</p>
            <div className="space-y-1.5">
              {CONDITIONS.filter(c => c.key !== 'NA').map(c => (
                <div key={c.key} className="flex items-center gap-2 text-xs">
                  <span className={`w-2 h-2 rounded-full ${CONDITION_DOT[c.key]}`} />
                  <span className={`font-semibold ${c.color}`}>{c.key}</span>
                  <span className="text-gray-400">
                    {c.key === 'EXCELLENT' ? '— Like new, no marks' :
                     c.key === 'GOOD'      ? '— Normal wear, clean' :
                     c.key === 'FAIR'      ? '— Noticeable wear' :
                                            '— Damage / needs repair'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {type === 'EXIT' && pcrStatus !== 'FINALIZED' && (
            <div className="card p-4 bg-amber-50 border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Bond Deductions</p>
              <p className="text-xs text-amber-600">Any items marked POOR at exit (that were GOOD at entry) may be deducted from the bond. Record the total deduction amount before finalizing.</p>
            </div>
          )}
        </div>
      </div>

      {confirmSubmitReview && (
        <ConfirmModal title="Submit for Tenant Review?" message="The PCR will be sent to the tenant for review. They can accept or raise disputes on each item." confirmLabel="Submit for Review" variant="primary" onConfirm={submitForReview} onCancel={() => setConfirmSubmitReview(false)} />
      )}
      {confirmFinalize && (
        <ConfirmModal title="Finalize PCR?" message="This PCR will be permanently recorded. It cannot be modified after finalization." confirmLabel="Finalize" variant="primary" onConfirm={finalizePCR} onCancel={() => setConfirmFinalize(false)} />
      )}
    </div>
  )
}
