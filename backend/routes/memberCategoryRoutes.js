const express = require("express");
const router = express.Router();

const MemberCategoryController = require("../controllers/memberCategoryController");

/**
 * ==========================================
 * Member Categories
 * ==========================================
 */

// Public
router.get(
    "/",
    MemberCategoryController.getAll
);

module.exports = router;