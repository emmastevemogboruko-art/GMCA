const express = require("express");
const router = express.Router();

const MemberPortalController = require("../controllers/memberPortalController");
const authenticate = require("../middleware/authenticate");

/**
 * ==========================================
 * Member Portal Routes
 * ==========================================
 */

// View Own Profile
router.get(
    "/profile",
    authenticate,
    MemberPortalController.getProfile
);

// View All Events
router.get(
    "/events",
    authenticate,
    MemberPortalController.getEvents
);

// View Event Details
router.get(
    "/events/:id",
    authenticate,
    MemberPortalController.getEventById
);

// Register for Event
router.post(
    "/events/:eventId/register",
    authenticate,
    MemberPortalController.registerForEvent
);

module.exports = router;