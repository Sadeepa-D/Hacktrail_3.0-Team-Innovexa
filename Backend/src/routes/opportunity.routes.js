const express = require("express");
const router = express.Router();
const opportunityController = require("../controllers/opportunity.controller");
const { authenticate } = require("../middleware/auth.middleware");

// ─── Public Routes ────────────────────────────────────────────────────────────
// GET  /api/opportunities          → List all OPEN opportunities (public feed, paginated, filterable)
// GET  /api/opportunities/:id      → View a single opportunity by ID (increments view count)

router.get("/", opportunityController.getAllOpportunities);
router.get("/:id", opportunityController.getOpportunityById);

// ─── Protected Routes (JWT required) ─────────────────────────────────────────
// GET    /api/opportunities/my             → My posted opportunities (owner)
// GET    /api/opportunities/my-applications→ Applications I've submitted (applicant)
// POST   /api/opportunities               → Post a new opportunity
// PUT    /api/opportunities/:id           → Update own opportunity
// DELETE /api/opportunities/:id           → Delete own opportunity
// PATCH  /api/opportunities/:id/status    → Change status (OPEN, CLOSED, DRAFT, etc.)
// POST   /api/opportunities/:id/apply     → Apply to an opportunity
// GET    /api/opportunities/:id/applications → Owner views applications for their opportunity

router.get("/my", authenticate, opportunityController.getMyOpportunities);
router.get("/my-applications", authenticate, opportunityController.getMyApplications);
router.post("/", authenticate, opportunityController.createOpportunity);
router.put("/:id", authenticate, opportunityController.updateOpportunity);
router.delete("/:id", authenticate, opportunityController.deleteOpportunity);
router.patch("/:id/status", authenticate, opportunityController.updateOpportunityStatus);
router.post("/:id/apply", authenticate, opportunityController.applyToOpportunity);
router.get("/:id/applications", authenticate, opportunityController.getOpportunityApplications);

module.exports = router;
