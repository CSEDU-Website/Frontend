import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";



const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function SubmissionList() {
  const { assignmentId } = useParams(); // URL param
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [marksMap, setMarksMap] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/v1/teacher/courses/submissions/by-assignment/${assignmentId}`
        );
        setSubmissions(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch submissions:", err);
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const handleMark = async (submissionId) => {
    const marks = marksMap[submissionId];

    try {
      await axios.post(
        `${BACKEND_URL}/v1/teacher/courses/submissions/mark`,
        null, // body is null because params are query
        {
          params: { submission_id: submissionId, marks: marks },
        }
      );
      alert("Marked successfully!");
      // Refresh list after marking
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, marks, checked: true } : s
        )
      );
    } catch (err) {
      console.error("Failed to mark submission", err);
    }
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Submissions</h2>

      {submissions.length === 0 && <p>No submissions found.</p>}

      <div className="space-y-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="p-4 border rounded-md shadow-sm bg-white flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <img
                src={sub.profile_image || "/default-avatar.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-bold">
                  {sub.first_name} {sub.last_name}
                </p>
                <p className="text-sm text-gray-500">Batch: {sub.batch}</p>
                <p className="text-sm text-blue-600 underline">
                  <a href={sub.file_links?.url} target="_blank">
                    View Submission
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Marks"
                value={marksMap[sub.id] ?? sub.marks ?? ""}
                onChange={(e) =>
                  setMarksMap({ ...marksMap, [sub.id]: e.target.value })
                }
                className="border p-1 rounded w-20 text-center"
              />
              <button
                onClick={() => handleMark(sub.id)}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                {sub.checked ? "Update" : "Mark"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
