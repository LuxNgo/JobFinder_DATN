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
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not allowed to access this resource`
            });
        }

        next();
    };
};