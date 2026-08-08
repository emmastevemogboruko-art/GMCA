const DonationService = require("../services/donationService");

class DonationController {

    /**
     * ==========================================
     * Initialize Donation
     * ==========================================
     */
    static async initialize(req, res) {

        try {

            const payment =
                await DonationService.initializeDonation(
                    req.body
                );

            return res.status(200).json({

                success: true,

                message:
                    "Donation initialized successfully.",

                data: payment

            });

        }

        catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    /**
     * ==========================================
     * Flutterwave Redirect Verification
     * ==========================================
     */
    static async verify(req, res) {

        try {

            const transactionId =
                req.query.transaction_id;

            if (!transactionId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Transaction ID is required."

                });

            }

            await DonationService.verifyDonation(
                transactionId
            );

            // Redirect donor back to the website
            return res.redirect(
                `${process.env.APP_URL}/contact.html?donation=success`
            );

        }

        catch (error) {

            console.error(error);

            return res.redirect(
                `${process.env.APP_URL}/contact.html?donation=failed`
            );

        }

    }

    /**
     * ==========================================
     * Flutterwave Webhook
     * ==========================================
     */
    static async webhook(req, res) {

        try {

            const signature =
                req.headers["verif-hash"];

            if (
                !signature ||
                signature !== process.env.FLW_WEBHOOK_SECRET
            ) {

                return res.status(401).json({

                    success: false,

                    message: "Invalid webhook signature."

                });

            }

            await DonationService.processWebhook(
                req.body
            );

            return res.status(200).json({

                success: true

            });

        }

        catch (error) {

            console.error(error);

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = DonationController;