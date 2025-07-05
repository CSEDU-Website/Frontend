import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in and has admin role
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (!userData.isAuthenticated) {
      navigate('/login')
      return
    }
    
    if (userData.role !== 'admin') {
      navigate(`/${userData.role}-dashboard`)
      return
    }
    
    setUser(userData)
  }, [navigate])

  if (!user) return <div className="text-center p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-purple-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex items-center py-4">
              <span className="font-semibold text-lg">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{user.fullname}</span>
              <Link to="/" className="hover:text-purple-300">Home</Link>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome, Admin {user.fullname}!</h1>
          <p className="text-gray-600">
            This is your administrative dashboard where you can manage department resources, 
            user accounts, and oversee academic operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">User Management</h2>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium">Total Users</span>
                <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">350</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-sm font-medium">Students</div>
                  <div className="text-purple-700 font-bold">280</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-sm font-medium">Teachers</div>
                  <div className="text-purple-700 font-bold">45</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-sm font-medium">Admins</div>
                  <div className="text-purple-700 font-bold">25</div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-1 rounded transition">Add User</button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded transition">View All</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Course Management</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Active Courses</div>
                <div className="text-sm text-gray-600 mb-2">Current Semester: 28 courses</div>
                <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Manage Courses</button>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Course Registration</div>
                <div className="text-sm text-gray-600 mb-2">Status: Open (closes in 5 days)</div>
                <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Manage Registration</button>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Curriculum Updates</div>
                <div className="text-sm text-gray-600 mb-2">Last updated: Oct 15, 2023</div>
                <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">View Changes</button>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Department Resources</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Computer Labs</div>
                <div className="text-sm text-gray-600">5 labs | 120 workstations</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Current Usage: 65%</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Classrooms</div>
                <div className="text-sm text-gray-600">12 rooms | Capacity: 450 students</div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Current Usage: 78%</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Library Resources</div>
                <div className="text-sm text-gray-600">5,200 books | 24 online databases</div>
                <button className="mt-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Manage Resources</button>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Recent Notifications</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <div className="font-medium">System Update</div>
                  <div className="text-xs text-gray-500">2 hours ago</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">Student portal maintenance completed successfully.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <div className="font-medium">New Faculty</div>
                  <div className="text-xs text-gray-500">1 day ago</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">Dr. Anika Rahman joined the AI research group.</div>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <div className="font-medium">Budget Approval</div>
                  <div className="text-xs text-gray-500">2 days ago</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">Annual department budget has been approved.</div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Website Management</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Content Updates</div>
                <div className="text-sm text-gray-600 mb-2">Last updated: 3 days ago</div>
                <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Edit Content</button>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Announcement System</div>
                <div className="text-sm text-gray-600 mb-2">5 active announcements</div>
                <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Manage Announcements</button>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">Event Calendar</div>
                <div className="text-sm text-gray-600 mb-2">Upcoming events: 12</div>
                <button className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Manage Events</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
