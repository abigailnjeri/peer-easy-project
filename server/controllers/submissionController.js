const db = require("../config/db");

// Student submits a project for an assignment, with an uploaded file
exports.createSubmission = async (req, res) => {
  try {
    const { assignment_id, description } = req.body;
    if (!assignment_id) {
      return res.status(400).json({ message: "assignment_id is required" });
    }

    const filePath = req.file ? req.file.filename : null;

    const [result] = await db.query(
      "INSERT INTO submissions (assignment_id, student_id, description, file_path) VALUES (?, ?, ?, ?)",
      [assignment_id, req.user.id, description || null, filePath],
    );

    res
      .status(201)
      .json({
        message: "Submission received",
        id: result.insertId,
        file_path: filePath,
      });
  } catch (err) {
    console.error("Create submission error:", err);
    res.status(500).json({ message: "Server error creating submission" });
  }
};

// Student sees only their own submissions
exports.getMySubmissions = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT submissions.*, assignments.title AS assignment_title
       FROM submissions JOIN assignments ON submissions.assignment_id = assignments.id
       WHERE submissions.student_id = ?
       ORDER BY submissions.submitted_at DESC`,
      [req.user.id],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get my submissions error:", err);
    res.status(500).json({ message: "Server error fetching submissions" });
  }
};

// Lecturer sees all submissions for one of their assignments
exports.getSubmissionsForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const [rows] = await db.query(
      `SELECT submissions.*, users.full_name AS student_name
       FROM submissions JOIN users ON submissions.student_id = users.id
       WHERE submissions.assignment_id = ?
       ORDER BY submissions.submitted_at DESC`,
      [assignmentId],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get assignment submissions error:", err);
    res.status(500).json({ message: "Server error fetching submissions" });
  }
};
