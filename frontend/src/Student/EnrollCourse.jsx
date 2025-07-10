import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, UserCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EnrollCourse = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    email: '',
    courseCode: ''
  });

  // Authentication check and data loading
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    
    if (!storedUser?.isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setUser(storedUser);
  }, [navigate]);

  useEffect(() => {
    const fetchStudent = async (userId) => {
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/auth/get/student`, {
          params: { user_id: userId },
        });
        setStudentProfile(response?.data);
        
        // Pre-fill form with student data
        setFormData(prev => ({
          ...prev,
          firstName: response?.data?.first_name || '',
          lastName: response?.data?.last_name || '',
          registrationNumber: response?.data?.registration_number || '',
          email: response?.data?.email || user?.email || ''
        }));
      } catch (error) {
        console.error("Failed to fetch student:", error.response?.data || error.message);
      }
    };

    if (user && user?.id) {
      fetchStudent(user?.id);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate API call for course enrollment
      const response = await axios.post(`${BACKEND_URL}/v1/student/enroll-course`, {
        student_id: studentProfile.id,
        course_code: formData.courseCode,
        registration_number: formData.registrationNumber
      });

      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Successfully enrolled in the course! You can now view it in "My Courses".' 
        });
        
        // Reset course code field
        setFormData(prev => ({ ...prev, courseCode: '' }));
        
        // Redirect to My Courses after 2 seconds
        setTimeout(() => {
          navigate('/my-courses');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Enrollment failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Enrollment failed. Please check the course code and try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

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
          <div className="text-xl font-bold">
            Good Morning
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
            <UserCircle className="text-slate-500" size={24} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Enroll in a new course</h1>
          <p className="text-slate-600">Fill out the form below to enroll in a new course</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Enrollment Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50"
                  required
                  readOnly
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50"
                  required
                  readOnly
                />
              </div>
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                name="registrationNumber"
                placeholder="Enter your Reg. Num."
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50"
                required
                readOnly
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-50"
                required
                readOnly
              />
            </div>

            {/* Course Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Course Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="courseCode"
                  placeholder="Code"
                  value={formData.courseCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  required
                  maxLength={50}
                />
                <div className="absolute right-3 top-3 text-sm text-slate-400">
                  {formData.courseCode.length}/50
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter the course code (e.g., CSE 4225, MATH 101)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.courseCode.trim()}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {loading ? 'Enrolling...' : 'Enroll'}
            </button>
          </form>

          {/* Additional Information */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-slate-800 mb-2">Important Notes:</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• Make sure the course code is correct before submitting</li>
              <li>• Enrollment is subject to course availability and prerequisites</li>
              <li>• You will receive a confirmation email once enrolled</li>
              <li>• Contact the academic office for any enrollment issues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollCourse;
