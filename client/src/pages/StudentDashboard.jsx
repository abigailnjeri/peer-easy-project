import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

const NAV = [{ key: "dashboard", label: "Dashboard", icon: "🏠" }];
const card = "bg-white rounded-2xl shadow-sm border border-midnight/5 p-6";

export default function StudentDashboard() {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [assignedReviews, setAssignedReviews] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [a, s, r] = await Promise.all([
        api.get("/assignments"),
        api.get("/submissions/mine"),
        api.get("/reviews/assigned"),
      ]);
      setAssignments(a.data);
      setSubmissions(s.data);
      setAssignedReviews(r.data);
    } catch (err) {
      setMessage({ text: "Could not load dashboard data.", type: "error" });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitProject = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("assignment_id", activeAssignment);
      formData.append("description", description);
      if (file) formData.append("file", file);

      await api.post("/submissions", formData);

      setMessage({ text: "Submission sent successfully.", type: "success" });
      setDescription("");
      setFile(null);
      setActiveAssignment(null);
      loadData();
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Could not send submission.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout
      nav={NAV}
      active="dashboard"
      onNav={() => {}}
      title="Student Dashboard"
      subtitle="Submit your work and review your peers"
    >
      {message && (
        <div
          className={`text-sm p-3.5 rounded-lg mb-6 font-medium border ${message.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <div className={card}>
          <h2 className="font-bold text-lg text-midnight mb-4">
            Your Assignments
          </h2>
          <ul className="divide-y divide-cream">
            {assignments.map((a) => (
              <li key={a.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <p className="font-semibold text-midnight">{a.title}</p>
                    <p className="text-sm text-bluegrey mt-0.5">
                      {a.course_name}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setActiveAssignment(
                        activeAssignment === a.id ? null : a.id,
                      )
                    }
                    className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${activeAssignment === a.id ? "bg-cream text-midnight border border-midnight/10" : "bg-terracotta text-white hover:bg-terracotta/90 shadow-terracotta/20"}`}
                  >
                    {activeAssignment === a.id ? "Cancel" : "Submit Project"}
                  </button>
                </div>

                {activeAssignment === a.id && (
                  <form
                    onSubmit={submitProject}
                    className="mt-4 bg-cream/50 p-4 rounded-xl border border-midnight/5"
                  >
                    <textarea
                      placeholder="Describe your submission..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta mb-3 bg-white transition-colors resize-none"
                      rows="3"
                      required
                    />
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full mb-4 text-sm text-bluegrey file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-midnight/5 file:text-midnight hover:file:bg-midnight/10 file:cursor-pointer transition-colors"
                    />
                    <button
                      disabled={submitting}
                      className="bg-midnight text-white px-5 py-2 rounded-lg font-medium hover:bg-midnight/90 transition-colors disabled:opacity-60 w-full sm:w-auto"
                    >
                      {submitting ? "Sending..." : "Send Submission"}
                    </button>
                  </form>
                )}
              </li>
            ))}
            {assignments.length === 0 && (
              <p className="text-bluegrey text-sm py-4">No assignments yet.</p>
            )}
          </ul>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={card}>
            <h2 className="font-bold text-lg text-midnight mb-4">
              My Submissions
            </h2>
            <ul className="divide-y divide-cream">
              {submissions.map((s) => (
                <li
                  key={s.id}
                  className="py-3 flex justify-between items-center first:pt-0 last:pb-0"
                >
                  <span className="font-medium text-midnight text-sm">
                    {s.assignment_title}
                  </span>
                  <span className="text-bluegrey text-xs bg-cream px-2 py-1 rounded-md">
                    {new Date(s.submitted_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
              {submissions.length === 0 && (
                <p className="text-bluegrey text-sm py-2">
                  No submissions yet.
                </p>
              )}
            </ul>
          </div>

          <div className={card}>
            <h2 className="font-bold text-lg text-midnight mb-4 flex items-center justify-between">
              Reviews Assigned
              {assignedReviews.length > 0 && (
                <span className="bg-terracotta/10 text-terracotta text-xs py-1 px-2.5 rounded-full">
                  {assignedReviews.length} pending
                </span>
              )}
            </h2>
            <ul className="divide-y divide-cream">
              {assignedReviews.map((r) => (
                <li
                  key={r.allocation_id}
                  className="py-3 flex justify-between items-center first:pt-0 last:pb-0 gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-midnight text-sm truncate">
                      {r.assignment_title}
                    </p>
                    <p className="text-xs text-bluegrey mt-0.5">
                      Anonymous Submission
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/review/${r.allocation_id}/${r.assignment_id}`)
                    }
                    className="text-sm bg-coral text-white px-4 py-1.5 rounded-lg hover:bg-coral/90 transition-colors shadow-sm shadow-coral/20 whitespace-nowrap"
                  >
                    Score
                  </button>
                </li>
              ))}
              {assignedReviews.length === 0 && (
                <p className="text-bluegrey text-sm py-2">
                  Nothing assigned to review yet.
                </p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
