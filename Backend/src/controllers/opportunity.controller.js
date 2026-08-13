const { prisma } = require("../config/dbcon");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const OPP_PUBLIC_SELECT = {
  id: true,
  title: true,
  description: true,
  type: true,
  category: true,
  status: true,
  location: true,
  isRemote: true,
  salary: true,
  salaryMax: true,
  salaryType: true,
  companyname: true,
  contactEmail: true,
  contactPhone: true,
  experience: true,
  education: true,
  isVerified: true,
  isFeatured: true,
  viewCount: true,
  applicationCount: true,
  publishedAt: true,
  expiresAt: true,
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

const buildOppFilters = (query) => {
  const { type, category, status, search, isRemote, location, isVerified } = query;
  const where = {};

  if (type) where.type = type.toUpperCase();
  if (category) where.category = category.toUpperCase();
  if (status) where.status = status.toUpperCase();
  if (isRemote !== undefined) where.isRemote = isRemote === "true";
  if (isVerified !== undefined) where.isVerified = isVerified === "true";
  if (location) where.location = { contains: location, mode: "insensitive" };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { companyname: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  return where;
};

// ─── Controllers ─────────────────────────────────────────────────────────────

const opportunityController = {
  // ── POST /opportunities ── Create a new opportunity post
  createOpportunity: async (req, res) => {
    try {
      const {
        title,
        description,
        type,
        category,
        status,
        location,
        isRemote,
        salary,
        salaryMax,
        salaryType,
        companyname,
        contactEmail,
        contactPhone,
        experience,
        education,
        expiresAt,
      } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Opportunity title is required." });
      }

      const data = {
        title: title.trim(),
        userId: req.user.id,
        status: status ? status.toUpperCase() : "DRAFT",
      };
      if (location) data.location = location.trim();
      if (isRemote !== undefined) data.isRemote = Boolean(isRemote);
      if (salary) data.salary = parseFloat(salary);
      if (salaryMax) data.salaryMax = parseFloat(salaryMax);
      if (salaryType) data.salaryType = salaryType.toUpperCase();
      if (companyname) data.companyname = companyname.trim();
      if (contactEmail) data.contactEmail = contactEmail.trim();
      if (contactPhone) data.contactPhone = contactPhone.trim();
      if (experience) data.experience = experience.trim();
      if (education) data.education = education.trim();
      if (expiresAt) data.expiresAt = new Date(expiresAt);

      // Auto-set publishedAt when status is OPEN
      if (data.status === "OPEN") data.publishedAt = new Date();

      const opportunity = await prisma.opportunity.create({
        data,
        select: OPP_PUBLIC_SELECT,
      });

      return res.status(201).json({
        message: "Opportunity posted successfully!",
        opportunity,
      });
    } catch (error) {
      console.error("Create Opportunity Error:", error);
      return res.status(500).json({ error: "Failed to create opportunity.", details: error.message });
    }
  },

  // ── GET /opportunities ── List all open & verified opportunities (public feed)
  getAllOpportunities: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;
      const sortBy = req.query.sortBy || "createdAt";
      const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";

      const where = {
        status: "OPEN",
        isVerified: true, // Only show verified opportunities in public feed
        ...buildOppFilters(req.query),
      };

      const [opportunities, total] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          select: OPP_PUBLIC_SELECT,
          skip,
          take: limit,
          orderBy: [
            { isFeatured: "desc" }, // Featured on top
            { [sortBy]: sortOrder },
          ],
        }),
        prisma.opportunity.count({ where }),
      ]);

      return res.status(200).json({
        opportunities,
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
      console.error("Get All Opportunities Error:", error);
      return res.status(500).json({ error: "Failed to fetch opportunities." });
    }
  },

  // ── GET /opportunities/:id ── Get one opportunity by ID (public)
  getOpportunityById: async (req, res) => {
    try {
      const { id } = req.params;

      const opportunity = await prisma.opportunity.findUnique({
        where: { id },
        select: {
          ...OPP_PUBLIC_SELECT,
          applications: {
            select: {
              id: true,
              status: true,
              createdAt: true,
              applicant: {
                select: { id: true, fname: true, lname: true, avatarUrl: true },
              },
            },
          },
        },
      });

      if (!opportunity) {
        return res.status(404).json({ error: "Opportunity not found." });
      }

      // Increment view count
      await prisma.opportunity.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      return res.status(200).json({ opportunity });
    } catch (error) {
      console.error("Get Opportunity By ID Error:", error);
      return res.status(500).json({ error: "Failed to fetch opportunity." });
    }
  },

  // ── GET /opportunities/my ── Get all opportunities owned by the logged-in user
  getMyOpportunities: async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page) || 1);
      const limit = Math.min(50, parseInt(req.query.limit) || 10);
      const skip = (page - 1) * limit;

      const where = {
        userId: req.user.id,
        ...buildOppFilters(req.query),
      };

      const [opportunities, total] = await Promise.all([
        prisma.opportunity.findMany({
          where,
          select: {
            ...OPP_PUBLIC_SELECT,
            _count: { select: { applications: true } },
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.opportunity.count({ where }),
      ]);

      return res.status(200).json({
        opportunities,
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
      console.error("Get My Opportunities Error:", error);
      return res.status(500).json({ error: "Failed to fetch your opportunities." });
    }
  },

  // ── PUT /opportunities/:id ── Update own opportunity
  updateOpportunity: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.opportunity.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Opportunity not found." });
      if (existing.userId !== req.user.id) {
        return res.status(403).json({ error: "You are not authorized to edit this opportunity." });
      }

      const {
        title, description, type, category, status,
        location, isRemote, salary, salaryMax, salaryType,
        companyname, contactEmail, contactPhone, experience,
        education, expiresAt,
      } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (type !== undefined) updateData.type = type.toUpperCase();
      if (category !== undefined) updateData.category = category.toUpperCase();
      if (location !== undefined) updateData.location = location?.trim() || null;
      if (isRemote !== undefined) updateData.isRemote = Boolean(isRemote);
      if (salary !== undefined) updateData.salary = salary ? parseFloat(salary) : null;
      if (salaryMax !== undefined) updateData.salaryMax = salaryMax ? parseFloat(salaryMax) : null;
      if (salaryType !== undefined) updateData.salaryType = salaryType.toUpperCase();
      if (companyname !== undefined) updateData.companyname = companyname?.trim() || null;
      if (contactEmail !== undefined) updateData.contactEmail = contactEmail?.trim() || null;
      if (contactPhone !== undefined) updateData.contactPhone = contactPhone?.trim() || null;
      if (experience !== undefined) updateData.experience = experience?.trim() || null;
      if (education !== undefined) updateData.education = education?.trim() || null;
      if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;

      // Handle status changes
      if (status !== undefined) {
        updateData.status = status.toUpperCase();
        if (status.toUpperCase() === "OPEN" && !existing.publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      const opportunity = await prisma.opportunity.update({
        where: { id },
        data: updateData,
        select: OPP_PUBLIC_SELECT,
      });

      return res.status(200).json({
        message: "Opportunity updated successfully!",
        opportunity,
      });
    } catch (error) {
      console.error("Update Opportunity Error:", error);
      return res.status(500).json({ error: "Failed to update opportunity.", details: error.message });
    }
  },

  // ── DELETE /opportunities/:id ── Delete own opportunity
  deleteOpportunity: async (req, res) => {
    try {
      const { id } = req.params;

      const existing = await prisma.opportunity.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Opportunity not found." });
      if (existing.userId !== req.user.id) {
        return res.status(403).json({ error: "You are not authorized to delete this opportunity." });
      }

      await prisma.opportunity.delete({ where: { id } });

      return res.status(200).json({ message: "Opportunity deleted successfully." });
    } catch (error) {
      console.error("Delete Opportunity Error:", error);
      return res.status(500).json({ error: "Failed to delete opportunity." });
    }
  },

  // ── PATCH /opportunities/:id/status ── Change opportunity status (open, close, draft, etc.)
  updateOpportunityStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ["DRAFT", "OPEN", "CLOSED", "FILLED", "EXPIRED", "CANCELLED"];
      if (!status || !validStatuses.includes(status.toUpperCase())) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const existing = await prisma.opportunity.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: "Opportunity not found." });
      if (existing.userId !== req.user.id) {
        return res.status(403).json({ error: "Not authorized." });
      }

      const updateData = { status: status.toUpperCase() };
      if (status.toUpperCase() === "OPEN" && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }

      const opportunity = await prisma.opportunity.update({
        where: { id },
        data: updateData,
        select: { id: true, title: true, status: true, publishedAt: true },
      });

      return res.status(200).json({
        message: `Opportunity status updated to '${opportunity.status}'.`,
        opportunity,
      });
    } catch (error) {
      console.error("Update Opportunity Status Error:", error);
      return res.status(500).json({ error: "Failed to update status." });
    }
  },

  // ── POST /opportunities/:id/apply ── Apply to an opportunity
  applyToOpportunity: async (req, res) => {
    try {
      const { id: opportunityId } = req.params;
      const applicantId = req.user.id;
      const { coverLetter, resume, portfolio, phoneNumber, email, expectedSalary } = req.body;

      const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
      if (!opportunity) return res.status(404).json({ error: "Opportunity not found." });
      if (opportunity.status !== "OPEN") {
        return res.status(400).json({ error: "This opportunity is not accepting applications." });
      }
      if (opportunity.userId === applicantId) {
        return res.status(400).json({ error: "You cannot apply to your own opportunity." });
      }

      // Check for duplicate
      const existing = await prisma.application.findUnique({
        where: { opportunityId_applicantId: { opportunityId, applicantId } },
      });
      if (existing) {
        return res.status(400).json({ error: "You have already applied to this opportunity." });
      }

      const application = await prisma.application.create({
        data: {
          opportunityId,
          applicantId,
          coverLetter: coverLetter?.trim() || null,
          resume: resume?.trim() || null,
          portfolio: portfolio?.trim() || null,
          phoneNumber: phoneNumber?.trim() || null,
          email: email?.trim() || null,
          expectedSalary: expectedSalary ? parseFloat(expectedSalary) : null,
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          opportunity: { select: { id: true, title: true } },
        },
      });

      // Increment application count
      await prisma.opportunity.update({
        where: { id: opportunityId },
        data: { applicationCount: { increment: 1 } },
      });

      return res.status(201).json({
        message: "Application submitted successfully!",
        application,
      });
    } catch (error) {
      console.error("Apply To Opportunity Error:", error);
      return res.status(500).json({ error: "Failed to submit application.", details: error.message });
    }
  },

  // ── GET /opportunities/:id/applications ── Owner sees all applications for their opportunity
  getOpportunityApplications: async (req, res) => {
    try {
      const { id: opportunityId } = req.params;

      const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
      if (!opportunity) return res.status(404).json({ error: "Opportunity not found." });
      if (opportunity.userId !== req.user.id) {
        return res.status(403).json({ error: "You are not authorized to view these applications." });
      }

      const applications = await prisma.application.findMany({
        where: { opportunityId },
        select: {
          id: true,
          status: true,
          coverLetter: true,
          resume: true,
          portfolio: true,
          phoneNumber: true,
          email: true,
          expectedSalary: true,
          applicantNotes: true,
          employerNotes: true,
          createdAt: true,
          reviewedAt: true,
          applicant: {
            select: {
              id: true,
              fname: true,
              lname: true,
              email: true,
              avatarUrl: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ applications, total: applications.length });
    } catch (error) {
      console.error("Get Opportunity Applications Error:", error);
      return res.status(500).json({ error: "Failed to fetch applications." });
    }
  },

  // ── GET /opportunities/my-applications ── Applicant sees their own applications
  getMyApplications: async (req, res) => {
    try {
      const applications = await prisma.application.findMany({
        where: { applicantId: req.user.id },
        select: {
          id: true,
          status: true,
          coverLetter: true,
          expectedSalary: true,
          createdAt: true,
          updatedAt: true,
          opportunity: {
            select: {
              id: true,
              title: true,
              companyname: true,
              type: true,
              category: true,
              status: true,
              location: true,
              isRemote: true,
              salary: true,
              salaryType: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({ applications, total: applications.length });
    } catch (error) {
      console.error("Get My Applications Error:", error);
      return res.status(500).json({ error: "Failed to fetch your applications." });
    }
  },
};

module.exports = opportunityController;
