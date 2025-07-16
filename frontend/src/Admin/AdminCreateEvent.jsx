import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function AdminCreateEvent() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    registration_deadline: "",
    image_url: "",
    video_url: "",
    registration_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post(`${BACKEND_URL}/utility/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      setError("Failed to upload image.");
    } finally {
      setImgUploading(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await axios.post(`${BACKEND_URL}/utility/upload`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, video_url: res.data.url }));
    } catch (err) {
      setError("Failed to upload video.");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      await axios.post(`${BACKEND_URL}/admin/events/create`, form);
      setSuccess("🎉 Event created successfully!");
      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        registration_deadline: "",
        image_url: "",
        video_url: "",
        registration_link: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        <motion.h2
          className="text-3xl font-extrabold text-center mb-8 text-purple-700"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Create New Event
        </motion.h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-name"
                className="font-medium text-sm text-gray-700"
              >
                Event Name
              </label>
              <motion.input
                id="event-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Event Name"
                className="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                required
                whileFocus={{ scale: 1.03, borderColor: "#a78bfa" }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-location"
                className="font-medium text-sm text-gray-700"
              >
                Location
              </label>
              <motion.input
                id="event-location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                required
                whileFocus={{ scale: 1.03, borderColor: "#a78bfa" }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-start-date"
                className="font-medium text-sm text-gray-700"
              >
                Start Date & Time
              </label>
              <motion.input
                id="event-start-date"
                name="start_date"
                type="datetime-local"
                value={form.start_date}
                onChange={handleChange}
                className="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                required
                whileFocus={{ scale: 1.03, borderColor: "#a78bfa" }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-end-date"
                className="font-medium text-sm text-gray-700"
              >
                End Date & Time
              </label>
              <motion.input
                id="event-end-date"
                name="end_date"
                type="datetime-local"
                value={form.end_date}
                onChange={handleChange}
                className="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                required
                whileFocus={{ scale: 1.03, borderColor: "#a78bfa" }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-registration-deadline"
                className="font-medium text-sm text-gray-700"
              >
                Registration Deadline
              </label>
              <motion.input
                id="event-registration-deadline"
                name="registration_deadline"
                type="datetime-local"
                value={form.registration_deadline}
                onChange={handleChange}
                className="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                required
                whileFocus={{ scale: 1.03, borderColor: "#a78bfa" }}
              />
            </div>
            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-image"
                className="font-medium text-sm text-gray-700"
              >
                Event Image
              </label>
              <input
                id="event-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border rounded-lg p-2"
                disabled={imgUploading}
              />
              {imgUploading && (
                <span className="text-xs text-purple-500">
                  Uploading image...
                </span>
              )}
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="Event"
                  className="mt-2 rounded-lg w-full h-32 object-cover border"
                />
              )}
            </div>
            {/* Video Upload */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-video"
                className="font-medium text-sm text-gray-700"
              >
                Event Video
              </label>
              <input
                id="event-video"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="border rounded-lg p-2"
                disabled={videoUploading}
              />
              {videoUploading && (
                <span className="text-xs text-purple-500">
                  Uploading video...
                </span>
              )}
              {form.video_url && (
                <video
                  src={form.video_url}
                  controls
                  className="mt-2 rounded-lg w-full h-32 object-cover border"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="event-registration-link"
                className="font-medium text-sm text-gray-700"
              >
                Registration Link
              </label>
              <motion.input
                id="event-registration-link"
                name="registration_link"
                value={form.registration_link}
                onChange={handleChange}
                placeholder="Registration Link"
                className="border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
                whileFocus={{ scale: 1.03, borderColor: "#a78bfa" }}
              />
            </div>
          </motion.div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="event-description"
              className="font-medium text-sm text-gray-700"
            >
              Event Description
            </label>
            <motion.textarea
              id="event-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Event Description"
              className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-purple-400 outline-none"
              rows={3}
              required
              whileFocus={{ scale: 1.02, borderColor: "#a78bfa" }}
            />
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </motion.button>
          {success && (
            <motion.div
              className="text-green-600 text-center font-semibold mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              className="text-red-600 text-center font-semibold mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}