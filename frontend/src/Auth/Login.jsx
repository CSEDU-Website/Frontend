import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Login attempt:', formData)

    try {
      const response = await axios.post(`${BACKEND_URL}/v1/auth/login`, {
        email: formData.email,
        password: formData.password
      })

      const user = response.data

      if (formData.rememberMe) {
        // Store user in localStorage with rememberMe
        localStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          isAuthenticated: true
        }))
      } else {
        // Store user in sessionStorage without rememberMe
        sessionStorage.setItem('user', JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          isAuthenticated: true
        }))
      }

      // Always redirect to homepage instead of role-specific dashboard
      navigate('/')

    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side (blank white area) */}
      <div className="hidden lg:block lg:w-1/2 bg-white"></div>

      {/* Right side (login form) */}
      <div className="w-full lg:w-1/2 bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome!
            </h1>
            <p className="text-slate-400 text-sm">
              Please log in to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center bg-red-100/10 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-slate-400 text-sm mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-400 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="rememberMe" className="ml-2 text-slate-400 text-sm">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Login
            </button>

            <div className="text-center mt-2">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Sign Up Here
                </a>
              </p>
            </div>

            <div className="text-center mt-4">
              <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                Back to Homepage
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



export default Login
