import { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";

const NAV = [{ key: "dashboard", label: "Dashboard", icon: "🏠" }];
const card = "bg-white rounded-2xl shadow-sm border border-midnight/5 p-6";

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
  const [message, setMessage] = useState(null);
  const [submittingCourse, setSubmittingCourse] = useState(false);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);
  const [submittingRubric, setSubmittingRubric] = useState(false);

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

  return (
    <Layout
      nav={NAV}
      active="dashboard"
      onNav={() => {}}
      title="Lecturer Dashboard"
      subtitle="Manage your courses, assignments and rubrics"
    >
      {message && (
        <div
          className={`text-sm p-3.5 rounded-lg mb-6 font-medium border ${message.type === "error" ? "bg-red-50 text-red-700 border-red-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"}`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <form onSubmit={createCourse} className={card}>
          <h2 className="font-bold text-lg text-midnight mb-4">
            Create Course
          </h2>
          <input
            placeholder="Course name"
            value={courseForm.name}
            onChange={(e) =>
              setCourseForm({ ...courseForm, name: e.target.value })
            }
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta mb-3 bg-cream/30 focus:bg-white transition-colors"
            required
          />
          <input
            placeholder="Course code (e.g. SWE3090A)"
            value={courseForm.code}
            onChange={(e) =>
              setCourseForm({ ...courseForm, code: e.target.value })
            }
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta mb-4 bg-cream/30 focus:bg-white transition-colors"
            required
          />
          <button
            disabled={submittingCourse}
            className="bg-terracotta text-white px-5 py-2.5 rounded-lg font-medium hover:bg-terracotta/90 transition-colors disabled:opacity-60 shadow-sm shadow-terracotta/20"
          >
            {submittingCourse ? "Creating..." : "Create Course"}
          </button>
        </form>

        <form onSubmit={createAssignment} className={card}>
          <h2 className="font-bold text-lg text-midnight mb-4">
            Create Assignment
          </h2>
          <select
            value={assignmentForm.course_id}
            onChange={(e) =>
              setAssignmentForm({
                ...assignmentForm,
                course_id: e.target.value,
              })
            }
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta mb-3 bg-cream/30 focus:bg-white transition-colors cursor-pointer"
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
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta mb-3 bg-cream/30 focus:bg-white transition-colors"
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
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta mb-3 bg-cream/30 focus:bg-white transition-colors resize-none"
            rows="2"
          />
          <input
            type="date"
            value={assignmentForm.due_date}
            onChange={(e) =>
              setAssignmentForm({ ...assignmentForm, due_date: e.target.value })
            }
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta mb-4 bg-cream/30 focus:bg-white transition-colors cursor-pointer"
          />
          <button
            disabled={submittingAssignment}
            className="bg-terracotta text-white px-5 py-2.5 rounded-lg font-medium hover:bg-terracotta/90 transition-colors disabled:opacity-60 shadow-sm shadow-terracotta/20"
          >
            {submittingAssignment ? "Creating..." : "Create Assignment"}
          </button>
        </form>
      </div>

      <form onSubmit={addRubric} className={`${card} mb-6`}>
        <h2 className="font-bold text-lg text-midnight mb-4">
          Add Rubric Criterion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            value={rubricForm.assignment_id}
            onChange={(e) =>
              setRubricForm({ ...rubricForm, assignment_id: e.target.value })
            }
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta bg-cream/30 focus:bg-white transition-colors cursor-pointer"
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
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta bg-cream/30 focus:bg-white transition-colors"
            required
          />
          <input
            type="number"
            placeholder="Max score"
            value={rubricForm.max_score}
            onChange={(e) =>
              setRubricForm({ ...rubricForm, max_score: e.target.value })
            }
            className="w-full border border-bluegrey/30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta bg-cream/30 focus:bg-white transition-colors"
          />
        </div>
        <button
          disabled={submittingRubric}
          className="bg-terracotta text-white px-5 py-2.5 rounded-lg font-medium hover:bg-terracotta/90 transition-colors disabled:opacity-60 shadow-sm shadow-terracotta/20"
        >
          {submittingRubric ? "Adding..." : "Add Criterion"}
        </button>
      </form>

      <div className={card}>
        <h2 className="font-bold text-lg text-midnight mb-4">My Assignments</h2>
        <ul className="divide-y divide-cream">
          {assignments.map((a) => (
            <li
              key={a.id}
              className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-midnight">{a.title}</p>
                <p className="text-sm text-bluegrey mt-0.5">{a.course_name}</p>
              </div>
              <button
                onClick={() => allocate(a.id)}
                className="text-sm bg-midnight text-white px-4 py-2 rounded-lg hover:bg-midnight/90 transition-colors shadow-sm"
              >
                Allocate Reviewers
              </button>
            </li>
          ))}
          {assignments.length === 0 && (
            <p className="text-bluegrey text-sm py-4">No assignments yet.</p>
          )}
        </ul>
      </div>
    </Layout>
  );
}
