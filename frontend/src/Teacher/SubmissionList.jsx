import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, User, Calendar, Award } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function SubmissionList() {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState({});
  const [loading, setLoading] = useState(true);
  const [marksMap, setMarksMap] = useState({});
  const [courseId, setCourseId] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // First, get the assignment details to find the course_id
        const assignmentRes = await axios.get(
          `${BACKEND_URL}/v1/teacher/courses/assignments/get/${assignmentId}`
        );

        console.log(assignmentRes.data)

        if (assignmentRes.data) {
          setAssignment(assignmentRes.data);
          setCourseId(assignmentRes.data.course_id);
        }

        // Then fetch the submissions
        const submissionsRes = await axios.get(
          `${BACKEND_URL}/v1/teacher/courses/submissions/by-assignment/${assignmentId}`
        );
        console.log(submissionsRes.data)
        setSubmissions(submissionsRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const handleMark = async (submissionId) => {
    const marks = marksMap[submissionId];

    if (marks === undefined || marks === "") {
      alert("Please enter marks");
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/v1/teacher/courses/submissions/mark`,
        null,
        {
          params: { submission_id: submissionId, marks: marks },
        }
      );

      alert("Marked successfully!");

      // Update the submission in the local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, marks: parseInt(marks), checked: true } : s
        )
      );

      // Clear the marks input
      setMarksMap((prev) => ({ ...prev, [submissionId]: "" }));
    } catch (err) {
      console.error("Failed to mark submission", err);
      alert("Failed to mark submission");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to={`/teacher/classroom/${courseId || ''}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm font-medium">Back to Classroom</span>
            </Link>
            <div className="h-6 border-l border-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-800">Assignment Submissions</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Assignment Info */}
        {submissions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Assignment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <span className="font-medium">ID:</span>
                <span className="text-gray-600">{assignmentId}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-gray-500" />
                <span className="font-medium">Total Submissions:</span>
                <span className="text-gray-600">{submissions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} className="text-gray-500" />
                <span className="font-medium">Checked:</span>
                <span className="text-gray-600">
                  {submissions.filter((s) => s.checked).length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Submissions</h2>
          </div>

          {submissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-4xl mb-4">📝</div>
              <p className="text-gray-600">No submissions found.</p>
              <p className="text-sm text-gray-500">Students haven't submitted yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={submission.profile_image || "https://via.placeholder.com/48"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-800">
                          {submission.first_name} {submission.last_name}
                        </p>
                        <p className="text-sm text-gray-600">Batch: {submission.batch}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Calendar size={14} />
                          <span>Submitted: {formatDate(submission.submitted_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* File Link */}
                      {submission.file_links?.url && (
                        <a
                          href={submission.file_links.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium transition-colors"
                        >
                          <FileText size={16} />
                          View Submission
                        </a>
                      )}

                      {/* Marks Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Marks"
                          value={marksMap[submission.id] ?? submission.marks ?? ""}
                          onChange={(e) =>
                            setMarksMap({ ...marksMap, [submission.id]: e.target.value })
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleMark(submission.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            submission.checked
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-orange-500 hover:bg-orange-600 text-white"
                          }`}
                        >
                          {submission.checked ? "Update" : "Mark"}
                        </button>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          submission.checked
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {submission.checked ? "Checked" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
