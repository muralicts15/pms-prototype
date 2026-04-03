import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, FileText, UserPlus, Users, X, ChevronDown, ChevronUp } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Personal Details',  subtitle: 'Name, DOB, contact' },
  { id: 2, title: 'Co-Applicants',     subtitle: 'Household members' },
  { id: 3, title: 'Current Address',   subtitle: 'Where you live now' },
  { id: 4, title: 'Identification',    subtitle: 'ID verification' },
  { id: 5, title: 'Employment',        subtitle: 'Your employer' },
  { id: 6, title: 'Income',            subtitle: 'Weekly earnings' },
  { id: 7, title: 'Rental History',    subtitle: 'Previous tenancies' },
  { id: 8, title: 'References',        subtitle: 'Personal & emergency' },
  { id: 9, title: 'Review & Submit',   subtitle: 'Check and submit' },
]

type CoApplicantStatus = 'PENDING' | 'INVITED' | 'COMPLETED'

interface CoApplicant {
  id: string
  fullName: string
  dateOfBirth: string
  mobile: string
  email: string
  relationship: string
  idType: string
  idNumber: string
  occupation: string
  employerName: string
  netIncome: string
  incomeFrequency: string
  currentAddress: string
  rentalAddress: string
  lessorName: string
  lessorPhone: string
  reasonLeaving: string
}

const emptyCoApplicant = (): CoApplicant => ({
  id: `co-${Date.now()}`,
  fullName: '', dateOfBirth: '', mobile: '', email: '',
  relationship: '', idType: 'DRIVERS_LICENCE', idNumber: '',
  occupation: '', employerName: '', netIncome: '', incomeFrequency: 'WEEKLY',
  currentAddress: '', rentalAddress: '', lessorName: '', lessorPhone: '', reasonLeaving: '',
})

