import { Link } from 'react-router-dom'

function HomePage() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isLoggedIn = user.isAuthenticated
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div>
                <Link to="/" className="flex items-center py-4">
                  <span className="font-semibold text-lg">CSEDU - Dhaka University</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                <Link to="/people" className="py-4 px-2 hover:text-blue-300 transition duration-300">People Directory</Link>
                <Link to="/chairman" className="py-4 px-2 hover:text-blue-300 transition duration-300">About Chairman</Link>
                <Link to="/admission-hub" className="py-4 px-2 hover:text-blue-300 transition duration-300">Admission Hub</Link>
                <Link to="/apply" className="py-4 px-2 hover:text-blue-300 transition duration-300">Apply Now</Link>
                <Link to="/meetings" className="py-4 px-2 hover:text-blue-300 transition duration-300">Departmental Meetings</Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm">{user.fullname}</span>
                  <Link 
                    to={`/${user.role}-dashboard`} 
                    className="py-2 px-3 bg-blue-700 hover:bg-blue-600 text-white rounded transition duration-300"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('user')
                      window.location.href = '/'
                    }}
                    className="py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded transition duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="py-2 px-3 bg-blue-700 hover:bg-blue-600 text-white rounded transition duration-300">Login</Link>
                  <Link to="/signup" className="py-2 px-3 bg-green-600 hover:bg-green-500 text-white rounded transition duration-300">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div className="bg-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Department of Computer Science & Engineering</h1>
            <h2 className="text-2xl mb-8">University of Dhaka</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Providing quality education and research in Computer Science and Engineering since 1992.
            </p>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">News & Events</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-bold">Annual CSE Fest 2023</h3>
                <p className="text-gray-600">Join us for the biggest tech event of the year!</p>
              </li>
              <li>
                <h3 className="font-bold">Research Showcase</h3>
                <p className="text-gray-600">Faculty and students present their latest research.</p>
              </li>
              <li>
                <h3 className="font-bold">Workshop on AI</h3>
                <p className="text-gray-600">Learn about the latest advancements in artificial intelligence.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Academic Programs</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-bold">Bachelor of Science (BS)</h3>
                <p className="text-gray-600">4-year undergraduate program in Computer Science.</p>
              </li>
              <li>
                <h3 className="font-bold">Master of Science (MS)</h3>
                <p className="text-gray-600">Advanced studies in specialized Computer Science fields.</p>
              </li>
              <li>
                <h3 className="font-bold">Doctor of Philosophy (PhD)</h3>
                <p className="text-gray-600">Research-focused doctoral program.</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Research Areas</h2>
            <ul className="space-y-4">
              <li>
                <h3 className="font-bold">Artificial Intelligence</h3>
                <p className="text-gray-600">Machine learning, natural language processing, computer vision.</p>
              </li>
              <li>
                <h3 className="font-bold">Data Science</h3>
                <p className="text-gray-600">Big data analytics, data mining, database systems.</p>
              </li>
              <li>
                <h3 className="font-bold">Network Security</h3>
                <p className="text-gray-600">Cybersecurity, cryptography, secure computing.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p>Department of Computer Science & Engineering</p>
              <p>Faculty of Science</p>
              <p>University of Dhaka</p>
              <p>Dhaka 1000, Bangladesh</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300">Academic Calendar</a></li>
                <li><a href="#" className="hover:text-blue-300">Faculty & Staff</a></li>
                <li><a href="#" className="hover:text-blue-300">Research Labs</a></li>
                <li><a href="#" className="hover:text-blue-300">Alumni Network</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-blue-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="hover:text-blue-300">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.016 18.6h-2.91v-4.575c0-1.084-.021-2.48-1.51-2.48-1.512 0-1.746 1.18-1.746 2.4V18.6H7.95V8.4h2.79v1.17h.042c.387-.735 1.332-1.512 2.742-1.512 2.94 0 3.489 1.935 3.489 4.447V18.6h.003z"/>
                    <circle cx="4.2" cy="4.2" r="2.4"/>
                    <path d="M5.4 18.6H3V8.4h2.4v10.2z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>© 2023 Department of Computer Science & Engineering, University of Dhaka. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
