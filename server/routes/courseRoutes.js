const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  createCourse,
  getMyCourses,
  getAllCourses,
} = require("../controllers/courseController");

router.post("/", verifyToken, requireRole("lecturer"), createCourse);
router.get("/mine", verifyToken, requireRole("lecturer"), getMyCourses);
router.get("/", verifyToken, getAllCourses);

module.exports = router;
