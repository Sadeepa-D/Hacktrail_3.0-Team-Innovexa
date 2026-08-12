const { prisma } = require("../../config/dbcon");

const adminOpportunityController = {
  // 1. Get all opportunities for admin with status & search filters
  getAllOpportunities: async (req, res) => {
    try {
      const { status, category, type, isVerified, search } = req.query;

      const where = {};

      if (status) {
        where.status = status.toUpperCase();
      }

      if (category) {
        where.category = category.toUpperCase();
      }

      if (type) {
        where.type = type.toUpperCase();
      }

      if (isVerified !== undefined) {
        where.isVerified = isVerified === "true";
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { companyname: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ];
      }

      const opportunities = await prisma.opportunity.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fname: true,
              lname: true,
              email: true,
            },
          },
          _count: {
            select: {
              applications: true,
              savedBy: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json({
        success: true,
        count: opportunities.length,
        opportunities,
      });
    } catch (error) {
      console.error("Admin Get All Opportunities Error:", error);
      return res.status(500).json({ error: "Failed to fetch opportunities for admin." });
    }
  },

  // 2. Update opportunity status (OPEN, DRAFT, CLOSED, FILLED, EXPIRED, CANCELLED)
  updateOpportunityStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required." });
      }

      const validStatuses = ["DRAFT", "OPEN", "CLOSED", "FILLED", "EXPIRED", "CANCELLED"];
      const uppercaseStatus = status.toUpperCase();

      if (!validStatuses.includes(uppercaseStatus)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }

      const updatedOpportunity = await prisma.opportunity.update({
        where: { id },
        data: { status: uppercaseStatus },
      });

      return res.status(200).json({
        success: true,
        message: `Opportunity status updated to ${uppercaseStatus}.`,
        opportunity: updatedOpportunity,
      });
    } catch (error) {
      console.error("Admin Update Opportunity Status Error:", error);
      return res.status(500).json({ error: "Failed to update opportunity status." });
    }
  },

  // 3. Verify or Feature an opportunity
  verifyOpportunity: async (req, res) => {
    try {
      const { id } = req.params;
      const { isVerified, isFeatured } = req.body;

      const data = {};
      if (isVerified !== undefined) data.isVerified = Boolean(isVerified);
      if (isFeatured !== undefined) data.isFeatured = Boolean(isFeatured);

      const updatedOpportunity = await prisma.opportunity.update({
        where: { id },
        data,
      });

      return res.status(200).json({
        success: true,
        message: "Opportunity verification/featured status updated.",
        opportunity: updatedOpportunity,
      });
    } catch (error) {
      console.error("Admin Verify Opportunity Error:", error);
      return res.status(500).json({ error: "Failed to update opportunity verification." });
    }
  },

  // 4. Delete opportunity
  deleteOpportunity: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.opportunity.delete({ where: { id } });

      return res.status(200).json({
        success: true,
        message: "Opportunity deleted successfully.",
      });
    } catch (error) {
      console.error("Admin Delete Opportunity Error:", error);
      return res.status(500).json({ error: "Failed to delete opportunity." });
    }
  },
};

module.exports = adminOpportunityController;
