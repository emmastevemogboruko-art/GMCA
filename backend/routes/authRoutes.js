const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");

const authenticate = require("../middleware/authenticate");

/**
 * ==========================================
 * Authentication Routes
 * ==========================================
 */

// Login
router.post(
    "/login",
    AuthController.login
);

// Get Current Authenticated User
router.get(
    "/me",
    authenticate,
    AuthController.me
);

// Change Own Password
router.patch(
    "/change-password",
    authenticate,
    AuthController.changePassword
);

/**
 * ==========================================
 * Activate Account
 * ==========================================
 */

router.post(
    "/activate",
    AuthController.activateAccount
);

module.exports = router;