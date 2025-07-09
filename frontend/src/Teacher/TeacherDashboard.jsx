import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import CreateNewCourse from './CreateNewCourse';
import MyCourses from './MyCourses';



function TeacherDashboard() {
  const [activePage, setActivePage] = useState("My Courses");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <h1 className="text-xl">📚 Dashboard Page</h1>;
      case "Create New Course":
        return <CreateNewCourse/>
      case "My Courses":
        return <MyCourses/>
      case "Finance":
        return <h1 className="text-xl">👨‍🎓 Finance Page</h1>;
      case "settings":
        return <h1 className="text-xl">📚 Courses Page</h1>;
      default:
        return <h1 className="text-xl">404 Not Found</h1>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-48 bg-slate-800 text-white p-4 space-y-4">
        <button
          className="w-full text-left hover:bg-slate-700 p-2 rounded"
          onClick={() => setActivePage("Dashboard")}
        >
          Dashboard
        </button>
        <button
          className="w-full text-left hover:bg-slate-700 p-2 rounded"
          onClick={() => setActivePage("Create New Course")}
        >
          Create New Course
        </button>
        <button
          className="w-full text-left hover:bg-slate-700 p-2 rounded"
          onClick={() => setActivePage("My Courses")}
        >
          My Courses
        </button>
        <button
          className="w-full text-left hover:bg-slate-700 p-2 rounded"
          onClick={() => setActivePage("Finance")}
        >
          Finance
        </button>
        <button
          className="w-full text-left hover:bg-slate-700 p-2 rounded"
          onClick={() => setActivePage("settings")}
        >
          Settings
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">{renderPage()}</div>
    </div>
  );
}

export default TeacherDashboard
