import { useNavigate } from 'react-router-dom'
import { Search, Bed, Bath, Car, MapPin, SlidersHorizontal } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { PROPERTIES } from '../../data/mockData'

const PUBLIC_VISIBLE = ['LISTED', 'APPLICATIONS_OPEN', 'UNDER_REVIEW', 'OFFER_IN_PROGRESS']

const PUBLIC_LABEL: Record<string, string> = {
  LISTED:            'Available',
  APPLICATIONS_OPEN: 'Accepting Applications',
  UNDER_REVIEW:      'Applications Closed',
  OFFER_IN_PROGRESS: 'Under Offer',
}

export default function SearchPortal() {
  const navigate = useNavigate()
  const visible = PROPERTIES.filter(p => PUBLIC_VISIBLE.includes(p.listingStatus))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="font-bold text-gray-900">PMS Rentals</span>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary text-sm" onClick={() => navigate('/applicant/login')}>Log In</button>
            <button className="btn-primary text-sm" onClick={() => navigate('/agent/properties')}>Agent Portal</button>
          </div>
        </div>
      </header>

      {/* Hero search */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Find Your Next Home</h1>
          <p className="text-blue-200 mb-6">Browse available rental properties across Western Australia</p>
          <div className="flex gap-2 bg-white rounded-xl p-2 shadow-lg">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search size={16} className="text-gray-400" />
              <input className="flex-1 outline-none text-sm text-gray-700" placeholder="Search suburb, postcode or address..." />
            </div>
            <button className="btn-primary rounded-lg">Search</button>
          </div>
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            {['All Types', 'House', 'Apartment', 'Townhouse'].map(t => (
              <button key={t} className={`text-sm px-3 py-1 rounded-full transition-colors ${t === 'All Types' ? 'bg-white text-blue-700 font-medium' : 'text-blue-200 hover:text-white'}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600"><b>{visible.length}</b> properties found</p>
          <button className="btn-secondary text-sm"><SlidersHorizontal size={14} /> Filters</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map(property => (
            <div
              key={property.id}
              className="card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/public/properties/${property.id}`)}
            >
              {/* Photo */}
              <div className="h-44 bg-gradient-to-br from-blue-100 to-blue-200 relative">
                <div className="absolute top-2 left-2">
                  <span className="text-xs font-medium bg-white/90 px-2 py-0.5 rounded text-gray-700">
                    {PUBLIC_LABEL[property.listingStatus] ?? property.stageLabel}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="text-xs font-bold bg-blue-600 text-white px-2 py-0.5 rounded">
                    ${property.weeklyRent}/wk
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{property.address}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5 mb-3">
                  <MapPin size={12} />
                  {property.suburb}, {property.state} {property.postcode}
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms}</span>
                  <span className="flex items-center gap-1"><Car size={13} /> {property.parking}</span>
                  <span className="ml-auto text-xs text-gray-400">Available {property.availableFrom}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  {property.listingStatus === 'APPLICATIONS_OPEN' ? (
                    <button
                      className="btn-primary w-full text-sm"
                      onClick={e => { e.stopPropagation(); navigate('/applicant/login') }}
                    >
                      Apply Now
                    </button>
                  ) : property.listingStatus === 'LISTED' ? (
                    <button
                      className="btn-primary w-full text-sm"
                      onClick={e => { e.stopPropagation(); navigate(`/public/properties/${property.id}`) }}
                    >
                      Book Inspection
                    </button>
                  ) : (
                    <button className="btn-secondary w-full text-sm">Register Interest</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
