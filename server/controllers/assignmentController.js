const db = require('../config/db');

// Lecturer creates an assignment under one of their courses
exports.createAssignment = async (req, res) => {
  try {
    const { course_id, title, description, due_date } = req.body;
    if (!course_id || !title) {
      return res.status(400).json({ message: 'course_id and title are required' });
    }

    // Make sure this course actually belongs to this lecturer
    const [courseRows] = await db.query(
      'SELECT id FROM courses WHERE id = ? AND lecturer_id = ?',
      [course_id, req.user.id]
    );
    if (courseRows.length === 0) {
      return res.status(403).json({ message: 'You do not own this course' });
    }

    const [result] = await db.query(
      'INSERT INTO assignments (course_id, title, description, due_date) VALUES (?, ?, ?, ?)',
      [course_id, title, description || null, due_date || null]
    );
    res.status(201).json({ message: 'Assignment created', id: result.insertId });
  } catch (err) {
    console.error('Create assignment error:', err);
    res.status(500).json({ message: 'Server error creating assignment' });
  }
};

// Everyone logged in can see all assignments (students need this to submit)
exports.getAllAssignments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT assignments.*, courses.name AS course_name, courses.code AS course_code
       FROM assignments JOIN courses ON assignments.course_id = courses.id
       ORDER BY assignments.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Get assignments error:', err);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
};
