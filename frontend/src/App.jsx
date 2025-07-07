import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './HomePage'
import Login from './Auth/Login'
import SignUp from "./Auth/SignUp"
import StudentDashboard from "./Student/StudentDashboard"
import TeacherDashboard from './Teacher/TeacherDashboard'
import AdminDashboard from './AdminDashboard'
import RequireAuth from './RequireAuth'
import TeacherClassroom from './Teacher/TeacherClassroom'
import SubmissionList from './Teacher/SubmissionList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        

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
        <Route path="/teacher/classroom/:course_id" element={<TeacherClassroom />} />
        <Route path="/assignments/:assignmentId/submissions" element={<SubmissionList />} />

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
    </BrowserRouter>
  )
}

export default App
