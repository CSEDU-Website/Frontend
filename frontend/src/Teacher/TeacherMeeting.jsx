import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeacherMeeting = ({ user, teacherProfile }) => {
  const [meetings, setMeetings] = useState([]);
  const [rsvps, setRsvps] = useState({}); // meeting_id -> "yes"/"no"/null

  // Fetch upcoming meetings
  const fetchMeetings = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/v1/meetings/upcoming`);
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings", err);
    }
  };

  // Submit RSVP
  const submitRSVP = async (meeting_id, response) => {
    try {
      await axios.post(`${BACKEND_URL}/v1/meetings/rsvp`, {
        user_id: user?.id,
        meeting_id,
        response,
      });
      setRsvps((prev) => ({ ...prev, [meeting_id]: response }));
      alert("RSVP submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || "RSVP failed");
    }
  };

  const fetchRSVPStatus = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/v1/meetings/rsvp-status/${user?.id}`
      );
      const statusMap = {};
      res.data.forEach((item) => {
        statusMap[item.meeting_id] = item.response.toLowerCase();
      });
      setRsvps(statusMap);
    } catch (err) {
      console.error("Error fetching RSVP status", err);
    }
  };

  useEffect(() => {
    fetchMeetings();
    fetchRSVPStatus();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {teacherProfile?.first_name}!</h2>
      <h3>Upcoming Meetings</h3>

      <ul>
        {meetings.map((meeting) => (
          <li key={meeting.id} style={{ marginBottom: "15px" }}>
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
            {rsvps[meeting.id] ? (
              <p>
                ✅ You responded:{" "}
                <strong>{rsvps[meeting.id].toUpperCase()}</strong>
              </p>
            ) : (
              <div>
                RSVP:
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => submitRSVP(meeting.id, "yes")}
                >
                  ✅ Yes
                </button>
                <button
                  style={{ marginLeft: "5px" }}
                  onClick={() => submitRSVP(meeting.id, "no")}
                >
                  ❌ No
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeacherMeeting;
