const express = require("express");
const router = express.Router();

const PublicEventController =
    require("../controllers/publicEventController");

/*
|--------------------------------------------------------------------------
| Public Event Routes
|--------------------------------------------------------------------------
| These routes are publicly accessible and do not require authentication.
| Only published events are exposed.
|--------------------------------------------------------------------------
*/

/**
 * ==========================================
 * Upcoming Events
 * GET /api/public/events/upcoming
 * ==========================================
 */
router.get(
    "/upcoming",
    PublicEventController.getUpcomingEvents
);

/**
 * ==========================================
 * Featured Events
 * GET /api/public/events/featured
 * ==========================================
 */
router.get(
    "/featured",
    PublicEventController.getFeaturedEvents
);

/**
 * ==========================================
 * Event Details
 * GET /api/public/events/:id
 * ==========================================
 */
router.get(
    "/:id",
    PublicEventController.getEventById
);

module.exports = router;