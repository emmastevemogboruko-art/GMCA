const { v4: uuidv4 } = require("uuid");

const DonationModel = require("../models/donationModel");
const Flutterwave = require("../utils/flutterwave");

class DonationService {

    /**
     * ==========================================
     * Initialize Donation
     * ==========================================
     */
    static async initializeDonation(data) {

        if (!data.amount) {

            throw new Error(
                "Donation amount is required."
            );

        }

        if (Number(data.amount) <= 0) {

            throw new Error(
                "Donation amount must be greater than zero."
            );

        }

        // Generate Unique Transaction Reference

        const txRef =
            `GMCA-DON-${uuidv4()}`;

        // Save Pending Donation

        await DonationModel.create({

            transaction_reference: txRef,

            amount: data.amount,

            currency: "NGN",

            payment_status: "Pending",

            donor_name:
                data.donor_name || null,

            donor_email:
                data.donor_email || null

        });

        // Initialize Flutterwave

        const payment =
            await Flutterwave.initialize({

                tx_ref: txRef,

                amount: data.amount,

                currency: "NGN",

                redirect_url:
                    process.env.FLW_REDIRECT_URL,

                customer: {

                    name:
                        data.donor_name ||
                        "Anonymous",

                    email:
                        data.donor_email ||
                        "anonymous@gmcafrica.org"

                },

                customizations: {

                    title:
                        "Gospel Music Community Africa",

                    description:
                        "Support GMCA",

                    logo:
                        process.env.GMCA_LOGO_URL

                }

            });

        return payment;

    }

    /**
     * ==========================================
     * Verify Donation
     * ==========================================
     */
    static async verifyDonation(transactionId) {

        const response =
            await Flutterwave.verify(
                transactionId
            );

        if (

            !response ||

            !response.data

        ) {

            throw new Error(
                "Unable to verify payment."
            );

        }

        const payment =
            response.data;

        const donation =
            await DonationModel.getByReference(
                payment.tx_ref
            );

        if (!donation) {

            throw new Error(
                "Donation record not found."
            );

        }

        // Already Processed

        const processed =
            await DonationModel.isSuccessful(
                payment.tx_ref
            );

        if (processed) {

            return donation;

        }

        if (

            payment.status ===
            "successful"

        ) {

            return await DonationModel.markSuccessful(

                payment.tx_ref,

                {

                    flutterwave_transaction_id:
                        payment.id,

                    payment_method:
                        payment.payment_type

                }

            );

        }

        return await DonationModel.markFailed(

            payment.tx_ref

        );

    }

    /**
     * ==========================================
     * Process Flutterwave Webhook
     * ==========================================
     */
    static async processWebhook(payload) {

        if (!payload || !payload.data) {

            return;

        }

        const payment = payload.data;

        // We only process successful charge events

        if (

            payload.event !== "charge.completed" ||

            payment.status !== "successful"

        ) {

            return;

        }

        const donation =
            await DonationModel.getByReference(
                payment.tx_ref
            );

        if (!donation) {

            return;

        }

        // Prevent duplicate webhook processing

        const processed =
            await DonationModel.isSuccessful(
                payment.tx_ref
            );

        if (processed) {

            return donation;

        }

        // Verify transaction with Flutterwave
        // Never trust webhook payload alone.

        const verification =
            await Flutterwave.verify(
                payment.id
            );

        if (

            !verification ||

            !verification.data ||

            verification.data.status !== "successful"

        ) {

            return await DonationModel.markFailed(
                payment.tx_ref
            );

        }

        return await DonationModel.markSuccessful(

            payment.tx_ref,

            {

                flutterwave_transaction_id:
                    verification.data.id,

                payment_method:
                    verification.data.payment_type

            }

        );

    }

}

module.exports = DonationService;