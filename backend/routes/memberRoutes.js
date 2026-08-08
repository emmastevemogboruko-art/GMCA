const express = require("express");
const router = express.Router();

const MemberController = require("../controllers/memberController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * ==========================================
 * Members Routes
 * ==========================================
 */

// Get all members (Admin Only)
router.get(
    "/",
    authenticate,
    authorize("Super Admin", "Administrator"),
    MemberController.getAll
);

// Get member by ID (Admin Only)
router.get(
    "/:id",
    authenticate,
    authorize("Super Admin", "Administrator"),
    MemberController.getById
);

// Create member from an approved application (Admin Only)
router.post(
    "/application/:applicationId",
    authenticate,
    authorize("Super Admin", "Administrator"),
    MemberController.create
);

module.exports = router;