import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    rememberMe: true,
    role: 'student' // Default role
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    
    // In a real app, you would save this to a database
    // For now, we'll just save to localStorage
    localStorage.setItem('user', JSON.stringify({
      fullname: formData.fullname,
      email: formData.email,
      role: formData.role,
      isAuthenticated: true
    }))
    
    // Redirect based on role
    switch(formData.role) {
      case 'student':
        navigate('/student-dashboard')
        break
      case 'teacher':
        navigate('/teacher-dashboard')
        break
      case 'admin':
        navigate('/admin-dashboard')
        break
      default:
        navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Dhaka University!
          </h1>
          <p className="text-slate-300 text-sm">
            Create your student account to access academic resources, results, and more.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="fullname" className="block text-slate-300 text-sm mb-2">
              fullname
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-slate-300 text-sm mb-2">
              username or email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-red-500 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-slate-300 text-sm mb-2">
              password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-slate-300 text-sm mb-2">
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="rememberMe" className="ml-2 text-slate-300 text-sm">
              remember me
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-slate-300 text-sm mb-3">or SignUp with:</p>
              <div className="flex justify-center space-x-4">
                <button
                  type="button"
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-12 h-12 bg-white hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Sign Up
            </button>

            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Login Here
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
