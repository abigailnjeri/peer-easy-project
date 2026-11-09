const db = require("../config/db");

// Round-robin allocation: each submission is reviewed by the author of the NEXT
// submission (wrapping around), so nobody ever reviews their own work.
// Guard: an assignment can only be allocated once (prevents duplicate allocations).
exports.allocateReviewers = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const [existing] = await db.query(
      "SELECT COUNT(*) AS total FROM allocations WHERE assignment_id = ?",
      [assignmentId],
    );
    if (existing[0].total > 0) {
      return res.status(409).json({
        message: "Reviewers have already been allocated for this assignment",
      });
    }

    const [submissions] = await db.query(
      "SELECT id, student_id FROM submissions WHERE assignment_id = ?",
      [assignmentId],
    );
    if (submissions.length < 2) {
      return res.status(400).json({
        message:
          "Need at least 2 submissions before reviewers can be allocated",
      });
    }

    for (let i = 0; i < submissions.length; i++) {
      const submission = submissions[i];
      const reviewer = submissions[(i + 1) % submissions.length];
      await db.query(
        "INSERT INTO allocations (assignment_id, submission_id, reviewer_id, status) VALUES (?, ?, ?, ?)",
        [assignmentId, submission.id, reviewer.student_id, "pending"],
      );
    }
    res.status(201).json({
      message: `Reviewers allocated for ${submissions.length} submissions`,
    });
  } catch (err) {
    console.error("Allocate reviewers error:", err);
    res.status(500).json({ message: "Server error allocating reviewers" });
  }
};

// Reviewer's to-do list. Author identity is never returned (anonymity).
exports.getMyAssignedReviews = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT allocations.id AS allocation_id, allocations.assignment_id, allocations.submission_id,
              assignments.title AS assignment_title, submissions.description AS submission_description,
              submissions.file_path
       FROM allocations
       JOIN assignments ON allocations.assignment_id = assignments.id
       JOIN submissions ON allocations.submission_id = submissions.id
       WHERE allocations.reviewer_id = ? AND allocations.status = 'pending'
       ORDER BY allocations.created_at DESC`,
      [req.user.id],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get assigned reviews error:", err);
    res.status(500).json({ message: "Server error fetching assigned reviews" });
  }
};

// Expects: { allocation_id, scores: [{ rubric_id, score }], feedback }
exports.submitReview = async (req, res) => {
  try {
    const { allocation_id, scores, feedback } = req.body;
    if (!allocation_id || !Array.isArray(scores) || scores.length === 0) {
      return res
        .status(400)
        .json({ message: "allocation_id and at least one score are required" });
    }

    const [allocRows] = await db.query(
      "SELECT * FROM allocations WHERE id = ? AND reviewer_id = ?",
      [allocation_id, req.user.id],
    );
    if (allocRows.length === 0) {
      return res
        .status(403)
        .json({ message: "This review was not assigned to you" });
    }
    const allocation = allocRows[0];
    if (allocation.status === "completed") {
      return res
        .status(409)
        .json({ message: "You have already submitted this review" });
    }

    // Validate every score against the rubric's max score
    const [rubricRows] = await db.query(
      "SELECT id, max_score FROM rubrics WHERE assignment_id = ?",
      [allocation.assignment_id],
    );
    const maxByRubric = {};
    rubricRows.forEach((r) => {
      maxByRubric[r.id] = r.max_score;
    });
    for (const s of scores) {
      if (!(s.rubric_id in maxByRubric)) {
        return res.status(400).json({ message: "Invalid rubric criterion" });
      }
      if (
        Number.isNaN(s.score) ||
        s.score < 0 ||
        s.score > maxByRubric[s.rubric_id]
      ) {
        return res
          .status(400)
          .json({ message: "A score is outside the allowed range" });
      }
    }

    for (const s of scores) {
      await db.query(
        "INSERT INTO reviews (submission_id, reviewer_id, rubric_id, score, feedback) VALUES (?, ?, ?, ?, ?)",
        [
          allocation.submission_id,
          req.user.id,
          s.rubric_id,
          s.score,
          feedback || null,
        ],
      );
    }
    await db.query("UPDATE allocations SET status = ? WHERE id = ?", [
      "completed",
      allocation_id,
    ]);

    res.status(201).json({ message: "Review submitted successfully" });
  } catch (err) {
    console.error("Submit review error:", err);
    res.status(500).json({ message: "Server error submitting review" });
  }
};

// Lecturer/admin: all review rows for an assignment (names visible to staff only)
exports.getReviewsForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const [rows] = await db.query(
      `SELECT reviews.*, rubrics.criterion, rubrics.max_score, submissions.student_id,
              studentUser.full_name AS student_name, reviewerUser.full_name AS reviewer_name
       FROM reviews
       JOIN rubrics ON reviews.rubric_id = rubrics.id
       JOIN submissions ON reviews.submission_id = submissions.id
       JOIN users AS studentUser ON submissions.student_id = studentUser.id
       JOIN users AS reviewerUser ON reviews.reviewer_id = reviewerUser.id
       WHERE submissions.assignment_id = ?
       ORDER BY reviews.reviewed_at DESC`,
      [assignmentId],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get assignment reviews error:", err);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
};

// Student: feedback received on THEIR submissions. Reviewer identity is stripped
// before sending, so anonymity holds all the way to the student's screen.
exports.getReceivedFeedback = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT reviews.submission_id, reviews.reviewer_id, reviews.score, reviews.feedback, reviews.reviewed_at,
              rubrics.criterion, rubrics.max_score, assignments.title AS assignment_title
       FROM reviews
       JOIN submissions ON reviews.submission_id = submissions.id
       JOIN rubrics ON reviews.rubric_id = rubrics.id
       JOIN assignments ON submissions.assignment_id = assignments.id
       WHERE submissions.student_id = ?
       ORDER BY reviews.reviewed_at DESC`,
      [req.user.id],
    );

    const grouped = {};
    rows.forEach((r) => {
      const key = `${r.submission_id}-${r.reviewer_id}`;
      if (!grouped[key]) {
        grouped[key] = {
          submission_id: r.submission_id,
          assignment_title: r.assignment_title,
          feedback: r.feedback,
          reviewed_at: r.reviewed_at,
          total: 0,
          max: 0,
          criteria: [],
        };
      }
      grouped[key].total += r.score;
      grouped[key].max += r.max_score;
      grouped[key].criteria.push({
        criterion: r.criterion,
        score: r.score,
        max_score: r.max_score,
      });
    });

    res.json(Object.values(grouped)); // reviewer_id is never included
  } catch (err) {
    console.error("Get received feedback error:", err);
    res.status(500).json({ message: "Server error fetching feedback" });
  }
};
