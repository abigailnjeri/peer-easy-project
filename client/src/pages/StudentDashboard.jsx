import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [assignedReviews, setAssignedReviews] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadData = async () => {
    const [a, s, r] = await Promise.all([
      api.get("/assignments"),
      api.get("/submissions/mine"),
      api.get("/reviews/assigned"),
    ]);
    setAssignments(a.data);
    setSubmissions(s.data);
    setAssignedReviews(r.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitProject = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("assignment_id", activeAssignment);
      formData.append("description", description);
      if (file) formData.append("file", file);

      await api.post("/submissions", formData);

      setMessage("Submission sent successfully.");
      setDescription("");
      setFile(null);
      setActiveAssignment(null);
      loadData();
    } catch (err) {
      console.error("Submit error:", err);
      setMessage(
        err.response?.data?.message ||
          "Could not send submission. Check the console for details.",
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">PeerEasy — Student Dashboard</h1>
          <button onClick={logout} className="text-sm text-red-500">
            Log Out
          </button>
        </div>

        {message && (
          <p className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">
            {message}
          </p>
        )}

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-3">Assignments</h2>
          <ul className="space-y-3">
            {assignments.map((a) => (
              <li key={a.id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <span>
                    {a.title}{" "}
                    <span className="text-gray-400 text-sm">
                      ({a.course_name})
                    </span>
                  </span>
                  <button
                    onClick={() =>
                      setActiveAssignment(
                        activeAssignment === a.id ? null : a.id,
                      )
                    }
                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    {activeAssignment === a.id ? "Cancel" : "Submit"}
                  </button>
                </div>
                {activeAssignment === a.id && (
                  <form
                    onSubmit={submitProject}
                    className="mt-3 bg-gray-50 p-3 rounded"
                  >
                    <textarea
                      placeholder="Describe your submission"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border rounded px-3 py-2 mb-2"
                      required
                    />
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full mb-2"
                    />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                      Send Submission
                    </button>
                  </form>
                )}
              </li>
            ))}
            {assignments.length === 0 && (
              <p className="text-gray-400 text-sm">No assignments yet.</p>
            )}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h2 className="font-semibold mb-3">My Submissions</h2>
          <ul className="space-y-2">
            {submissions.map((s) => (
              <li key={s.id} className="border-b pb-2 flex justify-between">
                <span>{s.assignment_title}</span>
                <span className="text-gray-400 text-sm">
                  {new Date(s.submitted_at).toLocaleDateString()}
                </span>
              </li>
            ))}
            {submissions.length === 0 && (
              <p className="text-gray-400 text-sm">No submissions yet.</p>
            )}
          </ul>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Reviews Assigned To Me</h2>
          <ul className="space-y-2">
            {assignedReviews.map((r) => (
              <li
                key={r.allocation_id}
                className="border-b pb-2 flex justify-between items-center"
              >
                <span>{r.assignment_title} (Anonymous Submission)</span>
                <button
                  onClick={() =>
                    navigate(`/review/${r.allocation_id}/${r.assignment_id}`)
                  }
                  className="text-sm bg-amber-500 text-white px-3 py-1 rounded"
                >
                  Score
                </button>
              </li>
            ))}
            {assignedReviews.length === 0 && (
              <p className="text-gray-400 text-sm">
                Nothing assigned to review yet.
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
