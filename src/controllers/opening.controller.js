import { prisma } from '../lib/db.js';

export const createOpening = async (req, res) => {
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

        const createdById = req.user.id;

        const opening = await prisma.opening.create({
            data: {
                title,
                domain,
                workType,
                numberOfSlots: parseInt(numberOfSlots),
                preText,
                aboutRole,
                skillsRequired,
                extraInfo,
                createdById,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Opening created successfully',
            data: opening,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create opening',
            error: error.message,
        });
    }
};

export const getAllOpenings = async (req, res) => {
    try {
        const { isActive, domain, workType } = req.query;

        const whereClause = {};

        if (isActive !== undefined) {
            whereClause.isActive = isActive === 'true';
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
                createdAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                domain: true,
                workType: true,
                numberOfSlots: true,
                preText: true,
                aboutRole: true,
                skillsRequired: true,
                extraInfo: true,
                isActive: true,
                views: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json({
            success: true,
            data: {
                openings,
                total: openings.length,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch openings',
            error: error.message,
        });
    }
};

export const getOpeningById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if opening exists first
        const existingOpening = await prisma.opening.findUnique({
            where: { id },
        });

        if (!existingOpening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }

        // Increment view count
        const opening = await prisma.opening.update({
            where: { id },
            data: {
                views: { increment: 1 },
            },
        });

        return res.status(200).json({
            success: true,
            data: opening,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch opening',
            error: error.message,
        });
    }
};

export const getOpeningDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const opening = await prisma.opening.findUnique({
            where: { id },
            include: {
                form: {
                    include: {
                        customFields: {
                            orderBy: {
                                order: 'asc',
                            },
                        },
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
                message: 'Opening not found',
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                opening: {
                    id: opening.id,
                    title: opening.title,
                    domain: opening.domain,
                    workType: opening.workType,
                    numberOfSlots: opening.numberOfSlots,
                    preText: opening.preText,
                    aboutRole: opening.aboutRole,
                    skillsRequired: opening.skillsRequired,
                    extraInfo: opening.extraInfo,
                    isActive: opening.isActive,
                    views: opening.views,
                    createdById: opening.createdById,
                    createdAt: opening.createdAt,
                    updatedAt: opening.updatedAt,
                },
                form: opening.form,
                totalApplications: opening._count.applications,
                totalViews: opening.views,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch opening details',
            error: error.message,
        });
    }
};

export const updateOpening = async (req, res) => {
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

        // Build update data object
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (domain !== undefined) updateData.domain = domain;
        if (workType !== undefined) updateData.workType = workType;
        if (numberOfSlots !== undefined) updateData.numberOfSlots = parseInt(numberOfSlots);
        if (preText !== undefined) updateData.preText = preText;
        if (aboutRole !== undefined) updateData.aboutRole = aboutRole;
        if (skillsRequired !== undefined) updateData.skillsRequired = skillsRequired;
        if (extraInfo !== undefined) updateData.extraInfo = extraInfo;
        if (isActive !== undefined) updateData.isActive = isActive;

        const opening = await prisma.opening.update({
            where: { id },
            data: updateData,
        });

        return res.status(200).json({
            success: true,
            message: 'Opening updated successfully',
            data: opening,
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Failed to update opening',
            error: error.message,
        });
    }
};

export const deleteOpening = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.opening.delete({
            where: { id },
        });

        return res.status(200).json({
            success: true,
            message: 'Opening deleted successfully',
        });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Failed to delete opening',
            error: error.message,
        });
    }
};

export const toggleOpeningStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const opening = await prisma.opening.findUnique({
            where: { id },
        });

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
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
            message: 'Opening status updated',
            data: {
                id: updatedOpening.id,
                isActive: updatedOpening.isActive,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle opening status',
            error: error.message,
        });
    }
};

export const getOpeningStats = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if opening exists
        const opening = await prisma.opening.findUnique({
            where: { id },
            select: {
                views: true,
            },
        });

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }

        // Get total applications count
        const totalApplications = await prisma.application.count({
            where: { openingId: id },
        });

        // Get applications grouped by branch
        const applicationsByBranch = await prisma.application.groupBy({
            by: ['branch'],
            where: { openingId: id },
            _count: {
                branch: true,
            },
        });

        // Get applications grouped by year
        const applicationsByYear = await prisma.application.groupBy({
            by: ['yearOfStudy'],
            where: { openingId: id },
            _count: {
                yearOfStudy: true,
            },
        });

        // Format branch distribution
        const branchDistribution = {};
        applicationsByBranch.forEach(item => {
            branchDistribution[item.branch] = item._count.branch;
        });

        // Format year distribution
        const yearDistribution = {};
        applicationsByYear.forEach(item => {
            yearDistribution[item.yearOfStudy] = item._count.yearOfStudy;
        });

        return res.status(200).json({
            success: true,
            data: {
                views: opening.views,
                totalApplications,
                applicationsByBranch: branchDistribution,
                applicationsByYear: yearDistribution,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch opening stats',
            error: error.message,
        });
    }
};