export default function Form18Wizard() {
  const navigate  = useNavigate()
  const [step, setStep]             = useState(1)
  const [submitting, setSubmitting] = useState(false)

  // Co-applicant state — primary user fills these in directly
  const [coApplicants, setCoApplicants] = useState<CoApplicant[]>([])
  const [expandedCo, setExpandedCo]     = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: '', dateOfBirth: '', mobile: '', email: '',
    currentAddress: '',
    idType: 'DRIVERS_LICENCE', idNumber: '',
    occupation: '', employerName: '', employerPhone: '',
    netIncome: '', incomeFrequency: 'WEEKLY',
    rentalAddress: '', rentalFrom: '', rentalTo: '',
    lessorName: '', lessorPhone: '', reasonLeaving: '',
    ref1Name: '', ref1Relationship: '', ref1Phone: '',
    ref2Name: '', ref2Relationship: '', ref2Phone: '',
  })

  const set = (k: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFormData(f => ({ ...f, [k]: e.target.value }))

  function addCoApplicant() {
    const co = emptyCoApplicant()
    setCoApplicants(prev => [...prev, co])
    setExpandedCo(co.id)
  }

  function removeCoApplicant(id: string) {
    setCoApplicants(prev => prev.filter(c => c.id !== id))
    if (expandedCo === id) setExpandedCo(null)
  }

  function updateCoApplicant(id: string, field: keyof CoApplicant, value: string) {
    setCoApplicants(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => navigate('/applicant/submitted'), 1500)
  }

  const statusColor: Record<CoApplicantStatus, string> = {
    PENDING:   'bg-gray-100 text-gray-600',
    INVITED:   'bg-yellow-50 text-yellow-700',
    COMPLETED: 'bg-green-50 text-green-700',
  }
  const statusLabel: Record<CoApplicantStatus, string> = {
    PENDING:   'Pending',
    INVITED:   'Invite Sent',
    COMPLETED: 'Completed',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => navigate('/public/search')}
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">Form 18 — Application to Rent</span>
          </div>
          <span className="text-xs text-gray-400">5 Mill Point Rd, South Perth</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-6">

        {/* Step progress */}
        <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center min-w-[52px]">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${s.id < step  ? 'bg-green-500 border-green-500 text-white' : ''}
                  ${s.id === step ? 'bg-blue-600 border-blue-600 text-white scale-110' : ''}
                  ${s.id > step  ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}>
                  {s.id < step ? <Check size={11} /> : s.id}
                </div>
                <span className={`text-[9px] mt-1 text-center leading-tight
                  ${s.id === step ? 'text-blue-700 font-semibold' : 'text-gray-400'}
                `}>{s.title.split(' ')[0]}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-3 mb-4 flex-shrink-0 ${s.id < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{STEPS[step - 1].title}</h2>
          <p className="text-sm text-gray-500 mb-5">{STEPS[step - 1].subtitle}</p>

          {/* ── Step 1: Personal Details ── */}
          {step === 1 && (
            <div className="space-y-4">
              <div><label className="label">Full Legal Name *</label><input className="input" placeholder="As shown on ID" value={formData.fullName} onChange={set('fullName')} /></div>
              <div><label className="label">Date of Birth *</label><input className="input" type="date" value={formData.dateOfBirth} onChange={set('dateOfBirth')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Mobile *</label><input className="input" placeholder="04xx xxx xxx" value={formData.mobile} onChange={set('mobile')} /></div>
                <div><label className="label">Email *</label><input className="input" type="email" placeholder="your@email.com" value={formData.email} onChange={set('email')} /></div>
              </div>
            </div>
          )}

          {/* ── Step 2: Co-Applicants ── */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Info banner */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <Users size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Household Application</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    If others will be living at the property and applying with you, add them here.
                    You fill in their details on their behalf — all information is combined into a single Form 18 for the property manager.
                  </p>
                </div>
              </div>

              {/* Primary applicant — read-only summary */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Applicant 1 — Primary (You)</p>
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{formData.fullName || 'Your details (entered in Step 1)'}</p>
                    <p className="text-xs text-gray-500">{formData.email || 'Primary applicant'}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Primary</span>
                </div>
              </div>

              {/* Co-applicant cards — each fully expandable */}
              {coApplicants.map((co, i) => (
                <div key={co.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Card header */}
                  <div
                    className="flex items-center gap-3 p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => setExpandedCo(expandedCo === co.id ? null : co.id)}
                  >
                    <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold flex-shrink-0">
                      {co.fullName ? co.fullName.charAt(0).toUpperCase() : String(i + 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{co.fullName || `Co-Applicant ${i + 1}`}</p>
                      <p className="text-xs text-gray-500">{co.relationship || 'Relationship not set'} {co.mobile ? `· ${co.mobile}` : ''}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        onClick={e => { e.stopPropagation(); removeCoApplicant(co.id) }}
                      >
                        <X size={14} />
                      </button>
                      {expandedCo === co.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded form — you fill in their details */}
                  {expandedCo === co.id && (
                    <div className="p-4 space-y-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-100 rounded px-3 py-2">
                        Fill in this co-applicant's details on their behalf.
                      </p>

                      {/* Personal */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Personal Details</p>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="label">Full Legal Name *</label><input className="input" placeholder="As shown on ID" value={co.fullName} onChange={e => updateCoApplicant(co.id, 'fullName', e.target.value)} /></div>
                            <div><label className="label">Date of Birth *</label><input className="input" type="date" value={co.dateOfBirth} onChange={e => updateCoApplicant(co.id, 'dateOfBirth', e.target.value)} /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="label">Mobile *</label><input className="input" placeholder="04xx xxx xxx" value={co.mobile} onChange={e => updateCoApplicant(co.id, 'mobile', e.target.value)} /></div>
                            <div><label className="label">Email</label><input className="input" type="email" placeholder="their@email.com" value={co.email} onChange={e => updateCoApplicant(co.id, 'email', e.target.value)} /></div>
                          </div>
                          <div>
                            <label className="label">Relationship to Primary Applicant</label>
                            <select className="input" value={co.relationship} onChange={e => updateCoApplicant(co.id, 'relationship', e.target.value)}>
                              <option value="">Select...</option>
                              <option>Partner / Spouse</option>
                              <option>Housemate</option>
                              <option>Family Member</option>
                              <option>Friend</option>
                            </select>
                          </div>
                          <div><label className="label">Current Address</label><input className="input" placeholder="Where they live now" value={co.currentAddress} onChange={e => updateCoApplicant(co.id, 'currentAddress', e.target.value)} /></div>
                        </div>
                      </div>

                      {/* ID */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Identification</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label">ID Type</label>
                            <select className="input" value={co.idType} onChange={e => updateCoApplicant(co.id, 'idType', e.target.value)}>
                              <option value="DRIVERS_LICENCE">Driver's Licence</option>
                              <option value="PASSPORT">Passport</option>
                              <option value="OTHER">Other</option>
                            </select>
                          </div>
                          <div><label className="label">ID Number</label><input className="input" placeholder="Document number" value={co.idNumber} onChange={e => updateCoApplicant(co.id, 'idNumber', e.target.value)} /></div>
                        </div>
                      </div>

                      {/* Employment & Income */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Employment & Income</p>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="label">Occupation</label><input className="input" placeholder="Job title" value={co.occupation} onChange={e => updateCoApplicant(co.id, 'occupation', e.target.value)} /></div>
                            <div><label className="label">Employer Name</label><input className="input" placeholder="Company name" value={co.employerName} onChange={e => updateCoApplicant(co.id, 'employerName', e.target.value)} /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="label">Net Income ($)</label><input className="input" type="number" placeholder="Amount" value={co.netIncome} onChange={e => updateCoApplicant(co.id, 'netIncome', e.target.value)} /></div>
                            <div>
                              <label className="label">Frequency</label>
                              <select className="input" value={co.incomeFrequency} onChange={e => updateCoApplicant(co.id, 'incomeFrequency', e.target.value)}>
                                <option value="WEEKLY">Weekly</option>
                                <option value="FORTNIGHTLY">Fortnightly</option>
                                <option value="MONTHLY">Monthly</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rental History */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Previous Rental History</p>
                        <div className="space-y-3">
                          <div><label className="label">Previous Rental Address</label><input className="input" placeholder="Street address" value={co.rentalAddress} onChange={e => updateCoApplicant(co.id, 'rentalAddress', e.target.value)} /></div>
                          <div className="grid grid-cols-2 gap-3">
                            <div><label className="label">Lessor / Agent Name</label><input className="input" value={co.lessorName} onChange={e => updateCoApplicant(co.id, 'lessorName', e.target.value)} /></div>
                            <div><label className="label">Lessor Phone</label><input className="input" value={co.lessorPhone} onChange={e => updateCoApplicant(co.id, 'lessorPhone', e.target.value)} /></div>
                          </div>
                          <div><label className="label">Reason for Leaving</label><input className="input" value={co.reasonLeaving} onChange={e => updateCoApplicant(co.id, 'reasonLeaving', e.target.value)} /></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add co-applicant — max 2 */}
              {coApplicants.length < 2 && (
                <button className="btn-secondary w-full border-dashed" onClick={addCoApplicant}>
                  <UserPlus size={15} />
                  Add Co-Applicant {coApplicants.length === 0 ? '(optional)' : '2'}
                </button>
              )}

              {coApplicants.length === 0 && (
                <p className="text-xs text-gray-400 text-center">Applying alone? Leave this step empty and continue.</p>
              )}

              {/* Additional occupants */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Additional Occupants</p>
                <p className="text-xs text-gray-400 mb-2">Anyone who will live at the property but is not applying (e.g. children, dependants).</p>
                <textarea className="input resize-none text-sm" rows={2} placeholder="e.g. 2 children (ages 4 and 7)" />
              </div>
            </div>
          )}

          {/* ── Step 3: Current Address ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div><label className="label">Current Address *</label><input className="input" placeholder="Street address" value={formData.currentAddress} onChange={set('currentAddress')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Length of Stay</label><input className="input" placeholder="e.g. 2 years" /></div>
                <div><label className="label">Reason for Moving *</label><input className="input" placeholder="e.g. Lease ended" /></div>
              </div>
            </div>
          )}

          {/* ── Step 4: Identification ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="label">ID Type *</label>
                <select className="input" value={formData.idType} onChange={set('idType')}>
                  <option value="DRIVERS_LICENCE">Driver's Licence</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="OTHER">Other Government ID</option>
                </select>
              </div>
              <div><label className="label">ID Number *</label><input className="input" placeholder="Document number" value={formData.idNumber} onChange={set('idNumber')} /></div>
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-blue-50 text-center cursor-pointer hover:bg-blue-100">
                <p className="text-xs text-blue-500 font-medium">Click to upload copy of ID</p>
                <p className="text-[10px] text-blue-400 mt-1">PDF, JPG, PNG — max 10MB</p>
              </div>
            </div>
          )}

          {/* ── Step 5: Employment ── */}
          {step === 5 && (
            <div className="space-y-4">
              <div><label className="label">Occupation *</label><input className="input" placeholder="Your job title" value={formData.occupation} onChange={set('occupation')} /></div>
              <div><label className="label">Employer Name *</label><input className="input" placeholder="Company name" value={formData.employerName} onChange={set('employerName')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Employer Phone</label><input className="input" value={formData.employerPhone} onChange={set('employerPhone')} /></div>
                <div>
                  <label className="label">Employment Type</label>
                  <select className="input">
                    <option>Full-time Permanent</option><option>Part-time</option>
                    <option>Casual</option><option>Contract</option><option>Self-employed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Employed From</label><input className="input" type="date" /></div>
                <div><label className="label">Employed To</label><input className="input" type="date" placeholder="Leave blank if current" /></div>
              </div>
            </div>
          )}

          {/* ── Step 6: Income ── */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Net Income *</label><input className="input" type="number" placeholder="Amount" value={formData.netIncome} onChange={set('netIncome')} /></div>
                <div>
                  <label className="label">Frequency</label>
                  <select className="input" value={formData.incomeFrequency} onChange={set('incomeFrequency')}>
                    <option value="WEEKLY">Weekly</option>
                    <option value="FORTNIGHTLY">Fortnightly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
              </div>
              <div><label className="label">Other Income (optional)</label><input className="input" type="number" placeholder="e.g. rental income, investments" /></div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-100">
                <p className="text-xs text-gray-400 font-medium">Upload payslips or bank statements (optional)</p>
              </div>
            </div>
          )}

          {/* ── Step 7: Rental History ── */}
          {step === 7 && (
            <div className="space-y-4">
              <div><label className="label">Previous Rental Address *</label><input className="input" placeholder="Street address" value={formData.rentalAddress} onChange={set('rentalAddress')} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">From</label><input className="input" type="date" value={formData.rentalFrom} onChange={set('rentalFrom')} /></div>
                <div><label className="label">To</label><input className="input" type="date" value={formData.rentalTo} onChange={set('rentalTo')} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Lessor / Agent Name</label><input className="input" value={formData.lessorName} onChange={set('lessorName')} /></div>
                <div><label className="label">Lessor Phone</label><input className="input" value={formData.lessorPhone} onChange={set('lessorPhone')} /></div>
              </div>
              <div><label className="label">Reason for Leaving</label><input className="input" value={formData.reasonLeaving} onChange={set('reasonLeaving')} /></div>
            </div>
          )}

          {/* ── Step 8: References ── */}
          {step === 8 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Reference 1</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">Name *</label><input className="input" value={formData.ref1Name} onChange={set('ref1Name')} /></div>
                    <div><label className="label">Relationship *</label><input className="input" placeholder="e.g. Friend, Colleague" value={formData.ref1Relationship} onChange={set('ref1Relationship')} /></div>
                  </div>
                  <div><label className="label">Phone *</label><input className="input" value={formData.ref1Phone} onChange={set('ref1Phone')} /></div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact / Next of Kin</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">Name *</label><input className="input" value={formData.ref2Name} onChange={set('ref2Name')} /></div>
                    <div><label className="label">Relationship *</label><input className="input" placeholder="e.g. Parent, Sibling" value={formData.ref2Relationship} onChange={set('ref2Relationship')} /></div>
                  </div>
                  <div><label className="label">Phone *</label><input className="input" value={formData.ref2Phone} onChange={set('ref2Phone')} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 9: Review & Submit ── */}
          {step === 9 && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800 mb-1">✓ Ready to Submit</p>
                <p className="text-xs text-green-700">Your Form 18 application will be generated as a PDF and sent to the property manager.</p>
              </div>

              {/* Household summary */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Household Summary</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {formData.fullName ? formData.fullName.charAt(0) : 'P'}
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">{formData.fullName || 'Primary Applicant'}</span>
                      <span className="text-xs text-blue-600 ml-2">Primary</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">✓ Complete</span>
                  </div>
                  {coApplicants.map((co, i) => (
                    <div key={co.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                      <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
                        {co.fullName ? co.fullName.charAt(0) : String(i + 2)}
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-900">{co.fullName || `Co-Applicant ${i + 1}`}</span>
                        <span className="text-xs text-gray-400 ml-2">{co.relationship || 'Co-applicant'}</span>
                      </div>
                      <span className={`text-xs font-medium ${co.fullName && co.occupation ? 'text-green-600' : 'text-yellow-600'}`}>
                        {co.fullName && co.occupation ? '✓ Complete' : '⚠ Incomplete'}
                      </span>
                    </div>
                  ))}
                  {coApplicants.length === 0 && (
                    <p className="text-xs text-gray-400 px-2">Solo application — no co-applicants</p>
                  )}
                </div>
              </div>

              {/* Application summary */}
              <div className="space-y-1.5">
                {[
                  { label: 'Property',  value: '5 Mill Point Rd, South Perth' },
                  { label: 'Applicant', value: formData.fullName || 'Not entered' },
                  { label: 'ID Type',   value: formData.idType.replace('_', ' ') },
                  { label: 'Employer',  value: formData.employerName || 'Not entered' },
                  { label: 'Income',    value: formData.netIncome ? `$${formData.netIncome}/${formData.incomeFrequency.toLowerCase()}` : 'Not entered' },
                  { label: 'Applicants', value: `${1 + coApplicants.length} total (${1 + coApplicants.length === 1 ? 'solo' : 'household'})` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-medium text-gray-900">{row.value}</span>
                  </div>
                ))}
              </div>

              {coApplicants.some(c => !c.fullName || !c.occupation) && coApplicants.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-yellow-800">⚠ Some co-applicant details are incomplete</p>
                  <p className="text-xs text-yellow-700 mt-0.5">Go back to Step 2 and fill in all required fields for each co-applicant before submitting.</p>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-0.5 text-blue-600" />
                <span className="text-xs text-gray-600">I declare that all information provided is true and correct. I consent to the property manager conducting reference and tenancy database checks.</span>
              </label>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            className="btn-secondary"
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft size={15} /> Previous
          </button>
          {step < 9 ? (
            <button className="btn-primary" onClick={() => setStep(s => Math.min(9, s + 1))}>
              Save & Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : <><Check size={15} /> Submit Application</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
