const bcrypt = require("bcrypt");
const AuthModel = require("../models/authModel");
const JwtUtil = require("../utils/jwt");

class AuthService {

    /**
     * ==========================================
     * Login User
     * ==========================================
     */
    static async login(identifier, password) {

        // Find user by username or email
        const user = await AuthModel.findByUsernameOrEmail(identifier);

        if (!user) {
            throw new Error("Invalid username/email or password.");
        }

        // Check if account is active
        if (!user.is_active) {
            throw new Error("Your account has been deactivated.");
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            throw new Error("Invalid username/email or password.");
        }

        // Get user roles
        const roles = await AuthModel.getUserRoles(user.id);

        // Generate JWT
        const token = JwtUtil.generateToken({
            id: user.id,
            member_id: user.member_id,
            roles: roles.map(role => role.name)
        });

        // Update last login
        await AuthModel.updateLastLogin(user.id);

        return {
            token,
            user: {
                id: user.id,
                member_id: user.member_id,
                username: user.username,
                email: user.email,
                roles: roles.map(role => role.name)
            }
        };
    }

    /**
     * ==========================================
     * Get Authenticated User
     * ==========================================
     */
    static async getUser(userId) {

        const user = await AuthModel.findById(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        const roles = await AuthModel.getUserRoles(user.id);

        return {
            id: user.id,
            member_id: user.member_id,
            username: user.username,
            email: user.email,
            is_active: user.is_active,
            last_login: user.last_login,
            roles: roles.map(role => role.name)
        };
    }

}

module.exports = AuthService;