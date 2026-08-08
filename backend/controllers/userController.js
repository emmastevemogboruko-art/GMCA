const UserService = require("../services/userService");

class UserController {

    /**
     * ==========================================
     * Create User
     * POST /api/users
     * ==========================================
     */
    static async createUser(req, res) {

        try {

            const assignedBy = req.user ? req.user.id : null;

            const user = await UserService.createUser(
                req.body,
                assignedBy
            );

            return res.status(201).json({
                success: true,
                message: "User created successfully.",
                data: user
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
     * Get All Users
     * GET /api/users
     * ==========================================
     */
    static async getAllUsers(req, res) {

        try {

            const users = await UserService.getAllUsers();

            return res.status(200).json({
                success: true,
                data: users
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * ==========================================
     * Get User By ID
     * GET /api/users/:id
     * ==========================================
     */
    static async getUser(req, res) {

        try {

            const user = await UserService.getUser(
                req.params.id
            );

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
     * Activate / Deactivate User
     * PATCH /api/users/:id/status
     * ==========================================
     */
    static async updateStatus(req, res) {

        try {

            const result =
                await UserService.updateStatus(
                    req.params.id,
                    req.body.is_active
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
     * Reset Password
     * PATCH /api/users/:id/password
     * ==========================================
     */
    static async resetPassword(req, res) {

        try {

            const result =
                await UserService.resetPassword(
                    req.params.id,
                    req.body.password
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

}

module.exports = UserController;