import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ScoreReview() {
  const { allocationId, assignmentId } = useParams();
  const [rubrics, setRubrics] = useState([]);
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState(null); // { text, type }
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Score Submission (Anonymous)</h1>
        {message && (
          <p
            className={`text-sm p-2 rounded mb-4 ${
              message.type === "error"
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message.text}
          </p>
        )}
        <form onSubmit={submit}>
          {rubrics.map((r) => (
            <div key={r.id} className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {r.criterion} (out of {r.max_score})
              </label>
              <input
                type="number"
                min="0"
                max={r.max_score}
                value={scores[r.id] || ""}
                onChange={(e) => handleScoreChange(r.id, e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          ))}
          {rubrics.length === 0 && (
            <p className="text-gray-400 text-sm mb-4">
              No rubric set for this assignment yet — ask your lecturer to add
              one.
            </p>
          )}
          <textarea
            placeholder="Written feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
            required
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
            disabled={rubrics.length === 0 || submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
