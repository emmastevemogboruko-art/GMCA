const express = require("express");

const router = express.Router();

const InitiativePaymentController =
    require("../controllers/initiativePaymentController");

const authenticate =
    require("../middleware/authenticate");


/**
 * ==========================================
 * Initialize Initiative Payment
 * ==========================================
 *
 * Member must be authenticated.
 *
 * POST /api/initiative-payments/initialize
 *
 */

router.post(
    "/initialize",
    authenticate,
    InitiativePaymentController.initialize
);


/**
 * ==========================================
 * Flutterwave Redirect Verification
 * ==========================================
 *
 * Flutterwave calls this after payment.
 *
 * GET /api/initiative-payments/verify
 *
 */

router.get(
    "/verify",
    InitiativePaymentController.verify
);


/**
 * ==========================================
 * Flutterwave Webhook
 * ==========================================
 *
 * Flutterwave server-to-server notification.
 *
 * POST /api/initiative-payments/webhook
 *
 */

router.post(
    "/webhook",
    InitiativePaymentController.webhook
);


module.exports = router;