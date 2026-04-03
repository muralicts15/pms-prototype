import { useNavigate } from 'react-router-dom'
import { Plus, Bed, Bath, Car, DollarSign } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { PROPERTIES } from '../../data/mockData'

export default function PropertyList() {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your property portfolio</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate('/agent/properties/new')}
        >
          <Plus size={16} />
          Add Property
        </button>
      </div>

      {/* Status summary bar */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Draft',        count: 1, color: 'bg-gray-100 text-gray-700' },
          { label: 'Listed',       count: 2, color: 'bg-green-50 text-green-700' },
          { label: 'Accepting',    count: 1, color: 'bg-teal-50 text-teal-700' },
          { label: 'Under Review', count: 1, color: 'bg-orange-50 text-orange-700' },
          { label: 'Under Offer',  count: 0, color: 'bg-purple-50 text-purple-700' },
        ].map(s => (
          <div key={s.label} className={`card p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Property cards */}
      <div className="space-y-3">
        {PROPERTIES.map(property => (
          <div
            key={property.id}
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/agent/properties/${property.id}`)}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Photo placeholder */}
              <div className="w-24 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">
                Photo
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{property.address}</p>
                    <p className="text-sm text-gray-500">{property.suburb}, {property.state} {property.postcode}</p>
                  </div>
                  <StatusBadge status={property.listingStatus} size="sm" />
                </div>

                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Bed size={13} /> {property.bedrooms}</span>
                  <span className="flex items-center gap-1"><Bath size={13} /> {property.bathrooms}</span>
                  <span className="flex items-center gap-1"><Car size={13} /> {property.parking}</span>
                  <span className="flex items-center gap-1 ml-auto font-semibold text-gray-900">
                    <DollarSign size={13} />{property.weeklyRent}/wk
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Available {property.availableFrom}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-xs text-gray-500">{property.propertyType}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
