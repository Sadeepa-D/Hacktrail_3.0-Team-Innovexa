const { prisma } = require("../config/dbcon");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SKILL_PUBLIC_SELECT = {
  id: true,
  name: true,
  phonenum: true,
  email: true,
  category: true,
  description: true,
  qualification: true,
  hourlyRate: true,
  rateType: true,
  availability: true,
  experience: true,
  isVerified: true,
  isActive: true,
  viewCount: true,
  createdAt: true,
  updatedAt: true,
  user: {
    select: {
      id: true,
      fname: true,
      lname: true,
      email: true,
      avatarUrl: true,
      city: true,
    },
  },
};

const buildSkillFilters = (query) => {
  const { category, search, isActive, isVerified } = query;
  const where = {};

  if (category) where.category = category.toUpperCase();
  if (isActive !== undefined) where.isActive = isActive === "true";
  if (isVerified !== undefined) where.isVerified = isVerified === "true";
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { qualification: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

const skillController = {
  // ── POST /skills ── Create a new skill post
  createSkill: async (req, res) => {
    try {
      const {
        name,
        phonenum,
        email,
        category,
        description,
        qualification,
        hourlyRate,
        rateType,
        availability,
        experience,
      } = req.body;

      if (!name || !phonenum) {
        return res
          .status(400)
          .json({ error: "Skill name and phone number are required." });
      }

      const skill = await prisma.skill.create({
        data: {
          name: name.trim(),
          phonenum: phonenum.trim(),
          email: email?.trim() || null,
          category: category || "OTHER",
          description: description?.trim() || null,
          qualification: qualification?.trim() || null,
          hourlyRate: hourlyRate !== undefined && hourlyRate !== null ? parseFloat(hourlyRate) : null,
          rateType: rateType || "HOURLY",
          availability: availability?.trim() || null,
          experience: experience?.trim() || null,
          userId: req.user.id,
        },
        select: SKILL_PUBLIC_SELECT,
      });

      return res.status(201).json({
        message: "Skill posted successfully!",
        skill,
      });
    } catch (error) {
      console.error("Create Skill Error:", error);
      return res
        .status(500)
        .json({ error: "Failed to create skill.", details: error.message });
    }
  },

  // ── GET /skills ── List all active & verified skills (public feed)
  getAllSkills: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;
      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

      const where = {
        isActive: true,
        isVerified: true, // Only show verified skills in public feed
        ...buildSkillFilters(req.query),
      };

      const [skills, total] = await Promise.all([
        prisma.skill.findMany({
          where,
          select: SKILL_PUBLIC_SELECT,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.skill.count({ where }),
      ]);

      return res.status(200).json({
        skills,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Get All Skills Error:", error);
      return res.status(500).json({ error: "Failed to fetch skills.", details: error.message });
    }
  },

  // ── GET /skills/:id ── Get one skill by ID (public)
  getSkillById: async (req, res) => {
    try {
      const { id } = req.params;

      const skill = await prisma.skill.findUnique({
        where: { id },
        select: SKILL_PUBLIC_SELECT,
      });

      if (!skill) {
        return res.status(404).json({ error: "Skill not found." });
      }

      // Increment view count
      await prisma.skill.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      return res.status(200).json({ skill });
    } catch (error) {
      console.error("Get Skill By ID Error:", error);
      return res.status(500).json({ error: "Failed to fetch skill." });
    }
  },

  // ── GET /skills/my ── Get all skills owned by the logged-in user
  getMySkills: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;

      const where = {
        userId: req.user.id,
        ...buildSkillFilters(req.query),
      };

      const [skills, total] = await Promise.all([
        prisma.skill.findMany({
          where,
          select: SKILL_PUBLIC_SELECT,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.skill.count({ where }),
      ]);

      return res.status(200).json({
        skills,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      });
    } catch (error) {
      console.error("Get My Skills Error:", error);
      return res.status(500).json({ error: "Failed to fetch your skills." });
    }
  },

  // ── PUT /skills/:id ── Update own skill
  updateSkill: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.skill.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Skill not found." });
      if (existing.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "You are not authorized to edit this skill." });
      }

      const {
        name,
        phonenum,
        email,
        category,
        description,
        qualification,
        hourlyRate,
        rateType,
        availability,
        experience,
        isActive,
      } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name.trim();
      if (phonenum !== undefined) updateData.phonenum = phonenum.trim();
      if (email !== undefined) updateData.email = email?.trim() || null;
      if (category !== undefined) updateData.category = category;
      if (description !== undefined)
        updateData.description = description?.trim() || null;
      if (qualification !== undefined)
        updateData.qualification = qualification?.trim() || null;
      if (hourlyRate !== undefined)
        updateData.hourlyRate = hourlyRate !== null ? parseFloat(hourlyRate) : null;
      if (rateType !== undefined) updateData.rateType = rateType;
      if (availability !== undefined)
        updateData.availability = availability?.trim() || null;
      if (experience !== undefined)
        updateData.experience = experience?.trim() || null;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);

      const skill = await prisma.skill.update({
        where: { id },
        data: updateData,
        select: SKILL_PUBLIC_SELECT,
      });

      return res.status(200).json({
        message: "Skill updated successfully!",
        skill,
      });
    } catch (error) {
      console.error("Update Skill Error:", error);
      return res
        .status(500)
        .json({ error: "Failed to update skill.", details: error.message });
    }
  },

  // ── DELETE /skills/:id ── Delete own skill
  deleteSkill: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.skill.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Skill not found." });
      if (existing.userId !== req.user.id) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this skill." });
      }

      await prisma.skill.delete({ where: { id } });

      return res.status(200).json({ message: "Skill deleted successfully." });
    } catch (error) {
      console.error("Delete Skill Error:", error);
      return res.status(500).json({ error: "Failed to delete skill." });
    }
  },

  // ── PATCH /skills/:id/toggle ── Toggle isActive on own skill
  toggleSkillStatus: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.skill.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Skill not found." });
      if (existing.userId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized." });
      }

      const skill = await prisma.skill.update({
        where: { id },
        data: { isActive: !existing.isActive },
        select: { id: true, name: true, isActive: true },
      });

      return res.status(200).json({
        message: `Skill is now ${skill.isActive ? "active" : "inactive"}.`,
        skill,
      });
    } catch (error) {
      console.error("Toggle Skill Status Error:", error);
      return res.status(500).json({ error: "Failed to toggle skill status." });
    }
  },
};

module.exports = skillController;
