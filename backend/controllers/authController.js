const AuthService = require("../services/authService");
const UserService = require("../services/userService");
const UserTokenService = require("../services/userTokenService");

class AuthController {

    /**
     * ==========================================
     * Login
     * POST /api/auth/login
     * ==========================================
     */
    static async login(req, res) {
        try {

            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Username/email and password are required."
                });
            }

            const result = await AuthService.login(
                identifier,
                password
            );

            return res.status(200).json({
                success: true,
                message: "Login successful.",
                data: result
            });

        } catch (error) {

            return res.status(401).json({
                success: false,
                message: error.message
            });

        }
    }

    /**
     * ==========================================
     * Get Current User
     * GET /api/auth/me
     * ==========================================
     */
    static async me(req, res) {
        try {

            const user = await AuthService.getUser(req.user.id);

            return res.status(200).json({
                success: true,
                data: user
            });

        } catch (error) {

            return res.status(404).json({
                success: false,
                message: error.message
            });

        }
    }

    /**
     * ==========================================
     * Change Own Password
     * PATCH /api/auth/change-password
     * ==========================================
     */
    static async changePassword(req, res) {
        try {

            const {
                currentPassword,
                newPassword,
                confirmPassword
            } = req.body;

            const result =
                await UserService.changePassword(
                    req.user.id,
                    currentPassword,
                    newPassword,
                    confirmPassword
                );

            return res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }

    /**
     * ==========================================
     * Activate Account
     * POST /api/auth/activate
     * ==========================================
     */
    static async activateAccount(req, res) {

        try {

            const {

                token,

                password,

                confirmPassword

            } = req.body;

            const result =
                await UserTokenService.activateAccount(

                    token,

                    password,

                    confirmPassword

                );

            return res.status(200).json({

                success: true,

                message: result.message

            });

        }

        catch (error) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

    }
}

module.exports = AuthController;