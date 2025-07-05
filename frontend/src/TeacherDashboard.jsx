import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function TeacherDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in and has teacher role
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (!userData.isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (userData.role !== 'teacher') {
      navigate(`/${userData.role}-dashboard`)
      return
    }
    
    setUser(userData)
  }, [navigate])

  if (!user) return <div className="text-center p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex items-center py-4">
              <span className="font-semibold text-lg">Teacher Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{user.fullname}</span>
              <Link to="/" className="hover:text-green-300">Home</Link>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Professor {user.fullname}!</h1>
          <p className="text-gray-600">
            This is your teacher dashboard where you can manage your courses, 
            view student performance, and schedule departmental activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">My Courses</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 401: Artificial Intelligence</div>
                <div className="text-sm text-gray-600">Credits: 3.0 | Students: 45</div>
                <div className="mt-2 flex">
                  <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">View Details</button>
                  <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Grade Assignments</button>
                </div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 503: Advanced Machine Learning</div>
                <div className="text-sm text-gray-600">Credits: 3.0 | Students: 28</div>
                <div className="mt-2 flex">
                  <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">View Details</button>
                  <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Grade Assignments</button>
                </div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 604: Research Methods</div>
                <div className="text-sm text-gray-600">Credits: 3.0 | Students: 15</div>
                <div className="mt-2 flex">
                  <button className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">View Details</button>
                  <button className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Grade Assignments</button>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Student Performance</h2>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 401: Artificial Intelligence</div>
                <div className="text-sm text-gray-600 mb-2">Average Grade: B+</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 503: Advanced Machine Learning</div>
                <div className="text-sm text-gray-600 mb-2">Average Grade: A-</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">CSE 604: Research Methods</div>
                <div className="text-sm text-gray-600 mb-2">Average Grade: B</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Upcoming Schedule</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Department Meeting</div>
                <div className="text-sm text-gray-600">15 Nov, 2023 | 10:00 AM</div>
                <div className="text-sm text-gray-600">Room: Conference Hall</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Research Presentation</div>
                <div className="text-sm text-gray-600">18 Nov, 2023 | 2:00 PM</div>
                <div className="text-sm text-gray-600">Room: Seminar Room 2</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Final Exam Committee</div>
                <div className="text-sm text-gray-600">20 Nov, 2023 | 11:30 AM</div>
                <div className="text-sm text-gray-600">Room: Dean's Office</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
