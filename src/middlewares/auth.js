import jwt from "jsonwebtoken";
import { prisma } from '../lib/db.js';

export const authenticate = async (req, res, next) => {
    // Verify JWT token and attach user to req.user

      try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Expected JWT payload:
     * {
     *   id: "<userObjectId>",
     *   role: "ADMIN" | "LEADER"
     * }
     */

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();
  };
};

export const isOwnerOrAdmin = async (req, res, next) => {
    // Check if user is owner of resource or admin

  try {
    const { id } = req.params; // openingId

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Admin can access everything
    if (req.user.role === "ADMIN") {
      return next();
    }

    // Fetch opening to check ownership
    const opening = await prisma.opening.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: "Opening not found",
      });
    }

    if (opening.createdById !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied (not owner)",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
      error: error.message,
    });
  }
};
