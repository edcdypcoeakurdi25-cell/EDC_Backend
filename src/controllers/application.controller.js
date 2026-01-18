import { prisma } from '../lib/db.js';

// SUBMIT Application (Public route for students)
export const submitApplication = async (req, res) => {
    try {
        const {
            openingId,
            formId,
            name,
            yearOfStudy,
            phoneNumber,
            email,
            branch,
            priorExperience,
            fieldResponses,
        } = req.body;

        // Validate opening exists and is active
        const opening = await prisma.opening.findUnique({
            where: { id: openingId },
        });

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }

        if (!opening.isActive) {
            return res.status(400).json({
                success: false,
                message: 'This opening is no longer accepting applications',
            });
        }

        // Validate form exists
        const form = await prisma.form.findUnique({
            where: { id: formId },
            include: {
                customFields: true,
            },
        });

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found',
            });
        }

        // Validate form belongs to opening
        if (form.openingId !== openingId) {
            return res.status(400).json({
                success: false,
                message: 'Form does not belong to this opening',
            });
        }

        // Validate required custom fields are answered
        const requiredFieldIds = form.customFields
            .filter(field => field.isRequired)
            .map(field => field.id);

        const answeredFieldIds = (fieldResponses || []).map(resp => resp.fieldId);
        const missingFields = requiredFieldIds.filter(id => !answeredFieldIds.includes(id));

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Please answer all required fields',
                missingFields,
            });
        }

        // Check for duplicate application (same email for same opening)
        const existingApplication = await prisma.application.findFirst({
            where: {
                openingId,
                email,
            },
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this opening',
            });
        }

        // Create application with field responses in a transaction
        const application = await prisma.$transaction(async tx => {
            // Create application
            const newApplication = await tx.application.create({
                data: {
                    openingId,
                    formId,
                    name,
                    yearOfStudy,
                    phoneNumber,
                    email,
                    branch,
                    priorExperience: priorExperience || null,
                },
            });

            // Create field responses if provided
            if (fieldResponses && Array.isArray(fieldResponses) && fieldResponses.length > 0) {
                const responsesToCreate = fieldResponses.map(resp => ({
                    applicationId: newApplication.id,
                    fieldId: resp.fieldId,
                    responseValue: resp.responseValue || '',
                    fileUrl: resp.fileUrl || null,
                }));

                await tx.fieldResponse.createMany({
                    data: responsesToCreate,
                });
            }

            // Fetch complete application with responses
            const completeApplication = await tx.application.findUnique({
                where: { id: newApplication.id },
                include: {
                    fieldResponses: {
                        include: {
                            field: true,
                        },
                    },
                    opening: {
                        select: {
                            id: true,
                            title: true,
                            domain: true,
                        },
                    },
                },
            });

            return completeApplication;
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application,
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message,
        });
    }
};

// GET All Applications (with filters)
export const getAllApplications = async (req, res) => {
    try {
        const { openingId, yearOfStudy, branch, page = 1, limit = 20 } = req.query;

        // Build filter object
        const where = {};
        if (openingId) where.openingId = openingId;
        if (yearOfStudy) where.yearOfStudy = yearOfStudy;
        if (branch) where.branch = branch;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Fetch applications with pagination
        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where,
                skip,
                take,
                orderBy: { submittedAt: 'desc' },
                include: {
                    opening: {
                        select: {
                            id: true,
                            title: true,
                            domain: true,
                            workType: true,
                        },
                    },
                    form: {
                        select: {
                            id: true,
                            hasPriorExp: true,
                        },
                    },
                },
            }),
            prisma.application.count({ where }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                applications,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message,
        });
    }
};

// GET Application by ID
export const getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;

        const application = await prisma.application.findUnique({
            where: { id },
            include: {
                fieldResponses: {
                    include: {
                        field: {
                            select: {
                                id: true,
                                fieldTitle: true,
                                inputType: true,
                                isRequired: true,
                                options: true,
                            },
                        },
                    },
                    orderBy: {
                        field: {
                            order: 'asc',
                        },
                    },
                },
                opening: {
                    select: {
                        id: true,
                        title: true,
                        domain: true,
                        workType: true,
                        numberOfSlots: true,
                    },
                },
                form: {
                    select: {
                        id: true,
                        hasPriorExp: true,
                    },
                },
            },
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        res.status(200).json({
            success: true,
            data: application,
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application',
            error: error.message,
        });
    }
};

// GET Applications by Opening ID (with filters)
export const getApplicationsByOpening = async (req, res) => {
    try {
        const { openingId } = req.params;
        const { yearOfStudy, branch, page = 1, limit = 20 } = req.query;

        // Build filter object
        const where = { openingId };
        if (yearOfStudy) where.yearOfStudy = yearOfStudy;
        if (branch) where.branch = branch;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        // Fetch applications
        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where,
                skip,
                take,
                orderBy: { submittedAt: 'desc' },
                include: {
                    fieldResponses: {
                        include: {
                            field: {
                                select: {
                                    fieldTitle: true,
                                    inputType: true,
                                },
                            },
                        },
                    },
                },
            }),
            prisma.application.count({ where }),
        ]);

        // Get opening details
        const opening = await prisma.opening.findUnique({
            where: { id: openingId },
            select: {
                id: true,
                title: true,
                domain: true,
                workType: true,
                numberOfSlots: true,
            },
        });

        res.status(200).json({
            success: true,
            data: {
                opening,
                applications,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / take),
            },
        });
    } catch (error) {
        console.error('Error fetching applications by opening:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message,
        });
    }
};

// DELETE Application (ADMIN only)
export const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if application exists
        const application = await prisma.application.findUnique({
            where: { id },
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        // Delete application (cascade will delete field responses)
        await prisma.application.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'Application deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting application:', error);

        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: 'Application not found',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to delete application',
            error: error.message,
        });
    }
};
