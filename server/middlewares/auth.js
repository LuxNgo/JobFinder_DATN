const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')


exports.createToken = (id, email) => {
    const token = jwt.sign(
        {
            id, email
        }, process.env.JWT_SECRET,
        {
            expiresIn: '5d'
        }
    )

    return token ;
}


exports.isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                isLogin: false,
                message: "Missing Token"
            });
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    isLogin: false,
                    message: "User not found"
                });
            }
            
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                isLogin: false,
                message: "Invalid or expired token"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


exports.authorizationRoles = (...roles) => {
    return (req, res, next) => {
        // Special handling for admin role updates
        if (req.path === '/admin/updateUser/:id' && req.method === 'PUT') {
            // Get the current user's role from the request
            const currentRole = req.user.role;
            
            // If the user is trying to update their own role
            if (req.params.id === req.user._id) {
                // Only allow admin to keep admin role
                if (currentRole === 'admin' && req.body.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: "Admin cannot change their own role to non-admin"
                    });
                }
                // Allow other role changes for self
                return next();
            }
            
            // For updating other users
            // Only admin can update roles
            if (currentRole !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: "Only admins can update user roles"
                });
            }
            
            // Admin can update any other user's role
            return next();
        }

        // Regular authorization check for other routes
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not allowed to access this resource`
            });
        }
        next();
    };
};