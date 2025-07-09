import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './HomePage'
import Login from './Auth/Login'
import SignUp from "./Auth/SignUp"
import StudentDashboard from './StudentDashboard'
import TeacherDashboard from './TeacherDashboard'
import AdminDashboard from './AdminDashboard'
import RequireAuth from './RequireAuth'
import AdmissionHub from './Admissions/AdmissionHub'
import ProgramDetails from './Admissions/ProgramDetails'
import ProgramCourses from './Admissions/ProgramCourses'
import CourseSyllabus from './Admissions/CourseSyllabus'
import CourseDetails from './Admissions/CourseDetails'
import ApplicationForm from './Admissions/ApplicationForm'
import ApplicationSubmitted from './Admissions/ApplicationSubmitted'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admission-hub" element={<AdmissionHub />} />
        <Route path="/program/:id" element={<ProgramDetails />} />
        <Route path="/program/:programId/courses" element={<ProgramCourses />} />
        <Route path="/course/:courseId/syllabus" element={<CourseSyllabus />} />
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/application-submitted" element={<ApplicationSubmitted />} />

        {/* Protected pages */}
        <Route
          path="/student-dashboard"
          element={
            <RequireAuth allowedRole="student">
              <StudentDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <RequireAuth allowedRole="teacher">
              <TeacherDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <RequireAuth allowedRole="admin">
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App



