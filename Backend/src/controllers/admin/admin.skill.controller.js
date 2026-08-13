const { prisma } = require("../../config/dbcon");

const adminSkillController = {
  // 1. Get all skills for admin with category/verification filters
  getAllSkills: async (req, res) => {
    try {
      const { category, isVerified, isActive, search } = req.query;

      const where = {};

      if (category) {
        where.category = category.toUpperCase();
      }

      if (isVerified !== undefined) {
        where.isVerified = isVerified === "true";
      }

      if (isActive !== undefined) {
        where.isActive = isActive === "true";
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { qualification: { contains: search, mode: "insensitive" } },
        ];
      }

      const skills = await prisma.skill.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fname: true,
              lname: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        count: skills.length,
        skills,
      });
    } catch (error) {
      console.error("Admin Get All Skills Error:", error);
      return res.status(500).json({ error: "Failed to fetch skills for admin." });
    }
  },

  // 2. Verify or Unverify a skill listing
  verifySkill: async (req, res) => {
    try {
      const { id } = req.params;
      const { isVerified } = req.body;

      const updatedSkill = await prisma.skill.update({
        where: { id },
        data: {
          isVerified: isVerified !== undefined ? Boolean(isVerified) : true,
        },
      });

      return res.status(200).json({
        success: true,
        message: `Skill verification status updated to ${updatedSkill.isVerified}.`,
        skill: updatedSkill,
      });
    } catch (error) {
      console.error("Admin Verify Skill Error:", error);
      return res.status(500).json({ error: "Failed to update skill verification status." });
    }
  },

  // 3. Toggle active status of a skill listing
  toggleSkillActive: async (req, res) => {
    try {
      const { id } = req.params;

      const skill = await prisma.skill.findUnique({ where: { id } });
      if (!skill) {
        return res.status(404).json({ error: "Skill listing not found." });
      }

      const updatedSkill = await prisma.skill.update({
        where: { id },
        data: { isActive: !skill.isActive },
      });

      return res.status(200).json({
        success: true,
        message: `Skill listing ${updatedSkill.isActive ? "activated" : "deactivated"}.`,
        skill: updatedSkill,
      });
    } catch (error) {
      console.error("Admin Toggle Skill Active Error:", error);
      return res.status(500).json({ error: "Failed to toggle skill status." });
    }
  },

  // 4. Delete skill listing
  deleteSkill: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.skill.delete({ where: { id } });

      return res.status(200).json({
        success: true,
        message: "Skill listing deleted successfully.",
      });
    } catch (error) {
      console.error("Admin Delete Skill Error:", error);
      return res.status(500).json({ error: "Failed to delete skill listing." });
    }
  },
};

module.exports = adminSkillController;
