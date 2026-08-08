const JwtUtil = require("../utils/jwt");

function authenticate(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        // Check Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Token missing."
            });
        }

        // Verify JWT
        const decoded = JwtUtil.verifyToken(token);

        // Attach authenticated user
        req.user = {
            id: decoded.id,
            member_id: decoded.member_id,
            roles: decoded.roles
        };

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

}

module.exports = authenticate;