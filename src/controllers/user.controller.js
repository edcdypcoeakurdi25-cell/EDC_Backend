import bcrypt from 'bcrypt';
import { prisma } from '../lib/db.js';

export const getAllUsers = async (req, res) => {
    // GET /api/users
    // Query: ?role=ADMIN&isActive=true
    // Returns: { users: [], total }
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
                // Don't send password
            },
        });

        res.status(200).json({
            success: true,
            data: users,
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
    // GET /api/users/:id
    // Returns: { user }
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
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
    // PUT /api/users/:id
    // Body: { name, role, isActive }
    // Returns: { user }
    try {
        const { id } = req.params;
        const { email, password, name, role, is_active } = req.body;

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

        if (email) updateData.email = email;
        if (name) updateData.name = name;
        if (role) updateData.role = role;
        if (is_active !== undefined) updateData.is_active = is_active;

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
                email: true,
                name: true,
                role: true,
                is_active: true,
                created_at: true,
                updated_at: true,
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
    // DELETE /api/users/:id
    // Returns: { message }
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
