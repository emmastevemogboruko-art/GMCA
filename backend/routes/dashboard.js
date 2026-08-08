const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/dashboardController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/**
 * ==========================================
 * Dashboard Routes
 * ==========================================
 */

// Dashboard Summary
router.get(
    "/",
    authenticate,
    authorize("Super Admin", "Administrator"),
    DashboardController.getDashboard
);

module.exports = router;