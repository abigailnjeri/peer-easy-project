const db = require("../config/db");

exports.createRubricCriterion = async (req, res) => {
  try {
    const { assignment_id, criterion, max_score } = req.body;
    if (!assignment_id || !criterion) {
      return res
        .status(400)
        .json({ message: "assignment_id and criterion are required" });
    }
    const [result] = await db.query(
      "INSERT INTO rubrics (assignment_id, criterion, max_score) VALUES (?, ?, ?)",
      [assignment_id, criterion, max_score || 10],
    );
    res
      .status(201)
      .json({ message: "Rubric criterion added", id: result.insertId });
  } catch (err) {
    console.error("Create rubric error:", err);
    res.status(500).json({ message: "Server error creating rubric criterion" });
  }
};
exports.getRubricsForAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM rubrics WHERE assignment_id = ?",
      [assignmentId],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get rubrics error:", err);
    res.status(500).json({ message: "Server error fetching rubric" });
  }
};
