import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './Login.jsx'
import HomePage from './HomePage.jsx'
import StudentDashboard from './StudentDashboard.jsx'
import TeacherDashboard from './TeacherDashboard.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import RequireAuth from './RequireAuth.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<App />} />
        
        {/* Protected routes */}
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
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
