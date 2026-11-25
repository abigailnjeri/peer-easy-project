import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LecturerDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [courseForm, setCourseForm] = useState({ name: "", code: "" });
  const [assignmentForm, setAssignmentForm] = useState({
    course_id: "",
    title: "",
    description: "",
    due_date: "",
  });
  const [rubricForm, setRubricForm] = useState({
    assignment_id: "",
    criterion: "",
    max_score: 10,
  });
  const [message, setMessage] = useState(null); // { text, type }
  const [submittingCourse, setSubmittingCourse] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [submittingRubric, setSubmittingRubric] = useState(false);
  const navigate = useNavigate();

  const flash = (text, type = "success") => setMessage({ text, type });

  const loadData = async () => {
    try {
      const [c, a] = await Promise.all([
        api.get("/courses/mine"),
        api.get("/assignments"),
      ]);
      setCourses(c.data);
      setAssignments(a.data);
    } catch (err) {
      flash(
        err.response?.data?.message || "Could not load dashboard data.",
        "error",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    if (submittingCourse) return;
    setSubmittingCourse(true);
    setMessage(null);
    try {
      await api.post("/courses", courseForm);
      setCourseForm({ name: "", code: "" });
      flash("Course created.");
      await loadData();
    } catch (err) {
      flash(err.response?.data?.message || "Could not create course.", "error");
    } finally {
      setSubmittingCourse(false);
    }
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    if (submittingAssignment) return;
    setSubmittingAssignment(true);
    setMessage(null);
    try {
      await api.post("/assignments", assignmentForm);
      setAssignmentForm({
        course_id: "",
        title: "",
        description: "",
        due_date: "",
      });
      flash("Assignment created.");
      await loadData();
    } catch (err) {
      flash(
        err.response?.data?.message || "Could not create assignment.",
        "error",
      );
    } finally {
      setSubmittingAssignment(false);
    }
  };

  const addRubric = async (e) => {
    e.preventDefault();
    if (submittingRubric) return;
    setSubmittingRubric(true);
    setMessage(null);
    try {
      await api.post("/rubrics", rubricForm);
      flash(`Rubric criterion "${rubricForm.criterion}" added.`);
      setRubricForm({ ...rubricForm, criterion: "" });
    } catch (err) {
      flash(
        err.response?.data?.message || "Could not add rubric criterion.",
        "error",
      );
    } finally {
      setSubmittingRubric(false);
    }
  };

  const allocate = async (assignmentId) => {
    setMessage(null);
    try {
      await api.post(`/reviews/allocate/${assignmentId}`);
      flash("Reviewers allocated for this assignment.");
    } catch (err) {
      flash(
        err.response?.data?.message || "Could not allocate reviewers yet.",
        "error",
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">PeerEasy — Lecturer Dashboard</h1>
          <button onClick={logout} className="text-sm text-red-500">
            Log Out
          </button>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <form
            onSubmit={createCourse}
            className="bg-white p-4 rounded-xl shadow"
          >
            <h2 className="font-semibold mb-3">Create Course</h2>
            <input
              placeholder="Course name"
              value={courseForm.name}
              onChange={(e) =>
                setCourseForm({ ...courseForm, name: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <input
              placeholder="Course code (e.g. SWE3090A)"
              value={courseForm.code}
              onChange={(e) =>
                setCourseForm({ ...courseForm, code: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <button
              disabled={submittingCourse}
              className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {submittingCourse ? "Creating..." : "Create Course"}
            </button>
          </form>

          <form
            onSubmit={createAssignment}
            className="bg-white p-4 rounded-xl shadow"
          >
            <h2 className="font-semibold mb-3">Create Assignment</h2>
            <select
              value={assignmentForm.course_id}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  course_id: e.target.value,
                })
              }
              className="w-full border rounded px-3 py-2 mb-2"
              required
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
            <input
              placeholder="Title"
              value={assignmentForm.title}
              onChange={(e) =>
                setAssignmentForm({ ...assignmentForm, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2 mb-2"
              required
            />
            <textarea
              placeholder="Description"
              value={assignmentForm.description}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  description: e.target.value,
                })
              }
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="date"
              value={assignmentForm.due_date}
              onChange={(e) =>
                setAssignmentForm({
                  ...assignmentForm,
                  due_date: e.target.value,
                })
              }
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <button
              disabled={submittingAssignment}
              className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {submittingAssignment ? "Creating..." : "Create Assignment"}
            </button>
          </form>
        </div>

        <form
          onSubmit={addRubric}
          className="bg-white p-4 rounded-xl shadow mb-6"
        >
          <h2 className="font-semibold mb-3">Add Rubric Criterion</h2>
          <select
            value={rubricForm.assignment_id}
            onChange={(e) =>
              setRubricForm({ ...rubricForm, assignment_id: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mb-2"
            required
          >
            <option value="">Select assignment</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </select>
          <input
            placeholder="Criterion (e.g. Code Structure)"
            value={rubricForm.criterion}
            onChange={(e) =>
              setRubricForm({ ...rubricForm, criterion: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mb-2"
            required
          />
          <input
            type="number"
            placeholder="Max score"
            value={rubricForm.max_score}
            onChange={(e) =>
              setRubricForm({ ...rubricForm, max_score: e.target.value })
            }
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <button
            disabled={submittingRubric}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {submittingRubric ? "Adding..." : "Add Criterion"}
          </button>
        </form>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">My Assignments</h2>
          <ul className="space-y-2">
            {assignments.map((a) => (
              <li
                key={a.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {a.title}{" "}
                  <span className="text-gray-400 text-sm">
                    ({a.course_name})
                  </span>
                </span>
                <button
                  onClick={() => allocate(a.id)}
                  className="text-sm bg-amber-500 text-white px-3 py-1 rounded"
                >
                  Allocate Reviewers
                </button>
              </li>
            ))}
            {assignments.length === 0 && (
              <p className="text-gray-400 text-sm">No assignments yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
