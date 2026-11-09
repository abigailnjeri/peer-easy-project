const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  allocateReviewers,
  getMyAssignedReviews,
  submitReview,
  getReviewsForAssignment,
  getReceivedFeedback,
} = require("../controllers/reviewController");

router.post(
  "/allocate/:assignmentId",
  verifyToken,
  requireRole("lecturer"),
  allocateReviewers,
);
router.get(
  "/assigned",
  verifyToken,
  requireRole("student"),
  getMyAssignedReviews,
);
router.get(
  "/received",
  verifyToken,
  requireRole("student"),
  getReceivedFeedback,
);
router.post("/", verifyToken, requireRole("student"), submitReview);
router.get(
  "/assignment/:assignmentId",
  verifyToken,
  requireRole("lecturer", "admin"),
  getReviewsForAssignment,
);

module.exports = router;
