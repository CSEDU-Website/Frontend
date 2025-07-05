import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function StudentDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in and has student role
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (!userData.isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (userData.role !== 'student') {
      navigate(`/${userData.role}-dashboard`)
      return
    }
    
    setUser(userData)
  }, [navigate])

  if (!user) return <div className="text-center p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex items-center py-4">
              <span className="font-semibold text-lg">Student Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{user.fullname}</span>
              <Link to="/" className="hover:text-blue-300">Home</Link>
              <button 
                onClick={() => {
                  localStorage.removeItem('user')
                  navigate('/login')
                }}
                className="py-2 px-3 bg-red-600 hover:bg-red-500 rounded transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {user.fullname}!</h1>
          <p className="text-gray-600">
            This is your student dashboard where you can access all your academic information, 
            course materials, and connect with instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">My Courses</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 401: Artificial Intelligence</div>
                <div className="text-sm text-gray-600">Dr. Tasnim Rahman</div>
                <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">In Progress</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 302: Database Systems</div>
                <div className="text-sm text-gray-600">Dr. Kamrul Hasan</div>
                <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">In Progress</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 305: Software Engineering</div>
                <div className="text-sm text-gray-600">Dr. Anisur Rahman</div>
                <div className="mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded inline-block">In Progress</div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Recent Grades</h2>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">CSE 301: Operating Systems</div>
                  <div className="text-sm text-gray-600">Final Exam</div>
                </div>
                <div className="font-bold text-blue-800">A</div>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">CSE 303: Computer Networks</div>
                  <div className="text-sm text-gray-600">Midterm Exam</div>
                </div>
                <div className="font-bold text-blue-800">A-</div>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">CSE 304: Algorithm Design</div>
                  <div className="text-sm text-gray-600">Assignment #3</div>
                </div>
                <div className="font-bold text-blue-800">B+</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Upcoming Deadlines</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 401: AI Project Proposal</div>
                <div className="text-sm text-gray-600">Due: 15 Nov, 2023</div>
                <div className="mt-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded inline-block">3 days left</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 302: Database Project</div>
                <div className="text-sm text-gray-600">Due: 20 Nov, 2023</div>
                <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded inline-block">8 days left</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 305: SRS Document</div>
                <div className="text-sm text-gray-600">Due: 25 Nov, 2023</div>
                <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded inline-block">13 days left</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
