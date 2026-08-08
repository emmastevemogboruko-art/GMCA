const crypto = require("crypto");

const UserTokenModel = require("../models/userTokenModel");

class UserTokenService {

    /**
     * ==========================================
     * Generate Secure Token
     * ==========================================
     */
    static generateToken() {

        return crypto
            .randomBytes(32)
            .toString("hex");

    }

    /**
     * ==========================================
     * Create Activation Token
     * ==========================================
     */
    static async createActivationToken(userId) {

        // Expire previous activation tokens
        await UserTokenModel.expireUserTokens(
            userId,
            "ACTIVATION"
        );

        // Generate secure token
        const token =
            this.generateToken();

        // Expires in 24 hours
        const expiresAt =
            new Date(
                Date.now() +
                (24 * 60 * 60 * 1000)
            );

        return await UserTokenModel.create({

            user_id: userId,

            token,

            token_type: "ACTIVATION",

            expires_at: expiresAt

        });

    }

    /**
     * ==========================================
     * Generate Activation Link
     * ==========================================
     */
    static getActivationLink(token) {

        return `${process.env.APP_URL}/activate-account.html?token=${token}`;

    }

    /**
     * ==========================================
     * Validate Activation Token
     * ==========================================
     */
    static async validateActivationToken(token) {

        if (!token) {

            throw new Error(
                "Activation token is required."
            );

        }

        const activationToken =
            await UserTokenModel.findValidToken(
                token
            );

        if (!activationToken) {

            throw new Error(
                "Invalid or expired activation link."
            );

        }

        return activationToken;

    }

    /**
     * ==========================================
     * Mark Activation Token As Used
     * ==========================================
     */
    static async markTokenAsUsed(token) {

        return await UserTokenModel.markAsUsed(
            token
        );

    }

    /**
     * ==========================================
     * Activate User Account
     * ==========================================
     */
    static async activateAccount(
        token,
        password,
        confirmPassword
    ) {

        if (!password || !confirmPassword) {

            throw new Error(
                "Password and confirmation are required."
            );

        }

        if (password !== confirmPassword) {

            throw new Error(
                "Passwords do not match."
            );

        }

    

        // Validate activation token
        const activation =
            await this.validateActivationToken(
                token
            );

        // Hash new password
        const bcrypt =
            require("bcrypt");

        const passwordHash =
            await bcrypt.hash(
                password,
                10
            );

        // Update user password
        const UserModel =
            require("../models/userModel");

        await UserModel.updatePassword(

            activation.user_id,

            passwordHash

        );

        await UserModel.updateStatus(

            activation.user_id,
            
            true
        );

        // Mark token as used
        await this.markTokenAsUsed(
            token
        );

        return {

            success: true,

            message:
                "Account activated successfully."

        };

    }

    /**
     * ==========================================
     * Delete Expired Tokens
     * ==========================================
     */
    static async cleanupExpiredTokens() {

        return await UserTokenModel.deleteExpiredTokens();

    }

}

module.exports = UserTokenService;