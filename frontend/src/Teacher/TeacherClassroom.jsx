import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function TeacherClassroom() {
  const { course_id } = useParams();
  const [course, setCourse] = useState({});

  const [user, setUser] = useState(null);
  const [teacherProfile, setTeacherProfile] = useState({});

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    console.log("stored user: ");
    console.log(storedUser);

    if (storedUser?.isAuthenticated && !user) {
      setUser(storedUser);
    }

    async function getClassById(courseId) {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/v1/teacher/courses/my_class/${courseId}`
        );
        setCourse(response?.data);
      } catch (error) {
        console.error("Failed to fetch class by ID:", error);
        throw error;
      }
    }

    if (course_id) {
      getClassById(course_id);
    }
  }, []);

  useEffect(() => {
    const fetchTeacherProfile = async (userId) => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/v1/teacher/profile/get`,
          {
            params: { userId },
          }
        );
        setTeacherProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch teacher profile:", error);
      }
    };

    if (user && user?.id) {
      fetchTeacherProfile(user?.id);
    }
  }, [user]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    description: "",
    max_marks: "",
    due_date: "",
    given_date: new Date().toISOString().slice(0, 16), // prefill with now
    type: "Homework", // or "Resource"
    file_links: {}, // can extend this
  });

  const handleCreateAssignment = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/v1/teacher/courses/assignments/create?teacher_id=${teacherProfile.id}`,
        {
          ...assignmentData,
          course_id: course.id,
        }
      );
      console.log("Assignment created:", response.data);
      setShowCreateForm(false);
      setAssignmentData({
        title: "",
        description: "",
        max_marks: "",
        due_date: "",
        given_date: new Date().toISOString().slice(0, 16),
        type: "Homework",
        file_links: {},
      });
      // Refresh list if needed
    } catch (error) {
      console.error("Error creating assignment", error);
    }
  };

  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!teacherProfile?.id || !course?.id) return;

      try {
        const res = await axios.get(
          `${BACKEND_URL}/v1/teacher/courses/assignments/get/all`,
          {
            params: {
              teacher_id: teacherProfile.id,
              course_id: course.id,
            },
          }
        );
        setAssignments(res.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, [teacherProfile, course]);

  useEffect( () => {
    console.log(assignments)
  }, [assignments])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/teacher-dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course header card - enhanced with course image */}
        <div className="rounded-xl shadow-lg overflow-hidden mb-8">
          <div 
            className="relative h-48 sm:h-64 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${course.image_url || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'})` 
            }}
          >
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/70 to-blue-800/30"></div>
            
            {/* Course badge - in top right */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-medium border border-white/10">
              {course.type || "Course"}
            </div>
            
            {/* Course content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-indigo-100 bg-opacity-20 text-sm font-medium text-white mr-2">
                  {course.code}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-shadow-sm">{course.title || "Loading..."}</h1>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="flex items-center text-sm text-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Batch: {course.batch || "N/A"}
                </div>
                <div className="flex items-center text-sm text-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Semester: {course.semester || "N/A"}
                </div>
                <div className="flex items-center text-sm text-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {course.duration ? `${course.duration} weeks` : "Ongoing"}
                </div>
                <div className="flex items-center text-sm text-indigo-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {course.students_count || "0"} Students
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Instructor card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Instructor
                </h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <img
                    src={teacherProfile.profile_image || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover ring-2 ring-indigo-100"
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-lg font-medium text-gray-800">
                      {teacherProfile.first_name} {teacherProfile.last_name}
                    </p>
                    <p className="text-sm text-gray-500">{teacherProfile.work}</p>
                    <p className="text-sm text-gray-500">{teacherProfile.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course description */}
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Course Description
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">
                    {course.description || "No description provided."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Assignments
                  </h2>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Assignment
                  </button>
                </div>

                {assignments.length === 0 ? (
                  <div className="text-center py-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-gray-500">No assignments created yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment?.id}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                      >
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <Link to={`/assignments/${assignment?.id}/submissions`}>
                              <h3 className="text-lg font-semibold text-indigo-700 hover:text-indigo-900 transition-colors">
                                {assignment.title}
                              </h3>
                            </Link>
                            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                              {assignment.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {assignment.description || "No description"}
                          </p>
                          <div className="flex flex-wrap gap-y-1 text-xs text-gray-500">
                            <div className="w-full sm:w-1/2 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Given: {new Date(assignment.given_date).toLocaleString("en-GB")}
                            </div>
                            {assignment.due_date && (
                              <div className="w-full sm:w-1/2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Due: {new Date(assignment.due_date).toLocaleString("en-GB")}
                              </div>
                            )}
                            {assignment.max_marks !== null && (
                              <div className="w-full sm:w-1/2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Max Marks: {assignment.max_marks}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create assignment modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
              <h2 className="text-xl font-semibold text-white">Create Assignment</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Assignment title"
                    value={assignmentData.title}
                    onChange={(e) => setAssignmentData({...assignmentData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Assignment description"
                    value={assignmentData.description}
                    onChange={(e) => setAssignmentData({...assignmentData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks</label>
                    <input
                      type="number"
                      placeholder="Maximum marks"
                      value={assignmentData.max_marks}
                      onChange={(e) => setAssignmentData({...assignmentData, max_marks: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={assignmentData.type}
                      onChange={(e) => setAssignmentData({...assignmentData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="Homework">Homework</option>
                      <option value="Resource">Resource</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Given Date</label>
                  <input
                    type="datetime-local"
                    value={assignmentData.given_date}
                    onChange={(e) => setAssignmentData({...assignmentData, given_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="datetime-local"
                    value={assignmentData.due_date}
                    onChange={(e) => setAssignmentData({...assignmentData, due_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleCreateAssignment}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Create Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
