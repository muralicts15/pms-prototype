import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bed, Bath, Car, DollarSign, Calendar, MapPin, RefreshCw, CheckCircle2 } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import StatusStepper from '../../components/StatusStepper'
import ActionPanel from '../../components/ActionPanel'
import TimelinePanel from '../../components/TimelinePanel'
import ConfirmModal from '../../components/ConfirmModal'
import { PROPERTIES, PROPERTY_TIMELINE } from '../../data/mockData'
import type { ListingStatus, Property } from '../../types'

// Defines the next status after each action
const TRANSITIONS: Record<string, ListingStatus> = {
  MARK_READY:           'READY_TO_LIST',
  PUBLISH:              'LISTED',
  OPEN_APPLICATIONS:    'APPLICATIONS_OPEN',
  CLOSE_APPLICATIONS:   'UNDER_REVIEW',
  REOPEN_APPLICATIONS:  'APPLICATIONS_OPEN',
  TAKE_OFF_MARKET:      'OFF_MARKET',
  MAINTENANCE_HOLD:     'MAINTENANCE_HOLD',
  RELEASE_HOLD:         'LISTED',
  RESUME_LISTING:       'LISTED',
}

const ACTIONS_BY_STATUS: Record<ListingStatus, Property['allowedActions']> = {
  DRAFT:             [{ code: 'MARK_READY',           label: 'Mark as Ready',        variant: 'primary' }],
  READY_TO_LIST:     [{ code: 'PUBLISH',              label: 'Publish Listing',      variant: 'primary' }],
  LISTED:            [
    { code: 'OPEN_APPLICATIONS',  label: 'Open Applications', variant: 'primary' },
    { code: 'TAKE_OFF_MARKET',    label: 'Take Off Market',   variant: 'secondary' },
    { code: 'MAINTENANCE_HOLD',   label: 'Place on Hold',     variant: 'ghost' },
  ],
  APPLICATIONS_OPEN: [
    { code: 'CLOSE_APPLICATIONS', label: 'Close Applications', variant: 'primary' },
    { code: 'TAKE_OFF_MARKET',    label: 'Take Off Market',    variant: 'secondary' },
    { code: 'MAINTENANCE_HOLD',   label: 'Place on Hold',      variant: 'ghost' },
  ],
  UNDER_REVIEW: [
    { code: 'REOPEN_APPLICATIONS', label: 'Reopen Applications', variant: 'primary' },
    { code: 'TAKE_OFF_MARKET',     label: 'Take Off Market',     variant: 'secondary' },
    { code: 'MAINTENANCE_HOLD',    label: 'Place on Hold',       variant: 'ghost' },
  ],
  OFFER_IN_PROGRESS: [
    { code: 'CANCEL_OFFER',      label: 'Cancel Offer',    variant: 'danger' },
    { code: 'MAINTENANCE_HOLD',  label: 'Place on Hold',   variant: 'ghost' },
  ],
  VACATING_TENANT: [],
  MAINTENANCE_HOLD: [{ code: 'RELEASE_HOLD', label: 'Release Hold', variant: 'primary' }],
  OFF_MARKET:       [
    { code: 'RESUME_LISTING', label: 'Resume Listing', variant: 'primary' },
    { code: 'ARCHIVE',        label: 'Archive Property', variant: 'danger' },
  ],
  ARCHIVED: [],
}

