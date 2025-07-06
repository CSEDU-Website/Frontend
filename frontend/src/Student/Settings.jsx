import React, { useState, useEffect } from "react";
import {
  Search,
  UserCircle2,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Square,
  Camera,
  Type,
  Settings,
  Code,
} from "lucide-react";

import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SettingsPage = () => {
  // State for password visibility toggles

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State for description input (for char count)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImg, setProfileImg] = useState("");

  const [preview, setPreview] = useState(null);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [user, setUser] = useState(null);
  const [studentProfile, setStudentProfile] = useState({});

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    console.log("stored user: ");
    console.log(storedUser);

    if (storedUser?.isAuthenticated && !user) {
      setUser(storedUser);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    const fetchStudent = async (userId) => {
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/auth/get/student`, {
          params: { user_id: userId },
        });
        setStudentProfile(response?.data);
      } catch (error) {
        console.error(
          "Failed to fetch student:",
          error.response?.data || error.message
        );
        throw error;
      }
    };

    if (user && user?.id) {
      fetchStudent(user?.id);
    }
  }, [user]);

  useEffect(() => {
    console.log("student profile : ");
    console.log(studentProfile);

    if (studentProfile) {
      setFirstName(studentProfile?.first_name);
      setLastName(studentProfile?.last_name);
      setDescription(studentProfile?.bio);
      setPhone(studentProfile?.phone);
      setProfileImg(studentProfile?.profile_image);
    }
  }, [studentProfile]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent full page reload

    try {
      // Your existing submit logic...
      setProfileImg(""); // or your actual logic

      const payload = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        bio: description,
        batch: studentProfile.batch,
        profile_image: "", // or updated path
      };

      const res = await axios.put(
        `${BACKEND_URL}/student/settings/update_profile/${studentProfile.id}`,
        payload
      );

      alert("Profile updated!");
      setStudentProfile(res.data);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if(!user?.email || !oldPass || !newPass) return;


        try {
        const payload = {
            email: user?.email, // use email from state
            old_pass: oldPass,
            new_pass: newPass,
        };

        const res = await axios.post(
            `${BACKEND_URL}/v1/auth/password_change`,
            payload
        );
        alert(res.data.message || "Password changed successfully!");
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
        } catch (err) {
        alert(
            err.response?.data?.detail || "Failed to change password"
        );
        }
    }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-semibold text-gray-800">
          Good Morning, {studentProfile?.last_name || "Student"}
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>
          <UserCircle2 className="w-10 h-10 text-gray-600 cursor-pointer" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
        {/* Account Settings */}
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Account settings
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column: Profile image */}
            <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mb-4 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : profileImg ? (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="w-24 h-24 text-gray-400" />
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // Preview the image locally
                  const reader = new FileReader();
                  reader.onloadend = () => setPreview(reader.result);
                  reader.readAsDataURL(file);

                  // ⛔ Don't upload yet
                  // ✅ Just prepare to send the file later or path after upload
                  setProfileImg(file); // Store file temporarily
                }}
                className="hidden"
                id="upload"
              />

              <label
                htmlFor="upload"
                className="text-orange-500 font-semibold cursor-pointer hover:underline"
              >
                Upload Photo
              </label>

              <p className="mt-2 text-sm text-gray-500 text-center">
                Under 1MB • 1:1 Ratio
              </p>
            </div>

            {/* Right column: Form */}
            <form
              className="md:w-2/3 bg-white p-6 rounded-lg shadow space-y-6"
              onSubmit={handleSubmit}
            >
              {/* Full Name */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Full name
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Email address
                </label>
                <p className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700">
                  {user?.email}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700 flex justify-between">
                  <span>Description</span>
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Batch */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Batch
                </label>
                <p className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700">
                  {studentProfile?.batch}
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  maxLength={15}
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Save button */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </section>

        {/* Change Password */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Change password
          </h2>
          <form
            className="max-w-md bg-white p-6 rounded-lg shadow space-y-6"
            onSubmit={handlePasswordChange}
          >
            {/* Old Password */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                placeholder="Current Password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-md transition"
            >
              Change Password
            </button>
          </form>
        </section>
      </main>

      {/* Footer toolbar */}
      <footer className="bg-white shadow-inner py-3 px-6 flex justify-between max-w-5xl mx-auto sticky bottom-0">
        <MapPin className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
        <Plus className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
        <Square className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
        <Camera className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
        <Type className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
        <Plus className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
        <Settings className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
        <Code className="w-6 h-6 text-gray-600 cursor-pointer hover:text-orange-500" />
      </footer>
    </div>
  );
};

export default SettingsPage;
