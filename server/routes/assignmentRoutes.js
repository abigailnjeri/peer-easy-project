const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  createAssignment,
  getAllAssignments,
} = require("../controllers/assignmentController");

router.post("/", verifyToken, requireRole("lecturer"), createAssignment);
router.get("/", verifyToken, getAllAssignments);

module.exports = router;
