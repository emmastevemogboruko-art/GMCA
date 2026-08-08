const express = require("express");
const router = express.Router();

const MemberController = require("../controllers/memberController");

const authenticate = require("../middleware/authenticate");

/*
|--------------------------------------------------------------------------
| Member Profile Routes
|--------------------------------------------------------------------------
*/

// Get logged-in member profile
router.get(
    "/",
    authenticate,
    MemberController.getProfile
);

module.exports = router;