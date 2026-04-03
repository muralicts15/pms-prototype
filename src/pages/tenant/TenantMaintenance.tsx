import { useState } from 'react'
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react'

type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'
type Priority = 'URGENT' | 'ROUTINE'

interface MaintenanceRequest {
  id: string
  title: string
  description: string
  area: string
  priority: Priority
  status: RequestStatus
  submittedDate: string
  updatedDate: string
  agentNote: string | null
}

const INITIAL_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'mr-001',
    title: 'Hot water system not heating',
    description: 'Hot water has been cold since yesterday morning. Checked pilot light — appears off.',
    area: 'Laundry',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    submittedDate: '1 Apr 2026',
    updatedDate: '2 Apr 2026',
    agentNote: 'Plumber booked for 3 April between 9am–12pm. Please ensure access.',
  },
  {
    id: 'mr-002',
    title: 'Leaking tap — kitchen sink',
    description: 'Cold tap dripping constantly. Getting worse over past 2 weeks.',
    area: 'Kitchen',
    priority: 'ROUTINE',
    status: 'OPEN',
    submittedDate: '28 Mar 2026',
    updatedDate: '28 Mar 2026',
    agentNote: null,
  },
  {
    id: 'mr-003',
    title: 'Flyscreen door torn',
    description: 'Main entry flyscreen has a tear approximately 15cm wide at bottom corner. Insects entering.',
    area: 'Entry',
    priority: 'ROUTINE',
    status: 'COMPLETED',
    submittedDate: '10 Mar 2026',
    updatedDate: '20 Mar 2026',
    agentNote: 'Flyscreen replaced by contractor on 20 March. Please confirm resolved.',
  },
]

const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; icon: typeof Clock }> = {
  OPEN:        { label: 'Open',        color: 'bg-blue-50 text-blue-700 border-blue-200',    icon: Clock },
  IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Wrench },
  COMPLETED:   { label: 'Completed',   color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 },
}

const PRIORITY_COLORS: Record<Priority, string> = {
  URGENT:  'bg-red-100 text-red-700 border-red-200',
  ROUTINE: 'bg-gray-100 text-gray-600 border-gray-200',
}

const AREAS = ['Kitchen', 'Bathroom', 'Laundry', 'Living Room', 'Bedroom', 'Backyard', 'Entry', 'Garage', 'Other']

export default function TenantMaintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(INITIAL_REQUESTS)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [area, setArea]             = useState('')
  const [priority, setPriority]     = useState<Priority>('ROUTINE')

  function submitRequest() {
    const newReq: MaintenanceRequest = {
      id: `mr-${Date.now()}`,
      title, description, area, priority,
      status: 'OPEN',
      submittedDate: '2 Apr 2026',
      updatedDate: '2 Apr 2026',
      agentNote: null,
    }
    setRequests(prev => [newReq, ...prev])
    setShowForm(false)
    setTitle(''); setDescription(''); setArea(''); setPriority('ROUTINE')
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-xl font-bold text-gray-900">Maintenance</h1>
        <button
          className="btn-primary text-sm flex items-center gap-1.5"
          onClick={() => setShowForm(true)}
        >
          <Plus size={14} /> New Request
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-5">12 Kings Park Rd, West Perth WA 6005</p>

      {/* New request form */}
      {showForm && (
        <div className="card p-4 mb-4 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-blue-800">New Maintenance Request</h2>
            <button onClick={() => setShowForm(false)}><X size={15} className="text-gray-400" /></button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="label">Issue Title *</label>
              <input className="input" placeholder="e.g. Leaking tap in bathroom" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Area *</label>
                <select className="input" value={area} onChange={e => setArea(e.target.value)}>
                  <option value="">Select area...</option>
                  {AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select className="input" value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent (safety / no hot water / roof leak)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Description *</label>
              <textarea
                className="input w-full h-24 resize-none text-sm"
                placeholder="Describe the issue in detail — when it started, what you've observed..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            {priority === 'URGENT' && (
              <div className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                <AlertTriangle size={13} className="flex-shrink-0 mt-0.5" />
                <span>For urgent safety issues (gas leak, no power, flooding) call emergency services first, then contact your agent directly on 0411 234 567.</span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                className="btn-primary text-sm"
                disabled={!title.trim() || !description.trim() || !area}
                onClick={submitRequest}
              >
                Submit Request
              </button>
              <button className="btn-secondary text-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Request list */}
      <div className="space-y-3">
        {requests.map(req => {
          const cfg = STATUS_CONFIG[req.status]
          const Icon = cfg.icon
          return (
            <div key={req.id} className="card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{req.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{req.area} · Submitted {req.submittedDate}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${PRIORITY_COLORS[req.priority]}`}>
                    {req.priority}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                    <Icon size={11} /> {cfg.label}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-2">{req.description}</p>
              {req.agentNote && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
                  <strong>Agent:</strong> {req.agentNote}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
        <strong>Emergency?</strong> For urgent repairs (gas leak, flooding, electrical hazard) call emergency services, then contact Sarah Mitchell directly: 0411 234 567.
      </div>
    </div>
  )
}
