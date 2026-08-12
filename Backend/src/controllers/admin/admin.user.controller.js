const { prisma } = require("../../config/dbcon");

const adminUserController = {
  // 1. Get all users with optional status & search filters
  getAllUsers: async (req, res) => {
    try {
      const { status, role, search } = req.query;

      const where = {};

      if (status) {
        where.isactive = status.toUpperCase();
      }

      if (role) {
        where.role = role.toUpperCase();
      }

      if (search) {
        where.OR = [
          { fname: { contains: search, mode: "insensitive" } },
          { lname: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      const users = await prisma.user.findMany({
        where,
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
          _count: {
            select: {
              skills: true,
              opportunities: true,
              applications: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        count: users.length,
        users,
      });
    } catch (error) {
      console.error("Admin Get All Users Error:", error);
      return res.status(500).json({ error: "Failed to fetch users." });
    }
  },

  // 2. Update user account status (ACTIVE, DEACTIVE, DELETED, SUSPENDED)
  updateUserStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required." });
      }

      const validStatuses = ["ACTIVE", "DEACTIVE", "DELETED", "SUSPENDED"];
      const uppercaseStatus = status.toUpperCase();

      if (!validStatuses.includes(uppercaseStatus)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { isactive: uppercaseStatus },
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          role: true,
          isactive: true,
          updatedAt: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: `User status updated to ${uppercaseStatus}.`,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Admin Update User Status Error:", error);
      return res.status(500).json({ error: "Failed to update user status." });
    }
  },

  // 3. Update user role (ADMIN, USER)
  updateUserRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({ error: "Role is required." });
      }

      const uppercaseRole = role.toUpperCase();
      if (!["ADMIN", "USER"].includes(uppercaseRole)) {
        return res.status(400).json({ error: "Role must be ADMIN or USER." });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: { role: uppercaseRole },
        select: {
          id: true,
          email: true,
          fname: true,
          lname: true,
          role: true,
          isactive: true,
        },
      });

      return res.status(200).json({
        success: true,
        message: `User role updated to ${uppercaseRole}.`,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Admin Update User Role Error:", error);
      return res.status(500).json({ error: "Failed to update user role." });
    }
  },

  // 4. Delete user account
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: "User account permanently deleted.",
      });
    } catch (error) {
      console.error("Admin Delete User Error:", error);
      return res.status(500).json({ error: "Failed to delete user." });
    }
  },
};

module.exports = adminUserController;
