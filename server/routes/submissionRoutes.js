const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  createSubmission,
  getMySubmissions,
  getSubmissionsForAssignment,
} = require("../controllers/submissionController");

router.post(
  "/",
  verifyToken,
  requireRole("student"),
  upload.single("file"),
  createSubmission,
);
router.get("/mine", verifyToken, requireRole("student"), getMySubmissions);
router.get(
  "/assignment/:assignmentId",
  verifyToken,
  requireRole("lecturer", "admin"),
  getSubmissionsForAssignment,
);

module.exports = router;
