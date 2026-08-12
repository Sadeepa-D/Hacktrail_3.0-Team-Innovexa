const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");
const { authenticate } = require("../middleware/auth.middleware");

// ─── Public Routes ────────────────────────────────────────────────────────────
// GET  /api/skills            → List all active skills (public feed, paginated, filterable)
// GET  /api/skills/:id        → View a single skill by ID (increments view count)

router.get("/", skillController.getAllSkills);
router.get("/:id", skillController.getSkillById);

// ─── Protected Routes (JWT required) ─────────────────────────────────────────
// GET    /api/skills/my          → List only the logged-in user's skills
// POST   /api/skills             → Post a new skill
// PUT    /api/skills/:id         → Update own skill
// DELETE /api/skills/:id         → Delete own skill
// PATCH  /api/skills/:id/toggle  → Toggle isActive on own skill

router.get("/my", authenticate, skillController.getMySkills);
router.post("/", authenticate, skillController.createSkill);
router.put("/:id", authenticate, skillController.updateSkill);
router.delete("/:id", authenticate, skillController.deleteSkill);
router.patch("/:id/toggle", authenticate, skillController.toggleSkillStatus);

module.exports = router;
