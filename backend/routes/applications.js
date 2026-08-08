const express = require("express");
const router = express.Router();

const ApplicationController = require("../controllers/applicationController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * ==========================================
 * Application Routes
 * ==========================================
 */

// Submit Membership Application (Public)
router.post(
    "/",
    ApplicationController.submitApplication
);

// Get All Applications (Admin Only)
router.get(
    "/",
    authenticate,
    authorize("Super Admin", "Administrator"),
    ApplicationController.getApplications
);

// Get Application By ID (Admin Only)
router.get(
    "/:id",
    authenticate,
    authorize("Super Admin", "Administrator"),
    ApplicationController.getApplicationById
);

// Approve / Reject Application (Admin Only)
router.patch(
    "/:id/status",
    authenticate,
    authorize("Super Admin", "Administrator"),
    ApplicationController.updateApplicationStatus
);

module.exports = router;