const generatetoken = require('../utils/generateToken');
const roleMiddleware = (...roles) => {

    return (req, res, next) => {
        try {

            if (!req.user) {
                return res.status(401).json({
                    message: "User not authenticated"
                });
            }

            const userRole = req.user.role;
            
            if (!roles.includes(userRole)) {
                return res.status(403).json({
                    message: "Access denied: insufficient permissions"
                });
            }

            next();

        } catch (error) {

            res.status(500).json({
                message: "Authorization error",
                error: error.message
            });

        }

    };

};

module.exports = roleMiddleware;