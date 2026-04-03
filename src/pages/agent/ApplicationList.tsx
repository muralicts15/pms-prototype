import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Bookmark, ThumbsDown, Eye, User, DollarSign, Filter, CheckCircle2 } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { APPLICATIONS } from '../../data/mockData'
import type { Application, ApplicationStatus } from '../../types'

interface Rating {
  overall: number
  employment: number
  history: number
  references: number
  pmNotes: string
}

interface AppState extends Application {
  isShortlisted: boolean
  isKeepInView: boolean
  rating: Rating | null
}

const initialState: AppState[] = APPLICATIONS.map(a => ({
  ...a,
  isShortlisted: false,
  isKeepInView:  false,
  rating:        null,
}))

function StarRating({ value, onChange, size = 16 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          className="transition-colors focus:outline-none"
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(i)}
        >
          <Star
            size={size}
            className={`transition-colors ${
              i <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

type FilterTab = 'ALL' | 'SHORTLISTED' | 'KEEP_IN_VIEW' | 'DECLINED'

export default function ApplicationList() {
  const navigate = useNavigate()
  const [apps, setApps]           = useState<AppState[]>(initialState)
  const [filterTab, setFilterTab] = useState<FilterTab>('ALL')
  const [ratingOpen, setRatingOpen]       = useState<string | null>(null)
  const [declineTarget, setDeclineTarget] = useState<string | null>(null)
  const [approveTarget, setApproveTarget] = useState<string | null>(null)
  const [draftRating, setDraftRating]     = useState<Rating>({ overall: 0, employment: 0, history: 0, references: 0, pmNotes: '' })

  function openRating(id: string) {
    const existing = apps.find(a => a.id === id)?.rating
    setDraftRating(existing ?? { overall: 0, employment: 0, history: 0, references: 0, pmNotes: '' })
    setRatingOpen(id)
  }

  function saveRating(id: string) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, rating: { ...draftRating } } : a))
    setRatingOpen(null)
  }

  function toggleShortlist(id: string) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, isShortlisted: !a.isShortlisted, isKeepInView: false } : a))
  }

  function toggleKeepInView(id: string) {
    setApps(prev => prev.map(a => a.id === id ? { ...a, isKeepInView: !a.isKeepInView, isShortlisted: false } : a))
  }

  function decline(id: string) {
    setApps(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: 'DECLINED' as ApplicationStatus, stageLabel: 'Declined', isShortlisted: false, isKeepInView: false, allowedActions: [] }
        : a
    ))
    setDeclineTarget(null)
  }

  function approveForOffer(id: string) {
    // Approve selected, decline all others
    setApps(prev => prev.map(a =>
      a.id === id
        ? { ...a, status: 'APPROVED_FOR_OFFER' as ApplicationStatus, stageLabel: 'Approved for Offer', isShortlisted: false, allowedActions: [] }
        : a.status !== 'DECLINED'
          ? { ...a, status: 'DECLINED' as ApplicationStatus, stageLabel: 'Declined', isShortlisted: false, isKeepInView: false, allowedActions: [] }
          : a
    ))
    setApproveTarget(null)
    // Navigate to lease
    navigate('/agent/leases/lease-001')
  }

  const filtered = apps.filter(a => {
    if (filterTab === 'SHORTLISTED')  return a.isShortlisted
    if (filterTab === 'KEEP_IN_VIEW') return a.isKeepInView
    if (filterTab === 'DECLINED')     return a.status === 'DECLINED'
    return true
  })

  const counts = {
    ALL:          apps.length,
    SHORTLISTED:  apps.filter(a => a.isShortlisted).length,
    KEEP_IN_VIEW: apps.filter(a => a.isKeepInView).length,
    DECLINED:     apps.filter(a => a.status === 'DECLINED').length,
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">5 Mill Point Rd, South Perth · {apps.length} received</p>
        </div>
        <button className="btn-secondary text-sm"><Filter size={14} /> Filter</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 p-1 rounded-lg w-fit">
        {(['ALL', 'SHORTLISTED', 'KEEP_IN_VIEW', 'DECLINED'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
              filterTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'SHORTLISTED'  && <Star size={12} className="fill-yellow-400 text-yellow-400" />}
            {tab === 'KEEP_IN_VIEW' && <Bookmark size={12} className="fill-blue-400 text-blue-400" />}
            {tab.replace('_', ' ')}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Application cards */}
      <div className="space-y-3">
        {filtered.map(app => (
          <div
            key={app.id}
            className={`card p-4 transition-all ${
              app.isShortlisted ? 'ring-2 ring-yellow-300 border-yellow-200' :
              app.isKeepInView  ? 'ring-2 ring-blue-200 border-blue-100' : ''
            } ${app.status === 'DECLINED' ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={18} className="text-blue-600" />
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-gray-900">{app.applicantName}</p>
                  <StatusBadge status={app.status} size="sm" />
                  {app.isShortlisted && (
                    <span className="flex items-center gap-1 text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200 font-medium">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" /> Shortlisted
                    </span>
                  )}
                  {app.isKeepInView && (
                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-medium">
                      <Bookmark size={10} className="fill-blue-400 text-blue-400" /> Keep in View
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>{app.occupation}</span>
                  <span className="flex items-center gap-1">
                    <DollarSign size={12} />{app.weeklyIncome}/wk
                  </span>
                  <span className="text-xs text-gray-400">Submitted {app.submittedAt}</span>
                </div>

                {/* Rating display */}
                {app.rating && app.rating.overall > 0 && (
                  <div className="flex items-center gap-3 mt-1">
                    <StarRating value={app.rating.overall} size={13} />
                    <span className="text-xs text-gray-500">
                      {app.rating.overall}/5 overall
                      {app.rating.pmNotes && <span className="ml-2 italic">"{app.rating.pmNotes.slice(0, 40)}{app.rating.pmNotes.length > 40 ? '…' : ''}"</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {app.status !== 'DECLINED' && app.status !== 'APPROVED_FOR_OFFER' && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Approve for Offer */}
                  <button
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                    title="Approve for Offer"
                    onClick={() => setApproveTarget(app.id)}
                  >
                    <CheckCircle2 size={13} /> Approve
                  </button>

                  {/* View application */}
                  <button
                    className="btn-ghost p-2 text-gray-500"
                    title="View application"
                    onClick={() => navigate(`/agent/applications/${app.id}`)}
                  >
                    <Eye size={16} />
                  </button>

                  {/* Rate */}
                  <button
                    className={`btn-ghost p-2 ${app.rating?.overall ? 'text-yellow-500' : 'text-gray-400'}`}
                    title="Rate applicant"
                    onClick={() => openRating(app.id)}
                  >
                    <Star size={16} className={app.rating?.overall ? 'fill-yellow-400' : ''} />
                  </button>

                  {/* Shortlist */}
                  <button
                    className={`btn-ghost p-2 ${app.isShortlisted ? 'text-yellow-500' : 'text-gray-400'}`}
                    title={app.isShortlisted ? 'Remove from shortlist' : 'Shortlist'}
                    onClick={() => toggleShortlist(app.id)}
                  >
                    <Star size={16} className={app.isShortlisted ? 'fill-yellow-400' : ''} />
                  </button>

                  {/* Keep in View */}
                  <button
                    className={`btn-ghost p-2 ${app.isKeepInView ? 'text-blue-500' : 'text-gray-400'}`}
                    title={app.isKeepInView ? 'Remove keep in view' : 'Keep in View'}
                    onClick={() => toggleKeepInView(app.id)}
                  >
                    <Bookmark size={16} className={app.isKeepInView ? 'fill-blue-400' : ''} />
                  </button>

                  {/* Decline */}
                  <button
                    className="btn-ghost p-2 text-gray-400 hover:text-red-500"
                    title="Decline"
                    onClick={() => setDeclineTarget(app.id)}
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              )}

              {/* Approved badge */}
              {app.status === 'APPROVED_FOR_OFFER' && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                    <CheckCircle2 size={13} /> Approved
                  </span>
                  <button
                    className="btn-secondary text-xs"
                    onClick={() => navigate('/agent/leases/lease-001')}
                  >
                    View Lease →
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Star size={28} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No applications in this view</p>
          </div>
        )}
      </div>

      {/* Rating modal */}
      {ratingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Rate Applicant</h2>
            <p className="text-sm text-gray-500 mb-5">
              {apps.find(a => a.id === ratingOpen)?.applicantName}
            </p>

            <div className="space-y-4">
              {/* Overall */}
              <div>
                <label className="label">Overall Rating *</label>
                <StarRating value={draftRating.overall} onChange={v => setDraftRating(d => ({ ...d, overall: v }))} size={24} />
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: 'employment', label: 'Employment' },
                  { key: 'history',    label: 'Rental History' },
                  { key: 'references', label: 'References' },
                ] as const).map(({ key, label }) => (
                  <div key={key}>
                    <label className="label">{label}</label>
                    <StarRating
                      value={draftRating[key]}
                      onChange={v => setDraftRating(d => ({ ...d, [key]: v }))}
                      size={16}
                    />
                  </div>
                ))}
              </div>

              {/* PM Notes */}
              <div>
                <label className="label">
                  PM Notes
                  <span className="text-xs text-orange-500 font-normal ml-2">Internal only — never shown to applicant</span>
                </label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="e.g. Strong candidate, long employment history, has 1 dog..."
                  value={draftRating.pmNotes}
                  onChange={e => setDraftRating(d => ({ ...d, pmNotes: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button className="btn-secondary" onClick={() => setRatingOpen(null)}>Cancel</button>
              <button
                className="btn-primary"
                disabled={draftRating.overall === 0}
                onClick={() => saveRating(ratingOpen)}
              >
                Save Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline confirm */}
      {declineTarget && (
        <ConfirmModal
          title="Decline Application?"
          message={`${apps.find(a => a.id === declineTarget)?.applicantName} will be notified that their application was unsuccessful.`}
          confirmLabel="Decline"
          variant="danger"
          onConfirm={() => decline(declineTarget)}
          onCancel={() => setDeclineTarget(null)}
        />
      )}

      {/* Approve for Offer confirm */}
      {approveTarget && (
        <ConfirmModal
          title="Approve for Offer?"
          message={`${apps.find(a => a.id === approveTarget)?.applicantName} will be selected as the tenant. All other applications will be declined. A lease draft will be created and you'll be taken to the lease screen.`}
          confirmLabel="Approve & Create Lease"
          variant="primary"
          onConfirm={() => approveForOffer(approveTarget)}
          onCancel={() => setApproveTarget(null)}
        />
      )}
    </div>
  )
}
