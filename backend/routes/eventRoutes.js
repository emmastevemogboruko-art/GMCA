const express = require("express");
const router = express.Router();

const EventController = require("../controllers/eventController");
const EventRegistrationController = require("../controllers/eventRegistrationController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

/*
|--------------------------------------------------------------------------
| Event CRUD Routes
|--------------------------------------------------------------------------
*/

// Get all events (Public)
router.get(
    "/",
    EventController.getAll
);

// Get event by ID (Public)
router.get(
    "/:id",
    EventController.getById
);

// Create event (Admin Only)
router.post(
    "/",
    authenticate,
    authorize("Super Admin", "Administrator"),
    EventController.create
);

// Update event (Admin Only)
router.put(
    "/:id",
    authenticate,
    authorize("Super Admin", "Administrator"),
    EventController.update
);

// Delete event (Admin Only)
router.delete(
    "/:id",
    authenticate,
    authorize("Super Admin", "Administrator"),
    EventController.delete
);

/*
|--------------------------------------------------------------------------
| Event Registration Routes
|--------------------------------------------------------------------------
*/

// Register member for an event (Admin Only)
router.post(
    "/:eventId/register",
    authenticate,
    authorize("Super Admin", "Administrator"),
    EventRegistrationController.register
);

// Get members registered for an event (Admin Only)
router.get(
    "/:eventId/members",
    authenticate,
    authorize("Super Admin", "Administrator"),
    EventRegistrationController.getMembers
);

// Update attendance (Admin Only)
router.patch(
    "/:eventId/attendance/:memberId",
    authenticate,
    authorize("Super Admin", "Administrator"),
    EventRegistrationController.updateAttendance
);

// Remove member from an event (Admin Only)
router.delete(
    "/:eventId/members/:memberId",
    authenticate,
    authorize("Super Admin", "Administrator"),
    EventRegistrationController.remove
);

module.exports = router;