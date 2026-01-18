import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/db.js';

export const login = async (req, res) => {
    try {
        const { domainName, password } = req.body;

        // Validate input
        if (!domainName || !password) {
            return res.status(400).json({
                success: false,
                message: 'Domain name and password are required',
            });
        }

        // Normalize domain name
        const normalizedDomainName = domainName.toLowerCase().trim();

        // Find user by domain name
        const user = await prisma.user.findUnique({
            where: { domainName: normalizedDomainName },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is inactive',
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                domainName: user.domainName,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    domainName: user.domainName,
                    name: user.name,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        // With JWT, logout is handled client-side by removing the token
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during logout',
            error: error.message,
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                id: req.user.id,
                domainName: req.user.domainName,
                name: req.user.name,
                role: req.user.role,
                isActive: req.user.isActive,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message,
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Old password and new password are required',
            });
        }

        // Get current user with password
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
        });

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: req.user.id },
            data: { password: hashedPassword },
        });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message,
        });
    }
};
