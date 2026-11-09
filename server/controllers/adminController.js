const db = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const [[row]] = await db.query(`SELECT
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM users WHERE role = 'student') AS students,
      (SELECT COUNT(*) FROM users WHERE role = 'lecturer') AS lecturers,
      (SELECT COUNT(*) FROM users WHERE role = 'admin') AS admins,
      (SELECT COUNT(*) FROM courses) AS courses,
      (SELECT COUNT(*) FROM assignments) AS assignments,
      (SELECT COUNT(*) FROM submissions) AS submissions,
      (SELECT COUNT(DISTINCT submission_id, reviewer_id) FROM reviews) AS reviews`);
    res.json(row);
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ message: "Server error fetching stats" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["student", "lecturer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (Number(id) === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot change your own role" });
    }
    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    res.json({ message: "Role updated" });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ message: "Server error updating role" });
  }
};
