const express = require("express");
const router = express.Router();
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

const adminUserController = require("../controllers/admin/admin.user.controller");
const adminSkillController = require("../controllers/admin/admin.skill.controller");
const adminOpportunityController = require("../controllers/admin/admin.opportunity.controller");

// Apply authentication & admin authorization middleware to all admin routes
router.use(authenticate, requireAdmin);

// ==========================================
// 1. ADMIN USER MANAGEMENT ROUTES
// ==========================================
router.get("/users", adminUserController.getAllUsers);
router.put("/users/:id/status", adminUserController.updateUserStatus);
router.put("/users/:id/role", adminUserController.updateUserRole);
router.delete("/users/:id", adminUserController.deleteUser);

// ==========================================
// 2. ADMIN SKILL MANAGEMENT ROUTES
// ==========================================
router.get("/skills", adminSkillController.getAllSkills);
router.put("/skills/:id/verify", adminSkillController.verifySkill);
router.patch("/skills/:id/toggle", adminSkillController.toggleSkillActive);
router.delete("/skills/:id", adminSkillController.deleteSkill);

// ==========================================
// 3. ADMIN OPPORTUNITY MANAGEMENT ROUTES
// ==========================================
router.get("/opportunities", adminOpportunityController.getAllOpportunities);
router.patch("/opportunities/:id/status", adminOpportunityController.updateOpportunityStatus);
router.put("/opportunities/:id/verify", adminOpportunityController.verifyOpportunity);
router.delete("/opportunities/:id", adminOpportunityController.deleteOpportunity);

module.exports = router;
