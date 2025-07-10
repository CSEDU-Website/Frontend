import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, UserCircle, BookOpen, Clock, User, Calendar, MoreVertical, Archive, UserMinus, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [archivedCourses, setArchivedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [selectedSession, setSelectedSession] = useState('2020-21');
  const [sortBy, setSortBy] = useState('Latest');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Enhanced mock data matching the design
  const mockCourses = [
    {
      id: 1,
      code: "MATH 101",
      title: "Mathematics for CS",
      instructor: "Dr. John Smith",
      credits: 3,
      schedule: "Mon, Wed, Fri 10:00 AM",
      enrollmentDate: "2020-09-15",
      session: "2020-21",
      students: 100,
      category: "MATH",
      status: "active",
      image: "/math-course.jpg"
    },
    {
      id: 2,
      code: "CSE 201",
      title: "Linear Algebra",
      instructor: "Dr. Sarah Johnson",
      credits: 3,
      schedule: "Tue, Thu 2:00 PM",
      enrollmentDate: "2020-09-15",
      session: "2020-21",
      students: 180,
      category: "MATH",
      status: "active",
      image: "/linear-algebra.jpg"
    },
    {
      id: 3,
      code: "CSE 301",
      title: "Artificial Intelligence",
      instructor: "Dr. Michael Chen",
      credits: 4,
      schedule: "Mon, Wed 1:00 PM",
      enrollmentDate: "2021-01-10",
      session: "2021-22",
      students: 300,
      category: "AI",
      status: "active",
      image: "/ai-course.jpg"
    },
    {
      id: 4,
      code: "CSE 401",
      title: "Data Structures & Algorithms",
      instructor: "Dr. Lisa Wang",
      credits: 4,
      schedule: "Tue, Thu, Fri 11:00 AM",
      enrollmentDate: "2021-01-10",
      session: "2021-22",
      students: 190,
      category: "CORE",
      status: "active",
      image: "/data-structures.jpg"
    }
  ];

  const mockArchivedCourses = [
    {
      id: 5,
      code: "CSE 101",
      title: "Introduction to Programming",
      instructor: "Dr. Robert Kim",
      credits: 3,
      schedule: "Mon, Wed, Fri 9:00 AM",
      enrollmentDate: "2019-09-15",
      session: "2019-20",
      students: 150,
      category: "CORE",
      status: "archived",
      image: "/programming-course.jpg"
    }
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    
    if (!storedUser?.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        setCourses(mockCourses);
        setArchivedCourses(mockArchivedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStudentCourses();
    }
  }, [user]);

  const handleUnenroll = (courseId) => {
    setCourses(courses.filter(course => course.id !== courseId));
    setActiveDropdown(null);
    // Add API call here
  };

  const handleArchive = (courseId) => {
    const courseToArchive = courses.find(course => course.id === courseId);
    if (courseToArchive) {
      setArchivedCourses([...archivedCourses, { ...courseToArchive, status: 'archived' }]);
      setCourses(courses.filter(course => course.id !== courseId));
    }
    setActiveDropdown(null);
    // Add API call here
  };

  const handleUnarchive = (courseId) => {
    const courseToUnarchive = archivedCourses.find(course => course.id === courseId);
    if (courseToUnarchive) {
      setCourses([...courses, { ...courseToUnarchive, status: 'active' }]);
      setArchivedCourses(archivedCourses.filter(course => course.id !== courseId));
    }
    // Add API call here
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Category' || course.category === selectedCategory;
    const matchesSession = course.session === selectedSession;
    return matchesSearch && matchesCategory && matchesSession;
  });

  const CourseCard = ({ course, isArchived = false }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-6xl font-bold relative">
        {course.category}
        <div className="absolute top-4 right-4 relative">
          <button 
            onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          
          {activeDropdown === course.id && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-20 min-w-[150px]">
              {!isArchived ? (
                <>
                  <button
                    onClick={() => handleArchive(course.id)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Archive size={16} />
                    Archive Course
                  </button>
                  <button
                    onClick={() => handleUnenroll(course.id)}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-red-600"
                  >
                    <UserMinus size={16} />
                    Unenroll
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleUnarchive(course.id)}
                  className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Archive size={16} />
                  Unarchive Course
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <span className="text-sm text-slate-500 font-medium">{course.category}</span>
          <h3 className="text-xl font-bold text-slate-800 mb-1">{course.title}</h3>
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
          <span>{course.session}</span>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{course.students} students</span>
          </div>
        </div>
        
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
          Go to Class
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <Link 
            to="/student-dashboard" 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          <div className="text-xl font-bold">My Courses</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <UserCircle className="text-white" size={20} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search in your courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Latest">Sort by: Latest</option>
              <option value="Oldest">Sort by: Oldest</option>
              <option value="Name">Sort by: Name</option>
            </select>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="All Category">Category: All Category</option>
              <option value="MATH">MATH</option>
              <option value="AI">AI</option>
              <option value="CORE">CORE</option>
            </select>
            
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="2020-21">Session: 2020-21</option>
              <option value="2021-22">Session: 2021-22</option>
              <option value="2022-23">Session: 2022-23</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-600">Loading courses...</div>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Courses Found</h3>
            <p className="text-slate-600 mb-6">No courses match your current filters.</p>
            <Link 
              to="/enroll-course"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Enroll in New Course
            </Link>
          </div>
        )}

        {/* Archived Courses Section */}
        {archivedCourses.length > 0 && (
          <div className="mt-12">
            <div className="bg-slate-800 text-white rounded-xl p-8 mb-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Archived Courses</h2>
                <p className="text-slate-300 mb-6">Courses you have archived for future reference</p>
                <button className="bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                  View Archives
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {archivedCourses.map(course => (
                <CourseCard key={course.id} course={course} isArchived={true} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default MyCourses;
