import { prisma } from '../lib/db.js';

// GET Summary View
export const getSummaryView = async (req, res) => {
    try {
        const { openingId } = req.params;

        // Verify opening exists
        const opening = await prisma.opening.findUnique({
            where: { id: openingId },
        });

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }

        // Get total applications
        const totalApplications = await prisma.application.count({
            where: { openingId },
        });

        // Get all applications with responses
        const applications = await prisma.application.findMany({
            where: { openingId },
            include: {
                fieldResponses: {
                    include: {
                        field: true,
                    },
                },
            },
        });

        // Get form with custom fields
        const form = await prisma.form.findUnique({
            where: { openingId },
            include: {
                customFields: {
                    orderBy: { order: 'asc' },
                },
            },
        });

        // Build field summaries
        const fieldSummaries = [];

        // Fixed fields summaries
        // Name
        const names = applications.map(app => app.name);
        fieldSummaries.push({
            fieldTitle: 'Name',
            fieldType: 'fixed',
            responses: names.map(name => ({ value: name, count: 1 })),
        });

        // Year of Study
        const yearCounts = {};
        applications.forEach(app => {
            yearCounts[app.yearOfStudy] = (yearCounts[app.yearOfStudy] || 0) + 1;
        });
        fieldSummaries.push({
            fieldTitle: 'Year of Study',
            fieldType: 'fixed',
            responses: Object.entries(yearCounts).map(([value, count]) => ({ value, count })),
        });

        // Branch
        const branchCounts = {};
        applications.forEach(app => {
            branchCounts[app.branch] = (branchCounts[app.branch] || 0) + 1;
        });
        fieldSummaries.push({
            fieldTitle: 'Branch',
            fieldType: 'fixed',
            responses: Object.entries(branchCounts).map(([value, count]) => ({ value, count })),
        });

        // Phone Number
        fieldSummaries.push({
            fieldTitle: 'Phone Number',
            fieldType: 'fixed',
            totalResponses: applications.length,
        });

        // Email
        fieldSummaries.push({
            fieldTitle: 'Email',
            fieldType: 'fixed',
            totalResponses: applications.length,
        });

        // Prior Experience (if enabled)
        if (form && form.hasPriorExp) {
            fieldSummaries.push({
                fieldTitle: 'Prior Experience',
                fieldType: 'fixed',
                totalResponses: applications.filter(app => app.priorExperience).length,
            });
        }

        // Custom fields summaries
        if (form && form.customFields) {
            form.customFields.forEach(field => {
                const responses = applications.flatMap(app =>
                    app.fieldResponses.filter(resp => resp.fieldId === field.id)
                );

                if (
                    field.inputType === 'MULTIPLE_CHOICE' ||
                    field.inputType === 'MULTIPLE_CORRECT'
                ) {
                    // Aggregate counts for choice fields
                    const choiceCounts = {};
                    responses.forEach(resp => {
                        const value = resp.responseValue;
                        if (value) {
                            choiceCounts[value] = (choiceCounts[value] || 0) + 1;
                        }
                    });
                    fieldSummaries.push({
                        fieldTitle: field.fieldTitle,
                        fieldType: field.inputType,
                        responses: Object.entries(choiceCounts).map(([value, count]) => ({
                            value,
                            count,
                        })),
                    });
                } else {
                    // For text and file uploads, just show count
                    fieldSummaries.push({
                        fieldTitle: field.fieldTitle,
                        fieldType: field.inputType,
                        totalResponses: responses.length,
                    });
                }
            });
        }

        // Distribution data
        const branchDistribution = branchCounts;
        const yearDistribution = yearCounts;

        res.status(200).json({
            success: true,
            data: {
                totalApplications,
                fieldSummaries,
                branchDistribution,
                yearDistribution,
            },
        });
    } catch (error) {
        console.error('Error getting summary view:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch summary view',
            error: error.message,
        });
    }
};

