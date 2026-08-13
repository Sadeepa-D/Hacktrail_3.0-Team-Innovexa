const { prisma } = require("../config/dbcon");

const searchController = {
  /**
   * ── GET /api/search/users ──────────────────────────────────────────────────
   * Public user search endpoint for header search bar suggestions.
   * Query params: ?q=search_term
   * 
   * SECURITY: Strictly hides sensitive data (password, reset tokens, role, status, dob, phone, email).
   * ONLY exposes: id, fname, lname, city, avatarUrl, unique skills, and posted opportunities.
   */
  searchUsers: async (req, res) => {
    try {
      const q = req.query.q ? req.query.q.trim() : "";

      if (!q) {
        return res.status(200).json({ users: [] });
      }

      const users = await prisma.user.findMany({
        where: {
          isactive: "ACTIVE",
          OR: [
            { fname: { contains: q, mode: "insensitive" } },
            { lname: { contains: q, mode: "insensitive" } },
            { city: { contains: q, mode: "insensitive" } },
            {
              skills: {
                some: {
                  name: { contains: q, mode: "insensitive" },
                  isActive: true,
                },
              },
            },
            {
              opportunities: {
                some: {
                  title: { contains: q, mode: "insensitive" },
                  status: "OPEN",
                },
              },
            },
          ],
        },
        // Strict field selection — HIDE SENSITIVE DATA
        select: {
          id: true,
          fname: true,
          lname: true,
          city: true,
          avatarUrl: true,
          // Only active skills (id, name, category)
          skills: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              category: true,
            },
            take: 5,
          },
          // Only open opportunities (id, title, type, category)
          opportunities: {
            where: { status: "OPEN" },
            select: {
              id: true,
              title: true,
              type: true,
              category: true,
            },
            take: 5,
          },
        },
        take: 8, // Ideal limit for floating header suggestions
      });

      return res.status(200).json({ users });
    } catch (error) {
      console.error("Search Users Error:", error);
      return res.status(500).json({ error: "Failed to search users.", details: error.message });
    }
  },

  /**
   * ── GET /api/search/profile/:id ───────────────────────────────────────────
   * Public profile view endpoint for a selected user.
   * 
   * SECURITY: Strictly excludes password, resetToken, resetTokenExpire, role, isactive, phone, email, dob.
   * Returns: User basic safe info + all active unique skills + all open opportunities.
   */
  getPublicProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          fname: true,
          lname: true,
          city: true,
          avatarUrl: true,
          createdAt: true,
          // Unique Skills owned by this user
          skills: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              category: true,
              description: true,
              qualification: true,
              hourlyRate: true,
              availability: true,
              experience: true,
              viewCount: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
          // Posted Opportunities owned by this user
          opportunities: {
            where: { status: "OPEN" },
            select: {
              id: true,
              title: true,
              type: true,
              category: true,
              description: true,
              location: true,
              isRemote: true,
              salary: true,
              salaryMax: true,
              salaryType: true,
              companyname: true,
              viewCount: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User profile not found." });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error("Get Public Profile Error:", error);
      return res.status(500).json({ error: "Failed to fetch user public profile." });
    }
  },
};

module.exports = searchController;
