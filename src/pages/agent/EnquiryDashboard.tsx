import { useState } from 'react'
import { Phone, Mail, MessageSquare, X, Send } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import ConfirmModal from '../../components/ConfirmModal'
import { ENQUIRIES } from '../../data/mockData'
import type { Enquiry, EnquiryStatus } from '../../types'

const TRANSITIONS: Partial<Record<string, EnquiryStatus>> = {
  MARK_CONTACTED:   'CONTACTED',
  SEND_TEMP_ACCESS: 'ACCESS_SENT',
  DECLINE:          'DECLINED',
  RESEND_ACCESS:    'ACCESS_SENT',
}

export default function EnquiryDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(ENQUIRIES)
  const [pendingAction, setPending] = useState<{ id: string; code: string } | null>(null)
  const [tempAccessModal, setTempAccess] = useState<string | null>(null)
  const [notesModal, setNotesModal] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')

  function handleAction(id: string, code: string) {
    if (code === 'SEND_TEMP_ACCESS') { setTempAccess(id); return }
    if (code === 'MARK_CONTACTED')   { applyTransition(id, code); return }
    setPending({ id, code })
  }

  function applyTransition(id: string, code: string) {
    const next = TRANSITIONS[code]
    if (!next) return
    setEnquiries(prev => prev.map(e => {
      if (e.id !== id) return e
      const updated = { ...e, status: next }
      if (next === 'CONTACTED')   updated.contactedAt = 'Just now'
      if (next === 'ACCESS_SENT') updated.allowedActions = [{ code: 'RESEND_ACCESS', label: 'Resend Access', variant: 'secondary' }]
      if (next === 'DECLINED')    updated.allowedActions = []
      if (next === 'CONTACTED')   updated.allowedActions = [
        { code: 'SEND_TEMP_ACCESS', label: 'Send Temp Access', variant: 'primary' },
        { code: 'DECLINE',          label: 'Decline',          variant: 'danger' },
      ]
      return updated
    }))
    setPending(null)
    setTempAccess(null)
  }

  const counts = {
    NEW:         enquiries.filter(e => e.status === 'NEW').length,
    CONTACTED:   enquiries.filter(e => e.status === 'CONTACTED').length,
    ACCESS_SENT: enquiries.filter(e => e.status === 'ACCESS_SENT').length,
    APPLIED:     enquiries.filter(e => e.status === 'APPLIED').length,
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-sm text-gray-500 mt-0.5">12 Kings Park Rd, West Perth · {enquiries.length} total leads</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'New',         count: counts.NEW,         color: 'bg-blue-50 text-blue-700' },
          { label: 'Contacted',   count: counts.CONTACTED,   color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Access Sent', count: counts.ACCESS_SENT, color: 'bg-green-50 text-green-700' },
          { label: 'Applied',     count: counts.APPLIED,     color: 'bg-purple-50 text-purple-700' },
        ].map(s => (
          <div key={s.label} className={`card p-3 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Enquiry list */}
      <div className="space-y-3">
        {enquiries.map(enq => (
          <div key={enq.id} className="card p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{enq.enquirerName}</p>
                  <StatusBadge status={enq.status} size="sm" />
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Phone size={12} />{enq.enquirerPhone}</span>
                  <span className="flex items-center gap-1"><Mail size={12} />{enq.enquirerEmail}</span>
                </div>
                {enq.message && (
                  <p className="text-sm text-gray-600 mt-2 italic">"{enq.message}"</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Submitted {enq.submittedAt}
                  {enq.contactedAt && ` · Contacted ${enq.contactedAt}`}
                  {enq.status === 'ACCESS_SENT' && ' · Access expires in 7 days'}
                </p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {enq.allowedActions.map(action => (
                  <button
                    key={action.code}
                    className={action.variant === 'primary' ? 'btn-primary text-xs py-1.5' :
                               action.variant === 'danger'  ? 'btn-danger text-xs py-1.5'  : 'btn-secondary text-xs py-1.5'}
                    onClick={() => handleAction(enq.id, action.code)}
                  >
                    {action.label}
                  </button>
                ))}
                <button
                  className="btn-ghost text-xs py-1.5"
                  onClick={() => { setNotesModal(enq.id); setNoteText('') }}
                >
                  <MessageSquare size={12} /> Add Note
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decline confirm */}
      {pendingAction?.code === 'DECLINE' && (
        <ConfirmModal
          title="Decline Enquiry?"
          message="The prospect will be marked as not eligible. You can optionally notify them."
          confirmLabel="Decline"
          variant="danger"
          onConfirm={() => applyTransition(pendingAction.id, 'DECLINE')}
          onCancel={() => setPending(null)}
        />
      )}

      {/* Send Temp Access modal */}
      {tempAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Send Temp Access</h2>
              <button onClick={() => setTempAccess(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm text-blue-700">
              <p className="font-medium">Access will be sent to:</p>
              <p>{enquiries.find(e => e.id === tempAccessModal)?.enquirerEmail}</p>
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="label">Access Expires After</label>
                <select className="input">
                  <option>7 days (default)</option>
                  <option>14 days</option>
                  <option>30 days</option>
                </select>
              </div>
              <div>
                <label className="label">Property Access</label>
                <input className="input" readOnly value="12 Kings Park Rd, West Perth" />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
              <p className="font-medium mb-1">Email preview:</p>
              <p>Subject: Your Application Access — 12 Kings Park Rd, West Perth</p>
              <p className="mt-1 text-gray-400">Login credentials + direct apply link will be sent.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setTempAccess(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => applyTransition(tempAccessModal, 'SEND_TEMP_ACCESS')}>
                <Send size={14} /> Send Access
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add note modal */}
      {notesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Add Internal Note</h2>
              <button onClick={() => setNotesModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-xs text-orange-600 bg-orange-50 px-3 py-2 rounded mb-3">Internal only — never shown to the prospect</p>
            <textarea
              className="input resize-none mb-4"
              rows={4}
              placeholder="Add your notes here..."
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setNotesModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={() => setNotesModal(null)}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
