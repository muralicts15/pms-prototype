import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="card max-w-sm w-full p-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
          <span className="font-bold text-gray-900">PMS Rentals</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to access your application</p>

        <div className="space-y-4 mb-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" defaultValue="sarah.j@email.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" defaultValue="••••••••" />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-xs text-blue-700">
          <p className="font-medium">Temp Access Login</p>
          <p className="mt-0.5">You have temp access for: <strong>5 Mill Point Rd, South Perth</strong></p>
          <p className="mt-0.5 text-blue-500">Expires in 7 days</p>
        </div>

        <button className="btn-primary w-full mb-3" onClick={() => navigate('/applicant/apply')}>
          <LogIn size={15} /> Sign In & Apply
        </button>
        <button className="btn-ghost w-full text-sm" onClick={() => navigate('/public/search')}>
          Back to Search
        </button>
      </div>
    </div>
  )
}
