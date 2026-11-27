const db = require("../config/db");

exports.createCourse = async (req, res) => {
  try {
    const { name, code } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: "name and code are required" });
    }
    const [result] = await db.query(
      "INSERT INTO courses (name, code, lecturer_id) VALUES (?, ?, ?)",
      [name, code, req.user.id],
    );
    res
      .status(201)
      .json({ message: "Course created", id: result.insertId, name, code });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Server error creating course" });
  }
};

exports.getMyCourses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM courses WHERE lecturer_id = ? ORDER BY created_at DESC",
      [req.user.id],
    );
    res.json(rows);
  } catch (err) {
    console.error("Get courses error:", err);
    res.status(500).json({ message: "Server error fetching courses" });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT courses.*, users.full_name AS lecturer_name
       FROM courses JOIN users ON courses.lecturer_id = users.id
       ORDER BY courses.created_at DESC`,
    );
    res.json(rows);
  } catch (err) {
    console.error("Get all courses error:", err);
    res.status(500).json({ message: "Server error fetching courses" });
  }
};
