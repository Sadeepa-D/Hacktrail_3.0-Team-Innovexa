const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");

// ─── Public Search Routes ───────────────────────────────────────────────────
// GET /api/search/users?q=...   → Live search user profile suggestions
// GET /api/search/profile/:id   → Public profile view for a specific user

router.get("/users", searchController.searchUsers);
router.get("/profile/:id", searchController.getPublicProfile);

module.exports = router;