const CONFIRM_CONFIG: Partial<Record<string, { title: string; message: string; confirmLabel: string; variant: 'primary' | 'danger' }>> = {
  PUBLISH:              { title: 'Publish Listing?',         message: 'This will make the property visible on the public portal.',                              confirmLabel: 'Publish',          variant: 'primary' },
  OPEN_APPLICATIONS:    { title: 'Open Applications?',       message: 'Prospects with temp access will be able to submit Form 18 applications.',                confirmLabel: 'Open',             variant: 'primary' },
  CLOSE_APPLICATIONS:   { title: 'Close Applications?',      message: 'No new applications will be accepted. Existing applications remain active.',             confirmLabel: 'Close',            variant: 'primary' },
  REOPEN_APPLICATIONS:  { title: 'Reopen Applications?',     message: 'Applications will be re-opened. Previously submitted applications remain.',              confirmLabel: 'Reopen',           variant: 'primary' },
  TAKE_OFF_MARKET:      { title: 'Take Off Market?',         message: 'The property will be removed from the public portal immediately.',                       confirmLabel: 'Take Off Market',  variant: 'danger'  },
  MAINTENANCE_HOLD:     { title: 'Place on Maintenance Hold?', message: 'The listing will be paused and removed from public search. You can release it later.', confirmLabel: 'Place on Hold',    variant: 'primary' },
  RELEASE_HOLD:         { title: 'Release Maintenance Hold?', message: 'The listing will return to its previous status.',                                        confirmLabel: 'Release',          variant: 'primary' },
  RESUME_LISTING:       { title: 'Resume Listing?',          message: 'The property will be listed again on the public portal.',                                 confirmLabel: 'Resume',           variant: 'primary' },
  CANCEL_OFFER:         { title: 'Cancel Offer?',            message: 'The current offer will be cancelled. The property will return to Under Review.',          confirmLabel: 'Cancel Offer',     variant: 'danger'  },
  ARCHIVE:              { title: 'Archive Property?',        message: 'This is irreversible. The property will be permanently archived.',                        confirmLabel: 'Archive',          variant: 'danger'  },
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const initial = PROPERTIES.find(p => p.id === id) ?? PROPERTIES[0]

  const [status, setStatus]         = useState<ListingStatus>(initial.listingStatus)
  const [pendingAction, setPending] = useState<string | null>(null)
  const [timeline, setTimeline]     = useState(PROPERTY_TIMELINE)
  const [prevStatus, setPrevStatus] = useState<ListingStatus | null>(null)

  // Relist panel state (for VACATING_TENANT)
  const [relistDate, setRelistDate]   = useState('1 Jun 2026')
  const [relistRent, setRelistRent]   = useState(String(initial.weeklyRent))
  const [relisted, setRelisted]       = useState(false)

  const property = { ...initial, listingStatus: status }
  const actions  = ACTIONS_BY_STATUS[status] ?? []

  function handleAction(code: string) {
    const confirm = CONFIRM_CONFIG[code]
    if (confirm) {
      setPending(code)
    } else {
      applyTransition(code)
    }
  }

  function applyTransition(code: string) {
    const next = TRANSITIONS[code]
    if (!next) return
    if (status !== 'MAINTENANCE_HOLD') setPrevStatus(status)
    setStatus(next)
    const actionLabel = actions.find(a => a.code === code)?.label ?? code
    setTimeline(prev => [{
      id: `t${Date.now()}`,
      action: actionLabel,
      actor: 'Sarah (Agent)',
      timestamp: 'Just now',
    }, ...prev])
    setPending(null)
  }

  const confirm = pendingAction ? CONFIRM_CONFIG[pendingAction] : null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back */}
      <button
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        onClick={() => navigate('/pm/properties')}
      >
        <ArrowLeft size={14} /> Back to Properties
      </button>

      {/* Header */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{property.address}</h1>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
              <MapPin size={13} />
              {property.suburb}, {property.state} {property.postcode}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Status stepper */}
        <StatusStepper current={status} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left — main detail */}
        <div className="col-span-2 space-y-4">

          {/* Property specs */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Property Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600"><Bed size={15} className="text-gray-400" /><span><b>{property.bedrooms}</b> Bedrooms</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Bath size={15} className="text-gray-400" /><span><b>{property.bathrooms}</b> Bathrooms</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Car size={15} className="text-gray-400" /><span><b>{property.parking}</b> Parking</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Calendar size={15} className="text-gray-400" /><span>Available <b>{property.availableFrom}</b></span></div>
              <div className="flex items-center gap-2 text-gray-600"><DollarSign size={15} className="text-gray-400" /><span><b>${property.weeklyRent}/wk</b></span></div>
              <div className="flex items-center gap-2 text-gray-600"><DollarSign size={15} className="text-gray-400" /><span>Bond <b>${property.bond}</b></span></div>
            </div>
            <p className="text-sm text-gray-600 mt-3 pt-3 border-t border-gray-100">{property.description}</p>
          </div>

          {/* Photo strip placeholder */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Photos <span className="text-gray-400 font-normal">(6)</span></h2>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs text-gray-400 ${i === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                  {i === 0 ? 'Main' : `Photo ${i + 1}`}
                </div>
              ))}
            </div>
          </div>

          {/* Relist panel — shown when current tenant is vacating */}
          {status === 'VACATING_TENANT' && (
            <div className="card p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCw size={15} className="text-orange-600" />
                <h2 className="text-sm font-semibold text-orange-800">Relist Property</h2>
                <span className="text-[10px] bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full font-semibold ml-auto">Current Tenant Vacating</span>
              </div>
              {relisted ? (
                <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                  <CheckCircle2 size={15} /> Property relisted — now showing as Available from {relistDate}
                </div>
              ) : (
                <>
                  <p className="text-xs text-orange-700 mb-4">
                    The current tenant has given notice. Set the new availability date and weekly rent, then publish the listing so prospects can start enquiring.
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="label">Available From</label>
                      <input
                        className="input"
                        value={relistDate}
                        onChange={e => setRelistDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label">New Weekly Rent ($)</label>
                      <input
                        className="input"
                        type="number"
                        value={relistRent}
                        onChange={e => setRelistRent(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="btn-primary text-sm flex items-center gap-1.5"
                    onClick={() => {
                      setRelisted(true)
                      setTimeline(prev => [{
                        id: `t${Date.now()}`,
                        action: `Property relisted — available from ${relistDate} at $${relistRent}/wk`,
                        actor: 'Sarah (Agent)',
                        timestamp: 'Just now',
                      }, ...prev])
                    }}
                  >
                    <RefreshCw size={13} /> Publish Relisting
                  </button>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="card p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Available Actions</h2>
            {actions.length > 0 ? (
              <ActionPanel actions={actions} onAction={handleAction} />
            ) : status === 'VACATING_TENANT' ? (
              <p className="text-sm text-gray-400 italic">Use the Relist Property panel above to republish this listing.</p>
            ) : (
              <p className="text-sm text-gray-400 italic">No actions available for this status.</p>
            )}
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-4">
          {/* Status info card */}
          <div className="card p-4 bg-blue-50 border-blue-100">
            <h3 className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">Current Status</h3>
            <StatusBadge status={status} />
            <p className="text-xs text-blue-600 mt-2">
              {status === 'DRAFT'             && 'Complete the wizard steps and mark as ready to proceed.'}
              {status === 'READY_TO_LIST'     && 'All steps complete. Publish to make visible on the public portal.'}
              {status === 'LISTED'            && 'Visible on public portal. Open applications when ready.'}
              {status === 'APPLICATIONS_OPEN' && 'Prospects with temp access can now submit Form 18.'}
              {status === 'UNDER_REVIEW'      && 'Applications closed. Review submitted applications.'}
              {status === 'OFFER_IN_PROGRESS' && 'An offer has been accepted. Awaiting lease and bond.'}
              {status === 'VACATING_TENANT'   && 'Current tenant has given notice. Relist for future availability.'}
              {status === 'MAINTENANCE_HOLD'  && `Listing paused. Will restore to ${prevStatus ?? 'previous'} status on release.`}
              {status === 'OFF_MARKET'        && 'Property removed from public portal.'}
              {status === 'ARCHIVED'          && 'Property permanently archived.'}
            </p>
          </div>

          {/* Timeline */}
          <TimelinePanel entries={timeline} />
        </div>
      </div>

      {/* Confirm modal */}
      {pendingAction && confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          variant={confirm.variant}
          onConfirm={() => applyTransition(pendingAction)}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  )
}