// GET Question View
export const getQuestionView = async (req, res) => {
    try {
        const { openingId } = req.params;
        const { fieldId } = req.query;

        if (!fieldId) {
            return res.status(400).json({
                success: false,
                message: 'fieldId query parameter is required',
            });
        }

        // Verify opening exists
        const opening = await prisma.opening.findUnique({
            where: { id: openingId },
        });

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }

        // Get field details
        const field = await prisma.formField.findUnique({
            where: { id: fieldId },
            select: {
                id: true,
                fieldTitle: true,
                inputType: true,
                isRequired: true,
                options: true,
            },
        });

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found',
            });
        }

        // Get all responses for this field
        const responses = await prisma.fieldResponse.findMany({
            where: {
                fieldId,
                application: {
                    openingId,
                },
            },
            include: {
                application: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        submittedAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Format responses
        const formattedResponses = responses.map(resp => ({
            applicationId: resp.application.id,
            applicantName: resp.application.name,
            applicantEmail: resp.application.email,
            responseValue: resp.responseValue,
            fileUrl: resp.fileUrl,
            submittedAt: resp.application.submittedAt,
        }));

        res.status(200).json({
            success: true,
            data: {
                field,
                responses: formattedResponses,
                totalResponses: formattedResponses.length,
            },
        });
    } catch (error) {
        console.error('Error getting question view:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch question view',
            error: error.message,
        });
    }
};

// GET Individual View
export const getIndividualView = async (req, res) => {
    try {
        const { openingId, applicationId } = req.params;

        // Get application with all details
        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                openingId,
            },
            include: {
                fieldResponses: {
                    include: {
                        field: {
                            select: {
                                fieldTitle: true,
                                inputType: true,
                                isRequired: true,
                                options: true,
                                order: true,
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

        // Format responses
        const formattedResponses = application.fieldResponses.map(resp => ({
            fieldTitle: resp.field.fieldTitle,
            inputType: resp.field.inputType,
            isRequired: resp.field.isRequired,
            responseValue: resp.responseValue,
            fileUrl: resp.fileUrl,
        }));

        res.status(200).json({
            success: true,
            data: {
                application: {
                    id: application.id,
                    name: application.name,
                    yearOfStudy: application.yearOfStudy,
                    phoneNumber: application.phoneNumber,
                    email: application.email,
                    branch: application.branch,
                    priorExperience: application.priorExperience,
                    submittedAt: application.submittedAt,
                },
                opening: application.opening,
                responses: formattedResponses,
            },
        });
    } catch (error) {
        console.error('Error getting individual view:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch individual view',
            error: error.message,
        });
    }
};

// EXPORT Applications as CSV
export const exportApplicationsCSV = async (req, res) => {
    try {
        const { openingId } = req.params;

        // Verify opening exists
        const opening = await prisma.opening.findUnique({
            where: { id: openingId },
            select: {
                id: true,
                title: true,
            },
        });

        if (!opening) {
            return res.status(404).json({
                success: false,
                message: 'Opening not found',
            });
        }

        // Get all applications with responses
        const applications = await prisma.application.findMany({
            where: { openingId },
            include: {
                fieldResponses: {
                    include: {
                        field: {
                            select: {
                                fieldTitle: true,
                                order: true,
                            },
                        },
                    },
                    orderBy: {
                        field: {
                            order: 'asc',
                        },
                    },
                },
            },
            orderBy: {
                submittedAt: 'asc',
            },
        });

        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No applications found for this opening',
            });
        }

        // Get all unique custom field titles
        const customFieldTitles = [];
        if (applications.length > 0 && applications[0].fieldResponses.length > 0) {
            const seenTitles = new Set();
            applications[0].fieldResponses.forEach(resp => {
                if (!seenTitles.has(resp.field.fieldTitle)) {
                    customFieldTitles.push(resp.field.fieldTitle);
                    seenTitles.add(resp.field.fieldTitle);
                }
            });
        }

        // Build CSV header
        const headers = [
            'Name',
            'Year of Study',
            'Phone Number',
            'Email',
            'Branch',
            'Prior Experience',
            ...customFieldTitles,
            'Submitted At',
        ];

        // Build CSV rows
        const rows = applications.map(app => {
            const customFieldValues = customFieldTitles.map(title => {
                const response = app.fieldResponses.find(resp => resp.field.fieldTitle === title);
                return response ? response.responseValue || '' : '';
            });

            return [
                app.name,
                app.yearOfStudy,
                app.phoneNumber,
                app.email,
                app.branch,
                app.priorExperience || '',
                ...customFieldValues,
                new Date(app.submittedAt).toLocaleString(),
            ];
        });

        // Convert to CSV format
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');

        // Set headers for file download
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${opening.title.replace(/[^a-z0-9]/gi, '_')}_applications.csv"`
        );

        res.status(200).send(csvContent);
    } catch (error) {
        console.error('Error exporting applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export applications',
            error: error.message,
        });
    }
};
