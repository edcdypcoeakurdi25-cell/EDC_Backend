import { prisma } from '../lib/db.js';

export const createOpening = async (req, res) => {
  // POST /api/openings
  // Role: ADMIN, LEADER
  // Body: { title, domain, workType, numberOfSlots, preText, aboutRole, skillsRequired, extraInfo }
  // Returns: { opening }

  try {
    const {
      title,
      domain,
      workType,
      numberOfSlots,
      preText,
      aboutRole,
      skillsRequired,
      extraInfo,
    } = req.body;

    // createdById comes from auth middleware
    const createdById = req.user.id;

    const opening = await prisma.opening.create({
      data: {
        title,
        domain,
        workType,
        numberOfSlots,
        preText,
        aboutRole,
        skillsRequired,
        extraInfo,
        createdById,
      },
    });

    return res.status(201).json({
      success: true,
      opening,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create opening",
      error: error.message,
    });
  }
};

export const getAllOpenings = async (req, res) => {
  // GET /api/openings
  // Public route (for students)
  // Query: ?isActive=true&domain=Technical&workType=REMOTE
  // Returns: { openings: [], total }

  try {
    const { isActive, domain, workType } = req.query;

    const whereClause = {};

    if (isActive !== undefined) {
      whereClause.isActive = isActive === "true";
    }

    if (domain) {
      whereClause.domain = domain;
    }

    if (workType) {
      whereClause.workType = workType;
    }

    const openings = await prisma.opening.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      total: openings.length,
      openings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch openings",
      error: error.message,
    });
  }
};

export const getOpeningById = async (req, res) => {
  // GET /api/openings/:id
  // Public route (for students)
  // Also increments view count
  // Returns: { opening }

  try {
    const { id } = req.params;

    const opening = await prisma.opening.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
    });

    return res.status(200).json({
      success: true,
      opening,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Opening not found",
    });
  }
};

export const getOpeningDetails = async (req, res) => {
  // GET /api/openings/:id/details
  // Role: ADMIN, LEADER
  // Returns: { opening, form, totalApplications, totalViews }

  try {
    const { id } = req.params;

    const opening = await prisma.opening.findUnique({
      where: { id },
      include: {
        form: {
          include: {
            customFields: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: "Opening not found",
      });
    }

    return res.status(200).json({
      success: true,
      opening,
      form: opening.form,
      totalApplications: opening._count.applications,
      totalViews: opening.views,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch opening details",
      error: error.message,
    });
  }
};

export const updateOpening = async (req, res) => {
  // PUT /api/openings/:id
  // Role: ADMIN, LEADER (only creator or admin)
  // Body: { title, domain, workType, numberOfSlots, preText, aboutRole, skillsRequired, extraInfo, isActive }
  // Returns: { opening }

  try {
    const { id } = req.params;

    const {
      title,
      domain,
      workType,
      numberOfSlots,
      preText,
      aboutRole,
      skillsRequired,
      extraInfo,
      isActive,
    } = req.body;

    const opening = await prisma.opening.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(domain !== undefined && { domain }),
        ...(workType !== undefined && { workType }),
        ...(numberOfSlots !== undefined && { numberOfSlots }),
        ...(preText !== undefined && { preText }),
        ...(aboutRole !== undefined && { aboutRole }),
        ...(skillsRequired !== undefined && { skillsRequired }),
        ...(extraInfo !== undefined && { extraInfo }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return res.status(200).json({
      success: true,
      opening,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Opening not found or update failed",
    });
  }
};

export const deleteOpening = async (req, res) => {
  // DELETE /api/openings/:id
  // Role: ADMIN, LEADER (only creator or admin)
  // Returns: { message }

  try {
    const { id } = req.params;

    await prisma.opening.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Opening deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Opening not found or delete failed",
    });
  }
};

export const toggleOpeningStatus = async (req, res) => {
  // PATCH /api/openings/:id/toggle-status
  // Role: ADMIN, LEADER (only creator or admin)
  // Returns: { opening }

  try {
    const { id } = req.params;

    const opening = await prisma.opening.findUnique({
      where: { id },
    });

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: "Opening not found",
      });
    }

    const updatedOpening = await prisma.opening.update({
      where: { id },
      data: {
        isActive: !opening.isActive,
      },
    });

    return res.status(200).json({
      success: true,
      opening: updatedOpening,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle opening status",
      error: error.message,
    });
  }
};

export const getOpeningStats = async (req, res) => {
  // GET /api/openings/:id/stats
  // Role: ADMIN, LEADER
  // Returns: { views, totalApplications, applicationsByBranch, applicationsByYear }

  try {
    const { id } = req.params;

    const opening = await prisma.opening.findUnique({
      where: { id },
      select: {
        views: true,
      },
    });

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: "Opening not found",
      });
    }

    const applicationsByBranch = await prisma.application.groupBy({
      by: ["branch"],
      where: { openingId: id },
      _count: true,
    });

    const applicationsByYear = await prisma.application.groupBy({
      by: ["yearOfStudy"],
      where: { openingId: id },
      _count: true,
    });

    return res.status(200).json({
      success: true,
      views: opening.views,
      totalApplications: applicationsByBranch.reduce(
        (sum, item) => sum + item._count,
        0
      ),
      applicationsByBranch,
      applicationsByYear,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch opening stats",
      error: error.message,
    });
  }
};
