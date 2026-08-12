const express = require("express");
const userController = require("../controllers/usercontroller");
const { authenticate } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

// Public Auth Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/forgot-password", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);

// Protected Routes (JWT Required)
router.get("/profile", authenticate, userController.getProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.put("/update-password", authenticate, userController.updatePassword);

// Profile Image Upload (Supabase Storage)
router.post("/avatar", authenticate, upload.single("avatar"), userController.uploadAvatar);
router.delete("/avatar", authenticate, userController.deleteAvatar);

// Account Actions
router.patch("/deactivate", authenticate, userController.deactivateAccount);

module.exports = router;
