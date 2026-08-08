const jwt = require("jsonwebtoken");

class JwtUtil {
    /**
     * ==========================================
     * Generate JWT Token
     * ==========================================
     */
    static generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                member_id: user.member_id,
                roles: user.roles
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "8h"
            }
        );
    }

    /**
     * ==========================================
     * Verify JWT Token
     * ==========================================
     */
    static verifyToken(token) {
        return jwt.verify(
            token,
            process.env.JWT_SECRET
        );
    }

    /**
     * ==========================================
     * Decode JWT Token (without verification)
     * Useful for debugging only
     * ==========================================
     */
    static decodeToken(token) {
        return jwt.decode(token);
    }
}

module.exports = JwtUtil;