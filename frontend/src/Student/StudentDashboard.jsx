import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import React from "react";

import Dashboard from "./DashBoard";
import SettingsPage from "./Settings";
import Enroll from "./Enroll";
import Finance from "./Finance";



const StudentDashboard = () => {
  const [activePage, setActivePage] = useState("Enroll in a new course");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "Enroll in a new course":
        return <Enroll />
      case "My courses":
        return <h1 className="text-xl">📚 Courses Page</h1>;
      case "Finance":
        return <Finance />;
      case "settings":
        return <SettingsPage />
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
          onClick={() => setActivePage("Enroll in a new course")}
        >
          Enroll in a new course
        </button>
        <button
          className="w-full text-left hover:bg-slate-700 p-2 rounded"
          onClick={() => setActivePage("My courses")}
        >
          My courses
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
};

export default StudentDashboard;
