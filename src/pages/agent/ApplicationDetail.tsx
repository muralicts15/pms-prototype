import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, User, Briefcase, Home, Users, Phone, Mail, CheckCircle, Star } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { APPLICATIONS } from '../../data/mockData'
import { useRole } from '../../context/RoleContext'

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentRole } = useRole()
  const app = APPLICATIONS.find(a => a.id === id) ?? APPLICATIONS[0]
  const isPD = currentRole === 'PORTFOLIO_DIRECTOR'

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        onClick={() => navigate('/pm/applications')}
      >
        <ArrowLeft size={14} /> Back to Applications
      </button>

      {/* Header */}
      <div className="card p-5 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={22} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{app.applicantName}</h1>
              <p className="text-sm text-gray-500">{app.email} · {app.phone}</p>
              <p className="text-xs text-gray-400 mt-0.5">Submitted {app.submittedAt} · {app.propertyAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={app.status} />
            <button className="btn-secondary text-sm flex items-center gap-1.5">
              <FileText size={14} /> View PDF
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">

          {/* Personal Details */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <User size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">Personal Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Full Name</p><p className="font-medium">{app.applicantName}</p></div>
              <div><p className="text-gray-400 text-xs">Date of Birth</p><p className="font-medium">15 / 06 / 1990</p></div>
              <div><p className="text-gray-400 text-xs">Mobile</p><p className="font-medium">{app.phone}</p></div>
              <div><p className="text-gray-400 text-xs">Email</p><p className="font-medium">{app.email}</p></div>
              <div><p className="text-gray-400 text-xs">ID Type</p><p className="font-medium">Driver's Licence</p></div>
              <div><p className="text-gray-400 text-xs">ID Number</p><p className="font-medium">WA 1234567</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Current Address</p><p className="font-medium">14 Stirling Hwy, Claremont WA 6010</p></div>
            </div>
          </div>

          {/* Employment */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">Employment & Income</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-gray-400 text-xs">Occupation</p><p className="font-medium">{app.occupation}</p></div>
              <div><p className="text-gray-400 text-xs">Employment Type</p><p className="font-medium">Full-time Permanent</p></div>
              <div><p className="text-gray-400 text-xs">Employer</p><p className="font-medium">Perth City Council</p></div>
              <div><p className="text-gray-400 text-xs">Employer Phone</p><p className="font-medium">08 9461 3000</p></div>
              <div><p className="text-gray-400 text-xs">Net Income</p><p className="font-medium text-green-700">${app.weeklyIncome} / week</p></div>
              <div><p className="text-gray-400 text-xs">Employed Since</p><p className="font-medium">March 2021</p></div>
            </div>
          </div>

          {/* Rental History */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Home size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">Rental History</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="col-span-2"><p className="text-gray-400 text-xs">Previous Address</p><p className="font-medium">7 Hay St, Subiaco WA 6008</p></div>
              <div><p className="text-gray-400 text-xs">From</p><p className="font-medium">Jan 2021</p></div>
              <div><p className="text-gray-400 text-xs">To</p><p className="font-medium">Mar 2026</p></div>
              <div><p className="text-gray-400 text-xs">Lessor / Agent</p><p className="font-medium">Metro Property Group</p></div>
              <div><p className="text-gray-400 text-xs">Lessor Phone</p><p className="font-medium">08 9388 1234</p></div>
              <div className="col-span-2"><p className="text-gray-400 text-xs">Reason for Leaving</p><p className="font-medium">Lease ended — owner selling</p></div>
            </div>
          </div>

          {/* References */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users size={15} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">References</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Personal Reference</p>
                <p className="font-medium">David Thompson</p>
                <p className="text-gray-500 flex items-center gap-1"><Users size={12} /> Colleague</p>
                <p className="text-gray-500 flex items-center gap-1"><Phone size={12} /> 0412 111 222</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Emergency Contact</p>
                <p className="font-medium">Linda Johnson</p>
                <p className="text-gray-500 flex items-center gap-1"><Users size={12} /> Mother</p>
                <p className="text-gray-500 flex items-center gap-1"><Phone size={12} /> 0411 333 444</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* PD only — approve for offer */}
          {isPD && app.status === 'SUBMITTED' && (
            <div className="card p-4 bg-green-50 border-green-200">
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <CheckCircle size={13} /> Portfolio Director
              </p>
              <p className="text-xs text-green-600 mb-3">You have final approval authority for this application.</p>
              <button className="btn-primary w-full text-sm mb-2 flex items-center justify-center gap-1.5">
                <CheckCircle size={14} /> Approve for Offer
              </button>
              <button className="btn-danger w-full text-sm">Hard Reject</button>
            </div>
          )}

          {/* PM only — review panel */}
          {!isPD && (
            <div className="card p-4 bg-amber-50 border-amber-100">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Star size={13} /> Portfolio Manager
              </p>
              <p className="text-xs text-amber-600 mb-3">Rate and shortlist this application. Final approval requires a Portfolio Director.</p>
              <button className="btn-secondary w-full text-sm mb-2">Rate & Shortlist</button>
              <button className="btn-secondary w-full text-sm" onClick={() => navigate('/pm/applications')}>
                ← Back to Applications
              </button>
            </div>
          )}


          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Documents</p>
            <div className="space-y-2">
              {['Form 18 PDF', 'Driver\'s Licence', 'Payslip'].map(doc => (
                <div key={doc} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FileText size={14} className="text-blue-500" />
                  <span className="text-sm text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact</p>
            <div className="space-y-2 text-sm">
              <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline"><Mail size={14} />{app.email}</a>
              <a href="#" className="flex items-center gap-2 text-blue-600 hover:underline"><Phone size={14} />{app.phone}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
