import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "../components/Layout";

const NAV = [{ key: "dashboard", label: "Dashboard", icon: "🏠" }];

export default function ScoreReview() {
  const { allocationId, assignmentId } = useParams();
  const [rubrics, setRubrics] = useState([]);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/rubrics/assignment/${assignmentId}`)
      .then((res) => setRubrics(res.data))
      .catch(() => {
        setMessage({ text: "Could not load the rubric.", type: "error" });
      });
  }, [assignmentId]);

  const handleScoreChange = (rubricId, value) => {
    setScores({ ...scores, [rubricId]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    const scoreArray = Object.entries(scores).map(([rubric_id, score]) => ({
      rubric_id: Number(rubric_id),
      score: Number(score),
    }));

    try {
      await api.post("/reviews", {
        allocation_id: allocationId,
        scores: scoreArray,
        feedback,
      });
      setMessage({ text: "Review submitted. Redirecting...", type: "success" });
      setTimeout(() => navigate("/student"), 1200);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Could not submit review",
        type: "error",
      });
      setSubmitting(false);
    }
  };

  return (
    <Layout
      nav={NAV}
      active="dashboard"
      onNav={() => navigate("/student")}
      title="Score Submission"
      subtitle="Anonymous Peer Review"
      actions={
        <button
          onClick={() => navigate("/student")}
          className="text-sm font-medium text-bluegrey hover:text-midnight transition-colors"
        >
          ← Back to Dashboard
        </button>
      }
    >
      <div className="max-w-2xl mx-auto">
        {message && (
          <div
            className={`text-sm p-3.5 rounded-lg mb-6 font-medium border ${message.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl shadow-sm border border-midnight/5 p-6 md:p-8"
        >
          {rubrics.length === 0 && !message && (
            <p className="text-bluegrey text-sm mb-6 bg-cream/50 p-4 rounded-xl">
              No rubric set for this assignment yet — ask your lecturer to add
              one.
            </p>
          )}

          <div className="space-y-5 mb-8">
            {rubrics.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream/30 p-4 rounded-xl border border-midnight/5"
              >
                <label className="text-sm font-semibold text-midnight sm:w-2/3">
                  {r.criterion}{" "}
                  <span className="text-bluegrey font-normal ml-1">
                    (out of {r.max_score})
                  </span>
                </label>
                <div className="sm:w-1/3">
                  <input
                    type="number"
                    min="0"
                    max={r.max_score}
                    value={scores[r.id] || ""}
                    onChange={(e) => handleScoreChange(r.id, e.target.value)}
                    className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta bg-white transition-colors"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-midnight mb-2">
              Written Feedback
            </label>
            <textarea
              placeholder="Provide constructive feedback to your peer..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-bluegrey/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta bg-cream/30 focus:bg-white transition-colors resize-none"
              rows="4"
              required
            />
          </div>

          <button
            disabled={rubrics.length === 0 || submitting}
            className="bg-terracotta text-white px-6 py-3 rounded-lg font-medium hover:bg-terracotta/90 transition-colors shadow-sm shadow-terracotta/20 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
