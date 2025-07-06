import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const CreateNewCourse = () => {
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

  useEffect(() => {
    console.log("teacher profile");
    console.log(teacherProfile);

    if (teacherProfile) {
      setFormData((prev) => ({
        ...prev,
        teacher_id: teacherProfile.id,
      }));
    }
  }, [teacherProfile]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    other_links: "",
    semester: "",
    batch: "",
    type: "Theory",
    teacher_id: null,
    image_url: "", // optional: set to "" to use random image from backend
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData?.semester ||
      !formData?.batch ||
      !formData?.title ||
      !formData?.teacher_id
    ) {
      alert("Fill up the info");
      console.log(formData)
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description || null,
      other_links: formData.other_links || null,
      semester: formData.semester,
      batch: parseInt(formData.batch), // 👈 Ensure this is a number
      type: formData.type, // "Theory" or "Lab"
      image_url: formData.image_url || null,
      teacher_id: teacherProfile?.id, // 👈 Ensure this exists
    };

    console.log("payload");
    console.log(payload);

    try {
      const res = await axios.post(`${BACKEND_URL}/v1/courses/create`, payload);
      setMessage(res.data.message || "Course created successfully");
    } catch (err) {
      console.error("Failed to create course:", err);
      setMessage("Failed to create course");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Create Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        />

        {/* <input
          type="text"
          name="other_links"
          placeholder="Other Links"
          value={formData.other_links}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        /> */}

        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        >
          <option value="" disabled>
            Select Semester
          </option>
          <option value="1-1">1-1</option>
          <option value="1-2">1-2</option>
          <option value="2-1">2-1</option>
          <option value="2-2">2-2</option>
          <option value="3-1">3-1</option>
          <option value="3-2">3-2</option>
          <option value="4-1">4-1</option>
          <option value="4-2">4-2</option>
        </select>

        <input
          type="text"
          name="batch"
          placeholder="Batch"
          value={formData.batch}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="Theory">Theory</option>
          <option value="Lab">Lab</option>
        </select>

        {/* <input
          type="text"
          name="image_url"
          placeholder="Image URL (optional)"
          value={formData.image_url}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
        /> */}

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded"
        >
          Create Course
        </button>

        {message && <p className="text-center mt-4 text-gray-700">{message}</p>}
      </form>
    </div>
  );
};

export default CreateNewCourse;
