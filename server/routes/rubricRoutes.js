const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  createRubricCriterion,
  getRubricsForAssignment,
} = require("../controllers/rubricController");

router.post("/", verifyToken, requireRole("lecturer"), createRubricCriterion);
router.get("/assignment/:assignmentId", verifyToken, getRubricsForAssignment);

module.exports = router;
