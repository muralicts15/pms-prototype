import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Address',               subtitle: 'Property location' },
  { id: 2, title: 'Property Details',      subtitle: 'Beds, baths, type' },
  { id: 3, title: 'Photos',                subtitle: 'Upload images' },
  { id: 4, title: 'Rent & Bond',           subtitle: 'Financial terms' },
  { id: 5, title: 'Utilities',             subtitle: 'Inclusions' },
  { id: 6, title: 'Pets & Strata',         subtitle: 'Rules & conditions' },
  { id: 7, title: 'Owner Details',         subtitle: 'Linked owner' },
  { id: 8, title: 'Inspection Prefs',      subtitle: 'Viewing settings' },
]

export default function PropertyWizard() {
  const navigate  = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    streetNumber: '', streetName: '', suburb: '', state: 'WA', postcode: '',
    bedrooms: '3', bathrooms: '2', parking: '1', propertyType: 'House',
    weeklyRent: '', bond: '', availableFrom: '',
    description: '',
  })

  function next() { if (step < 8) setStep(s => s + 1) }
  function prev() { if (step > 1) setStep(s => s - 1) }

  function handleFinish() {
    navigate('/agent/properties')
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        onClick={() => navigate('/agent/properties')}
      >
        <ArrowLeft size={14} /> Back to Properties
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-sm text-gray-500">Step {step} of 8 — {STEPS[step - 1].title}</p>
      </div>

      {/* Step progress */}
      <div className="flex items-center gap-0 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => setStep(s.id)}
              className={`flex flex-col items-center min-w-[60px] group`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${s.id < step  ? 'bg-green-500 border-green-500 text-white' : ''}
                ${s.id === step ? 'bg-blue-600 border-blue-600 text-white scale-110' : ''}
                ${s.id > step  ? 'bg-white border-gray-300 text-gray-400' : ''}
              `}>
                {s.id < step ? <Check size={12} /> : s.id}
              </div>
              <span className={`text-[9px] mt-1 text-center leading-tight
                ${s.id === step ? 'text-blue-700 font-semibold' : 'text-gray-400'}
              `}>{s.title}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-4 mb-5 flex-shrink-0 ${s.id < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card p-6 mb-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Property Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Street Number</label><input className="input" placeholder="e.g. 24" value={formData.streetNumber} onChange={e => setFormData(f => ({ ...f, streetNumber: e.target.value }))} /></div>
              <div><label className="label">Street Name</label><input className="input" placeholder="e.g. Chapel St" value={formData.streetName} onChange={e => setFormData(f => ({ ...f, streetName: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2"><label className="label">Suburb</label><input className="input" placeholder="e.g. Brighton" value={formData.suburb} onChange={e => setFormData(f => ({ ...f, suburb: e.target.value }))} /></div>
              <div><label className="label">Postcode</label><input className="input" placeholder="6020" value={formData.postcode} onChange={e => setFormData(f => ({ ...f, postcode: e.target.value }))} /></div>
            </div>
            <div><label className="label">State</label>
              <select className="input" value={formData.state} onChange={e => setFormData(f => ({ ...f, state: e.target.value }))}>
                <option>WA</option><option>NSW</option><option>VIC</option><option>QLD</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
            <div><label className="label">Property Type</label>
              <select className="input" value={formData.propertyType} onChange={e => setFormData(f => ({ ...f, propertyType: e.target.value }))}>
                <option>House</option><option>Apartment</option><option>Townhouse</option><option>Unit</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="label">Bedrooms</label><input className="input" type="number" min="1" max="10" value={formData.bedrooms} onChange={e => setFormData(f => ({ ...f, bedrooms: e.target.value }))} /></div>
              <div><label className="label">Bathrooms</label><input className="input" type="number" min="1" max="10" value={formData.bathrooms} onChange={e => setFormData(f => ({ ...f, bathrooms: e.target.value }))} /></div>
              <div><label className="label">Parking</label><input className="input" type="number" min="0" max="10" value={formData.parking} onChange={e => setFormData(f => ({ ...f, parking: e.target.value }))} /></div>
            </div>
            <div><label className="label">Description</label>
              <textarea className="input resize-none" rows={4} placeholder="Describe the property..." value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Property Photos</h2>
            <p className="text-sm text-gray-500">Upload at least 3 photos. First photo will be the main listing image.</p>
            <div className="grid grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors
                  ${i < 3 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                  {i < 3 ? (
                    <div className="text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto mb-1 ${i === 0 ? 'bg-blue-200' : 'bg-blue-100'}`} />
                      <span className="text-[10px] text-blue-500">{i === 0 ? 'Main' : `Photo ${i+1}`}</span>
                    </div>
                  ) : (
                    <span className="text-2xl text-gray-300">+</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-green-600">✓ 3 photos uploaded — minimum met</p>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Rent & Bond</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Weekly Rent ($)</label>
                <input className="input" type="number" placeholder="650" value={formData.weeklyRent} onChange={e => setFormData(f => ({ ...f, weeklyRent: e.target.value }))} />
              </div>
              <div>
                <label className="label">Bond Amount ($)</label>
                <input className="input" type="number" placeholder="2600" value={formData.bond} onChange={e => setFormData(f => ({ ...f, bond: e.target.value }))} />
                <p className="text-xs text-gray-400 mt-1">Typically 4 weeks rent</p>
              </div>
            </div>
            <div>
              <label className="label">Available From</label>
              <input className="input" type="date" value={formData.availableFrom} onChange={e => setFormData(f => ({ ...f, availableFrom: e.target.value }))} />
            </div>
            <div>
              <label className="label">Agreement Type</label>
              <div className="flex gap-3 mt-1">
                {['Fixed Term', 'Periodic'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="agreementType" defaultChecked={t === 'Fixed Term'} className="text-blue-600" />
                    <span className="text-sm text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Utilities</h2>
            <p className="text-sm text-gray-500">Select which utilities are included in the rent.</p>
            <div className="grid grid-cols-2 gap-3">
              {['Water', 'Electricity', 'Gas', 'Internet', 'Strata Fees', 'Council Rates'].map(u => (
                <label key={u} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" className="text-blue-600" />
                  <span className="text-sm text-gray-700">{u}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pets & Strata</h2>
            <div>
              <label className="label">Pets Allowed</label>
              <div className="flex gap-3 mt-1">
                {['Yes', 'No', 'Negotiable'].map(o => (
                  <label key={o} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="pets" defaultChecked={o === 'No'} className="text-blue-600" />
                    <span className="text-sm text-gray-700">{o}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="text-blue-600" />
                <div>
                  <span className="text-sm font-medium text-gray-700">Strata Property</span>
                  <p className="text-xs text-gray-400">Strata by-laws apply — additional clause added to Form 1AA</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Owner Details</h2>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-700">Link an existing owner or create new</p>
            </div>
            <div><label className="label">Owner Name</label><input className="input" placeholder="Search owners..." defaultValue="James Patterson" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Email</label><input className="input" defaultValue="james.p@email.com" /></div>
              <div><label className="label">Phone</label><input className="input" defaultValue="0411 222 333" /></div>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Inspection Preferences</h2>
            <p className="text-sm text-gray-500">These are preferences only — actual slots are created in the Appointments screen.</p>
            <div>
              <label className="label">Inspection Style</label>
              <div className="flex gap-3 mt-1 flex-wrap">
                {['Open Home', 'Private', 'Both'].map(o => (
                  <label key={o} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="inspStyle" defaultChecked={o === 'Open Home'} className="text-blue-600" />
                    <span className="text-sm text-gray-700">{o}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Preferred Days</label>
              <div className="flex gap-2 flex-wrap mt-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <label key={d} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked={d === 'Sat' || d === 'Sun'} className="text-blue-600" />
                    <span className="text-sm text-gray-700">{d}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Max Attendees / Slot</label><input className="input" type="number" defaultValue="20" /></div>
              <div>
                <label className="label">Auto-open on Publish</label>
                <div className="flex gap-3 mt-2">
                  {['Yes', 'No'].map(o => (
                    <label key={o} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="autoOpen" defaultChecked={o === 'No'} />
                      <span className="text-sm text-gray-700">{o}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={prev} disabled={step === 1}>
          <ArrowLeft size={15} /> Previous
        </button>
        {step < 8 ? (
          <button className="btn-primary" onClick={next}>
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button className="btn-primary" onClick={handleFinish}>
            <Check size={15} /> Save as Draft
          </button>
        )}
      </div>
    </div>
  )
}
