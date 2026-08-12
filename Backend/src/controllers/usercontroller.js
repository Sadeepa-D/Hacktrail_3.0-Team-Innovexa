const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { prisma } = require("../config/dbcon");
const { supabase } = require("../config/supabase");

const JWT_SECRET = process.env.JWT_SECRET || "TEAM_INNOVEXA_SECRET_KEY";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1d";
const BUCKET_NAME = process.env.SUPABASE_BUCKET || "innovexa";

const userController = {
  // 1. REGISTER - Step 1: Only initial required fields
  register: async (req, res) => {
    try {
      const { email, password, fname, lname } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required fields." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (existingUser) {
        return res.status(400).json({ error: "An account with this email already exists." });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create User with initial required fields
      const user = await prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
          password: hashedPassword,
          fname: fname?.trim() || "",
          lname: lname?.trim() || "",
        },
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          role: true,
          isactive: true,
          createdAt: true,
        },
      });

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });

      return res.status(201).json({
        message: "Registration successful!",
        token,
        user,
      });
    } catch (error) {
      console.error("Register Error:", error);
      return res.status(500).json({ error: "Failed to register user.", details: error.message });
    }
  },

  // 2. LOGIN - Authenticate user & issue JWT
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      if (user.isactive === "DEACTIVE" || user.isactive === "SUSPENDED" || user.isactive === "DELETED") {
        return res.status(403).json({ error: `Account is currently ${user.isactive.toLowerCase()}.` });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });

      const { password: _, resetToken: __, resetTokenExpire: ___, ...userProfile } = user;

      return res.status(200).json({
        message: "Login successful!",
        token,
        user: userProfile,
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res.status(500).json({ error: "Login failed.", details: error.message });
    }
  },

  // 3. GET CURRENT USER PROFILE
  getProfile: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          dob: true,
          phone: true,
          gender: true,
          city: true,
          avatarUrl: true,
          role: true,
          isactive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User profile not found." });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Get Profile Error:", error);
      return res.status(500).json({ error: "Failed to fetch profile." });
    }
  },

  // 4. UPDATE PROFILE - Step 2: Non-required optional fields
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { fname, lname, dob, phone, gender, city } = req.body;

      const updateData = {};

      if (fname !== undefined) updateData.fname = fname.trim();
      if (lname !== undefined) updateData.lname = lname.trim();
      if (phone !== undefined) updateData.phone = phone.trim();
      if (gender !== undefined) updateData.gender = gender.trim();
      if (city !== undefined) updateData.city = city.trim();
      if (dob) {
        const parsedDob = new Date(dob);
        if (!isNaN(parsedDob.getTime())) {
          updateData.dob = parsedDob;
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          dob: true,
          phone: true,
          gender: true,
          city: true,
          avatarUrl: true,
          role: true,
          isactive: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        message: "Profile updated successfully!",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      return res.status(500).json({ error: "Failed to update profile.", details: error.message });
    }
  },

  // 5. UPDATE PASSWORD - For logged in user
  updatePassword: async (req, res) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current password and new password are required." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long." });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect current password." });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      return res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
      console.error("Update Password Error:", error);
      return res.status(500).json({ error: "Failed to update password.", details: error.message });
    }
  },

  // 6. REQUEST PASSWORD RESET (FORGOT PASSWORD)
  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required." });
      }

      const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
      });

      if (!user) {
        // Return generic message to prevent email enumeration
        return res.status(200).json({ message: "If an account exists with this email, a reset token has been generated." });
      }

      // Generate random hex token (valid for 1 hour)
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 Hour

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpire,
        },
      });

      return res.status(200).json({
        message: "Password reset token generated successfully.",
        resetToken, // Returned for API testing / frontend email integration
        expiresAt: resetTokenExpire,
      });
    } catch (error) {
      console.error("Request Password Reset Error:", error);
      return res.status(500).json({ error: "Failed to process password reset request." });
    }
  },

  // 7. CONFIRM RESET PASSWORD
  resetPassword: async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;

      if (!resetToken || !newPassword) {
        return res.status(400).json({ error: "Reset token and new password are required." });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters long." });
      }

      // Find user with valid token that has not expired
      const user = await prisma.user.findFirst({
        where: {
          resetToken: resetToken,
          resetTokenExpire: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token." });
      }

      // Hash new password & clear reset token
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpire: null,
        },
      });

      return res.status(200).json({ message: "Password reset successful! You can now log in with your new password." });
    } catch (error) {
      console.error("Reset Password Error:", error);
      return res.status(500).json({ error: "Failed to reset password." });
    }
  },

  // 8. UPLOAD PROFILE IMAGE (SUPABASE STORAGE)
  uploadAvatar: async (req, res) => {
    try {
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ error: "No image file provided." });
      }

      const file = req.file;
      const fileExt = file.originalname.split(".").pop() || "png";
      const fileName = `avatars/user_${userId}_${Date.now()}.${fileExt}`;

      // Upload file buffer to Supabase Storage Bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error:", uploadError);
        return res.status(500).json({ error: "Failed to upload image to Supabase storage.", details: uploadError.message });
      }

      // Retrieve Public URL
      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      // Update avatarUrl in Database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: publicUrl },
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          avatarUrl: true,
        },
      });

      return res.status(200).json({
        message: "Profile image uploaded successfully!",
        avatarUrl: publicUrl,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Upload Avatar Error:", error);
      return res.status(500).json({ error: "Failed to upload avatar.", details: error.message });
    }
  },

  // 9. DELETE / REMOVE AVATAR (Suggested User Controller)
  deleteAvatar: async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true },
      });

      if (!user || !user.avatarUrl) {
        return res.status(400).json({ error: "No profile avatar found to delete." });
      }

      // Clear avatarUrl in Database
      await prisma.user.update({
        where: { id: userId },
        data: { avatarUrl: null },
      });

      return res.status(200).json({ message: "Profile image removed successfully." });
    } catch (error) {
      console.error("Delete Avatar Error:", error);
      return res.status(500).json({ error: "Failed to delete avatar." });
    }
  },

  // 10. DEACTIVATE ACCOUNT (Suggested User Controller)
  deactivateAccount: async (req, res) => {
    try {
      const userId = req.user.id;

      await prisma.user.update({
        where: { id: userId },
        data: { isactive: "DEACTIVE" },
      });

      return res.status(200).json({ message: "Your account has been deactivated successfully." });
    } catch (error) {
      console.error("Deactivate Account Error:", error);
      return res.status(500).json({ error: "Failed to deactivate account." });
    }
  },
};

module.exports = userController;
