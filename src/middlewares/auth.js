import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided',
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                domainName: true,
                name: true,
                role: true,
                isActive: true,
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'User account is inactive',
            });
        }

        // Attach full user object to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    };
};

export const isOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        // Admin can access everything
        if (req.user.role === 'ADMIN') {
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
                message: 'Opening not found',
            });
        }

        if (opening.createdById !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error',
            error: error.message,
        });
    }
};

export const isFormOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id } = req.params; // formId

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        // Admin can access everything
        if (req.user.role === 'ADMIN') {
            return next();
        }

        // Fetch form to check ownership
        const form = await prisma.form.findUnique({
            where: { id },
            select: { createdById: true },
        });

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Form not found',
            });
        }

        if (form.createdById !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error',
            error: error.message,
        });
    }
};

export const isFormFieldOwnerOrAdmin = async (req, res, next) => {
    try {
        const { id, formId } = req.params; // fieldId or formId depending on route
        const fieldId = id;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        // Admin can access everything
        if (req.user.role === 'ADMIN') {
            return next();
        }

        // Get the form associated with this field
        let form;

        if (fieldId) {
            // For individual field operations (update/delete)
            const formField = await prisma.formField.findUnique({
                where: { id: fieldId },
                select: {
                    form: {
                        select: { createdById: true },
                    },
                },
            });

            if (!formField) {
                return res.status(404).json({
                    success: false,
                    message: 'Form field not found',
                });
            }

            form = formField.form;
        } else if (formId) {
            // For reorder operation
            form = await prisma.form.findUnique({
                where: { id: formId },
                select: { createdById: true },
            });

            if (!form) {
                return res.status(404).json({
                    success: false,
                    message: 'Form not found',
                });
            }
        }

        if (form.createdById !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authorization error',
            error: error.message,
        });
    }
};
