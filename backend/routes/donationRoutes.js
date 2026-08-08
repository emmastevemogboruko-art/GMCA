const express = require("express");

const router = express.Router();

const DonationController =
    require("../controllers/donationController");

/**
 * ==========================================
 * Initialize Donation
 * ==========================================
 */

router.post(
    "/initialize",
    DonationController.initialize
);

/**
 * ==========================================
 * Flutterwave Redirect
 * ==========================================
 */

router.get(
    "/verify",
    DonationController.verify
);

/**
 * ==========================================
 * Flutterwave Webhook
 * ==========================================
 */

router.post(
    "/webhook",
    DonationController.webhook
);

module.exports = router;