const InitiativePaymentService =
    require("../services/initiativePaymentService");


class InitiativePaymentController {

    /**
     * ==========================================
     * Initialize Initiative Payment
     * POST /api/initiative-payments/initialize
     * ==========================================
     */
    static async initialize(req, res) {

        try {

            // ======================================
            // Get Authenticated Member
            // ======================================

            const memberId =
                req.user.member_id;

            if (!memberId) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Authenticated member account is required."

                });

            }


            // ======================================
            // Get Payment Purpose
            // ======================================

            const {
                purpose
            } = req.body;


            // ======================================
            // Initialize Payment
            // ======================================

            const payment =
                await InitiativePaymentService
                    .initializePayment(

                        memberId,

                        purpose

                    );


            // ======================================
            // Return Flutterwave Response
            // ======================================

            return res.status(200).json({

                success: true,

                message:
                    "Payment initialized successfully.",

                data: payment

            });

        }

        catch (error) {

            console.error(
                "Initiative Payment Initialization Error:",
                error
            );

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }

    }


    /**
     * ==========================================
     * Flutterwave Redirect Verification
     * GET /api/initiative-payments/verify
     * ==========================================
     */
    static async verify(req, res) {

        try {

            const transactionId =
                req.query.transaction_id;


            if (!transactionId) {

                return res.redirect(
                    `${process.env.APP_URL}/lafia-gospel-gist.html?payment=failed`
                );

            }


            await InitiativePaymentService
                .verifyPayment(
                    transactionId
                );


            // ======================================
            // Return Member to Initiative Page
            // ======================================

            return res.redirect(
                `${process.env.APP_URL}/lafia-gospel-gist.html?payment=success`
            );

        }

        catch (error) {

            console.error(
                "Initiative Payment Verification Error:",
                error
            );


            return res.redirect(
                `${process.env.APP_URL}/lafia-gospel-gist.html?payment=failed`
            );

        }

    }


    /**
     * ==========================================
     * Flutterwave Webhook
     * POST /api/initiative-payments/webhook
     * ==========================================
     */
    static async webhook(req, res) {

        try {

            const signature =
                req.headers["verif-hash"];


            // ======================================
            // Validate Webhook Signature
            // ======================================

            if (

                !signature ||

                signature !==
                    process.env.FLW_WEBHOOK_SECRET

            ) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid webhook signature."

                });

            }


            // ======================================
            // Process Payment
            // ======================================

            await InitiativePaymentService
                .processWebhook(
                    req.body
                );


            return res.status(200).json({

                success: true

            });

        }

        catch (error) {

            console.error(
                "Initiative Payment Webhook Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }

}


module.exports =
    InitiativePaymentController;