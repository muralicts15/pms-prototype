import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Car, MapPin, Calendar, DollarSign, X } from 'lucide-react'
import { PROPERTIES } from '../../data/mockData'

export default function PublicPropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  const property = PROPERTIES.find(p => p.id === id) ?? PROPERTIES[2]

  const PUBLIC_LABEL: Record<string, string> = {
    LISTED:            'Available',
    APPLICATIONS_OPEN: 'Accepting Applications',
    UNDER_REVIEW:      'Applications Closed',
    OFFER_IN_PROGRESS: 'Under Offer',
  }
  const label = PUBLIC_LABEL[property.listingStatus] ?? property.stageLabel

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            onClick={() => navigate('/public/search')}
          >
            <ArrowLeft size={14} /> Back to Search
          </button>
          <div className="flex gap-3">
            <button className="btn-secondary text-sm" onClick={() => navigate('/applicant/login')}>Log In</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Photo strip */}
        <div className="grid grid-cols-4 gap-2 mb-6 h-64">
          <div className="col-span-2 bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl flex items-center justify-center text-blue-600 font-medium">
            Main Photo
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Photo {i + 2}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main */}
          <div className="col-span-2 space-y-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{property.address}</h1>
                  <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                    <MapPin size={14} />
                    {property.suburb}, {property.state} {property.postcode}
                  </div>
                </div>
                <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                  {label}
                </span>
              </div>

              <div className="flex items-center gap-6 mt-4 text-gray-700">
                <span className="flex items-center gap-2"><Bed size={16} className="text-gray-400" /> <b>{property.bedrooms}</b> Bedrooms</span>
                <span className="flex items-center gap-2"><Bath size={16} className="text-gray-400" /> <b>{property.bathrooms}</b> Bathrooms</span>
                <span className="flex items-center gap-2"><Car size={16} className="text-gray-400" /> <b>{property.parking}</b> Parking</span>
              </div>
            </div>

            <div className="card p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">About this property</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            <div className="card p-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Rental Details</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={14} className="text-gray-400" />
                  Weekly Rent: <b>${property.weeklyRent}</b>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign size={14} className="text-gray-400" />
                  Bond: <b>${property.bond}</b>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={14} className="text-gray-400" />
                  Available: <b>{property.availableFrom}</b>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  Type: <b>{property.propertyType}</b>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-4">
              <div className="text-center mb-4">
                <p className="text-2xl font-bold text-gray-900">${property.weeklyRent}<span className="text-sm font-normal text-gray-500">/wk</span></p>
                <p className="text-xs text-gray-400">+ ${property.bond} bond</p>
              </div>

              {property.listingStatus === 'LISTED' && (
                <button
                  className="btn-primary w-full mb-2"
                  onClick={() => setEnquiryOpen(true)}
                >
                  Book Inspection
                </button>
              )}
              {property.listingStatus === 'APPLICATIONS_OPEN' && (
                <button
                  className="btn-primary w-full mb-2"
                  onClick={() => navigate('/applicant/login')}
                >
                  Apply Now
                </button>
              )}
              {['UNDER_REVIEW', 'OFFER_IN_PROGRESS'].includes(property.listingStatus) && (
                <button
                  className="btn-secondary w-full mb-2"
                  onClick={() => setEnquiryOpen(true)}
                >
                  Register Interest
                </button>
              )}

              <button
                className="btn-ghost w-full text-sm"
                onClick={() => setEnquiryOpen(true)}
              >
                Contact Agent
              </button>
            </div>

            <div className="card p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Agency</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">PMS</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Perth Metro Realty</p>
                  <p className="text-xs text-gray-500">Sarah Mitchell</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry / Book Inspection modal */}
      {enquiryOpen && !submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Book an Inspection</h2>
              <button onClick={() => setEnquiryOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Leave your details and we'll be in touch to arrange a viewing.</p>
            <div className="space-y-3">
              <div><label className="label">Full Name *</label><input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div><label className="label">Email *</label><input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><label className="label">Phone *</label><input className="input" placeholder="04xx xxx xxx" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
              <div><label className="label">Message (optional)</label><textarea className="input resize-none" rows={3} placeholder="Any questions?" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} /></div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button className="btn-secondary" onClick={() => setEnquiryOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => setSubmitted(true)}>Send Enquiry</button>
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md p-6 shadow-xl text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Enquiry Sent!</h2>
            <p className="text-sm text-gray-600 mb-4">We'll be in touch shortly to arrange your inspection.</p>
            <button className="btn-primary" onClick={() => { setEnquiryOpen(false); setSubmitted(false) }}>Done</button>
          </div>
        </div>
      )}
    </div>
  )
}
