export const authenticate = async (req, res, next) => {
    // Verify JWT token and attach user to req.user
};

export const authorize = (...roles) => {
    // Check if req.user.role is in allowed roles
    return (req, res, next) => {
        // Implementation
    };
};

export const isOwnerOrAdmin = async (req, res, next) => {
    // Check if user is owner of resource or admin
};
