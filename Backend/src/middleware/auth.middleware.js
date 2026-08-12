const jwt = require("jsonwebtoken");
const { prisma } = require("../config/dbcon");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "TEAM_INNOVEXA_SECRET_KEY";

    const decoded = jwt.verify(token, secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId || decoded.id },
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
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User account not found." });
    }

    if (user.isactive === "DELETED" || user.isactive === "SUSPENDED") {
      return res.status(403).json({ error: `Account is ${user.isactive.toLowerCase()}.` });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = { authenticate };
