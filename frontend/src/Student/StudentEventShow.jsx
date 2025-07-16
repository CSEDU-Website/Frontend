import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Make sure lucide-react is installed

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function StudentEventShow() {
  const [events, setEvents] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/admin/events/get/all`)
      .then((res) => setEvents(res.data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-10">
      {/* Back to Dashboard Link */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link 
          to="/student-dashboard" 
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <motion.div
            key={event.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * event.id }}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(168,139,250,0.15)" }}
            onClick={() => setSelectedEvent(event)}
          >
            <div
              className="relative w-full h-48"
              onMouseEnter={() => setHovered(event.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === event.id && event.video_url && event.video_url.startsWith("http") ? (
                <motion.video
                  src={event.video_url}
                  autoPlay
                  muted
                  loop
                  className="object-cover w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <motion.img
                  src={event.image_url}
                  alt={event.name}
                  className="object-cover w-full h-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-purple-700 mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-2">{event.description}</p>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">Location:</span> {event.location}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">Start:</span> {new Date(event.start_date).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mb-1">
                <span className="font-semibold">End:</span> {new Date(event.end_date).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mb-3">
                <span className="font-semibold">Registration Deadline:</span> {new Date(event.registration_deadline).toLocaleString()}
              </div>
              <div className="mt-auto">
                {event.registration_link && event.registration_link.startsWith("http") ? (
                  <a
                    href={event.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                    onClick={e => e.stopPropagation()}
                  >
                    Registration
                  </a>
                ) : (
                  <button
                    className="inline-block w-full text-center py-2 px-4 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                    disabled
                    onClick={e => e.stopPropagation()}
                  >
                    Registration Unavailable
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for event details */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-purple-600 text-2xl font-bold"
                onClick={() => setSelectedEvent(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">{selectedEvent.name}</h2>
              <div className="mb-4">
                {selectedEvent.video_url && selectedEvent.video_url.startsWith("http") ? (
                  <video
                    src={selectedEvent.video_url}
                    controls
                    className="w-full h-64 rounded-lg mb-2 object-cover" // Added h-64 for fixed height
                  />
                ) : (
                  <img
                    src={selectedEvent.image_url}
                    alt={selectedEvent.name}
                    className="w-full rounded-lg mb-2"
                  />
                )}
              </div>
              <p className="mb-2 text-gray-700">{selectedEvent.description}</p>
              <div className="mb-1 text-sm text-gray-500">
                <span className="font-semibold">Location:</span> {selectedEvent.location}
              </div>
              <div className="mb-1 text-sm text-gray-500">
                <span className="font-semibold">Start:</span> {new Date(selectedEvent.start_date).toLocaleString()}
              </div>
              <div className="mb-1 text-sm text-gray-500">
                <span className="font-semibold">End:</span> {new Date(selectedEvent.end_date).toLocaleString()}
              </div>
              <div className="mb-3 text-sm text-gray-500">
                <span className="font-semibold">Registration Deadline:</span> {new Date(selectedEvent.registration_deadline).toLocaleString()}
              </div>
              {selectedEvent.registration_link && selectedEvent.registration_link.startsWith("http") ? (
                <a
                  href={selectedEvent.registration_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition"
                >
                  Registration
                </a>
              ) : (
                <button
                  className="inline-block w-full text-center py-2 px-4 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                  disabled
                >
                  Registration Unavailable
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}