import { useNavigate } from 'react-router-dom'
import { FileText, CheckCircle, Mail } from 'lucide-react'

export default function ApplicationSubmitted() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h1>
        <p className="text-gray-500 mb-6">
          Your Form 18 application for <strong>5 Mill Point Rd, South Perth</strong> has been submitted successfully.
        </p>

        <div className="space-y-3 mb-6 text-left">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <FileText size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">PDF Generated</p>
              <p className="text-xs text-blue-600 mt-0.5">Your Form 18 PDF has been generated and stored securely.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
            <Mail size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Confirmation Email Sent</p>
              <p className="text-xs text-green-600 mt-0.5">A copy of your application PDF has been emailed to you.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-gray-700 mb-2">What happens next?</p>
          <ol className="text-sm text-gray-600 space-y-1.5">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span> The property manager will review your application</li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span> You may be contacted for reference checks</li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span> If selected, you'll receive a lease offer</li>
          </ol>
        </div>

        <div className="flex gap-3">
          <button className="btn-secondary flex-1" onClick={() => navigate('/public/search')}>
            Browse More Properties
          </button>
        </div>
      </div>
    </div>
  )
}
