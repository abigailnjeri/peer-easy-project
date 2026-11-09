const express = require("express");
const router = express.Router();
const { verifyToken, requireRole } = require("../middleware/authMiddleware");
const {
  getStats,
  getUsers,
  updateUserRole,
} = require("../controllers/adminController");

router.get("/stats", verifyToken, requireRole("admin"), getStats);
router.get("/users", verifyToken, requireRole("admin"), getUsers);
router.put(
  "/users/:id/role",
  verifyToken,
  requireRole("admin"),
  updateUserRole,
);

module.exports = router;
