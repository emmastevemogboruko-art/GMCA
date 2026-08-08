const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const UserModel = require("../models/userModel");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * =====================================================
 * Bootstrap Middleware
 * Allows creation of the very first user only.
 * =====================================================
 */
async function bootstrap(req, res, next) {

    try {

        const totalUsers = await UserModel.countUsers();

        // No users exist yet
        if (totalUsers === 0) {
            return next();
        }

        // Otherwise require Super Admin authentication
        authenticate(req, res, () => {
            authorize("Super Admin")(req, res, next);
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

}

/**
 * =====================================================
 * User Routes
 * =====================================================
 */

// Create User
router.post(
    "/",
    bootstrap,
    UserController.createUser
);

// Get All Users
router.get(
    "/",
    authenticate,
    authorize("Super Admin"),
    UserController.getAllUsers
);

// Get User By ID
router.get(
    "/:id",
    authenticate,
    authorize("Super Admin"),
    UserController.getUser
);

// Activate / Deactivate User
router.patch(
    "/:id/status",
    authenticate,
    authorize("Super Admin"),
    UserController.updateStatus
);

// Reset Password
router.patch(
    "/:id/password",
    authenticate,
    authorize("Super Admin"),
    UserController.resetPassword
);

module.exports = router;