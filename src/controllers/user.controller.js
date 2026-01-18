import bcrypt from 'bcrypt';
import { prisma } from '../lib/db.js';

export const createUser = async (req, res) => {
    try {
        const { domainName, password, name, role } = req.body;

        // Validate required fields
        if (!domainName || !password || !name || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (domainName, password, name, role)',
            });
        }

        // Normalize domain name (lowercase, no spaces)
        const normalizedDomainName = domainName.toLowerCase().trim().replace(/\s+/g, '-');

        // Check if domain already exists
        const existingUser = await prisma.user.findUnique({
            where: { domainName: normalizedDomainName },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Domain name already exists',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                domainName: normalizedDomainName,
                password: hashedPassword,
                name,
                role,
            },
            select: {
                id: true,
                domainName: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { role, isActive } = req.query;

        // Build filter object
        const where = {};
        if (role) where.role = role;
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                domainName: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            data: {
                users,
                total: users.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message,
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                domainName: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, isActive, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prepare update data
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (role !== undefined) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;

        // Hash password if provided
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update user
        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                domainName: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message,
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Delete user
        await prisma.user.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message,
        });
    }
};
