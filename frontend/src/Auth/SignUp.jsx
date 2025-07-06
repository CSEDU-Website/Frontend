import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
 import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student", // Default role
     batch: "", // <- Add this
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        // Prepare data to send, exclude rememberMe and fullname (if backend doesn't expect fullname)
        const user = {
        email: formData.email,
        password: formData.password,
        role: formData.role.toLowerCase(),
        };

        if (user.role === "student") {
          user.batch = formData.batch;
        }

        // Replace the URL with your actual backend URL
        const response = await axios.post(`${BACKEND_URL}/v1/auth/register`, user);

        console.log("Registration response:", response.data);

        // On success, navigate to login page
        navigate("/login");
    } catch (err) {
        // Axios error might not have response or data, so fallback safely
        setError(
          err.response?.data?.detail ||  // FastAPI typically uses `detail`
          err.response?.data?.message || // or `message` if custom
          "Registration failed. Please try again."
        );

    }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Create an Account
        </h1>

        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label
              htmlFor="email"
              className="block text-slate-300 text-sm mb-2 capitalize"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-red-500 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-slate-300 text-sm mb-2 capitalize"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-slate-300 text-sm mb-2 capitalize"
            >
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          

          {formData.role === "student" && (
            <div>
              <label
                htmlFor="batch"
                className="block text-slate-300 text-sm mb-2 capitalize"
              >
                Batch
              </label>
              <input
                type="number"
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 27"
              />
            </div>
          )}


          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Sign Up
          </button>

          <p className="text-center text-slate-400 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Login Here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

