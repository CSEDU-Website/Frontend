import React, { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminMeeting = ({ user }) => {
  const [meetings, setMeetings] = useState([]);
  const [acceptedMap, setAcceptedMap] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    date_time: "",
    meeting_url: "",
    created_by: user?.id, // admin ID (you can make this dynamic later)
  });

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/v1/meetings/upcoming`);
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async () => {
    try {
      await axios.post(`${BACKEND_URL}/v1/meetings/create`, formData);
      fetchMeetings();
      setFormData({ ...formData, title: "", date_time: "", meeting_url: "" });
    } catch (err) {
      alert(err.response?.data?.detail || "Create failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      // Replace with actual admin ID
      await axios.delete(
        `${BACKEND_URL}/v1/meetings/delete/${id}?user_id=${user?.id}`
      );
      fetchMeetings();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/v1/meetings/archive/${id}`);
      fetchMeetings();
    } catch (err) {
      console.error("Archive failed", err);
    }
  };

  const fetchAccepted = async (meetingId) => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/v1/meetings/${meetingId}/accepted`
      );
      setAcceptedMap((prev) => ({ ...prev, [meetingId]: res.data }));
    } catch (err) {
      console.error("Error fetching RSVP list", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Meeting Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Create Meeting</h3>
        <input
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="datetime-local"
          value={formData.date_time}
          onChange={(e) =>
            setFormData({ ...formData, date_time: e.target.value })
          }
        />
        <input
          placeholder="Meeting URL"
          value={formData.meeting_url}
          onChange={(e) =>
            setFormData({ ...formData, meeting_url: e.target.value })
          }
        />
        <button onClick={handleCreate}>Create</button>
      </div>

      <h3>Upcoming Meetings</h3>
      <ul>
        {meetings.map((meeting) => (
          <li key={meeting.id}>
            <strong>{meeting.title}</strong> –{" "}
            {new Date(meeting.date_time).toLocaleString()}
            <br />
            URL:{" "}
            <a
              href={meeting.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {meeting.meeting_url}
            </a>
            <br />
            <button onClick={() => handleArchive(meeting.id)}>Archive</button>
            <button onClick={() => handleDelete(meeting.id)}>Delete</button>
            <button onClick={() => fetchAccepted(meeting.id)}>
              Show RSVPs
            </button>
            {/* Show accepted teachers if available */}
            {acceptedMap[meeting.id] && (
              <ul>
                {acceptedMap[meeting.id].map((teacher) => (
                  <li key={teacher.id}>
                    👨‍🏫 {teacher.first_name} {teacher.last_name} – {teacher.work}{" "}
                    ({teacher.email})
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminMeeting;
