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
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6 shadow-md mb-6">
        <h1 className="text-3xl font-bold">{course.title || "Loading..."}</h1>
        <p className="mt-2 text-sm">Code: {course.code}</p>
        <p className="text-sm">Semester: {course.semester}</p>
        <p className="text-sm">Batch: {course.batch}</p>
        <p className="text-sm">Type: {course.type}</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-2">Instructor</h2>
        <div className="flex items-center space-x-4">
          <img
            src={
              teacherProfile.profile_image || "https://via.placeholder.com/100"
            }
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-medium">
              {teacherProfile.first_name} {teacherProfile.last_name}
            </p>
            <p className="text-sm text-gray-500">{teacherProfile.work}</p>
            <p className="text-sm text-gray-500">{teacherProfile.phone}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Course Description</h2>
        <p className="text-gray-700 whitespace-pre-line">
          {course.description || "No description provided."}
        </p>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg relative">
            <button
              onClick={() => setShowCreateForm(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-lg"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Create Assignment</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                value={assignmentData.title}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    title: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

              <textarea
                placeholder="Description"
                value={assignmentData.description}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    description: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                placeholder="Max Marks"
                value={assignmentData.max_marks}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    max_marks: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

              <label className="text-sm font-medium">Given Date:</label>
              <input
                type="datetime-local"
                value={assignmentData.given_date}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    given_date: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

              <label className="text-sm font-medium">Due Date:</label>
              <input
                type="datetime-local"
                value={assignmentData.due_date}
                onChange={(e) =>
                  setAssignmentData({
                    ...assignmentData,
                    due_date: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

              <select
                value={assignmentData.type}
                onChange={(e) =>
                  setAssignmentData({ ...assignmentData, type: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="Homework">Homework</option>
                <option value="Resource">Resource</option>
              </select>

              <button
                onClick={handleCreateAssignment}
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowCreateForm(true)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
      >
        ➕ Create Assignment
      </button>

      {/* list the assignments*/}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
              <div
                key={assignment?.id}
                className="bg-white shadow-md p-4 rounded-lg border border-gray-200"
              >
                <Link to={`/assignments/${assignment?.id}/submissions`}>
                  <p className="font-bold text-blue-700 hover:underline">
                    {assignment.title}
                  </p>
                </Link>

                <p className="text-sm text-gray-600 mt-1">
                  {assignment.description || "No description"}
                </p>
                <p className="text-sm mt-2">
                  📅 Given:{" "}
                  {new Date(assignment.given_date).toLocaleString("en-GB")}
                </p>
                {assignment.due_date && (
                  <p className="text-sm">
                    ⏳ Due:{" "}
                    {new Date(assignment.due_date).toLocaleString("en-GB")}
                  </p>
                )}
                <p className="text-sm">📘 Type: {assignment.type}</p>
                {assignment.max_marks !== null && (
                  <p className="text-sm">
                    🏷️ Max Marks: {assignment.max_marks}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
