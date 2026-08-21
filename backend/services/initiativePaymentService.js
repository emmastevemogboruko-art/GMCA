const { v4: uuidv4 } = require("uuid");

const InitiativePaymentModel =
    require("../models/initiativePaymentModel");

const Flutterwave =
    require("../utils/flutterwave");


class InitiativePaymentService {

    /**
     * ==========================================
     * Payment Configuration
     * ==========================================
     */

    static PAYMENT_AMOUNT = 1000;

    static CURRENCY = "NGN";

    static PURPOSES = {

        LAFIA_GOSPEL_GIST:
            "LAFIA_GOSPEL_GIST",

        ONE_STAGE_DIFFERENT_TALENT:
            "ONE_STAGE_DIFFERENT_TALENT"

    };


    /**
     * ==========================================
     * Get Purpose Display Name
     * ==========================================
     */
    static getPurposeName(purpose) {

        if (
            purpose ===
            this.PURPOSES.LAFIA_GOSPEL_GIST
        ) {

            return "Lafia Gospel Gist";

        }

        if (
            purpose ===
            this.PURPOSES.ONE_STAGE_DIFFERENT_TALENT
        ) {

            return "One Stage Different Talent";

        }

        return null;

    }


    /**
     * ==========================================
     * Initialize Initiative Payment
     * ==========================================
     */
    static async initializePayment(
        memberId,
        purpose
    ) {

        // ======================================
        // Validate Member
        // ======================================

        if (!memberId) {

            throw new Error(
                "Authenticated member is required."
            );

        }


        // ======================================
        // Validate Purpose
        // ======================================

        const purposeName =
            this.getPurposeName(purpose);

        if (!purposeName) {

            throw new Error(
                "Invalid initiative payment purpose."
            );

        }


        // ======================================
        // Get Member Information
        // ======================================

        const member =
            await InitiativePaymentModel
                .getMemberCustomer(memberId);

        if (!member) {

            throw new Error(
                "Member account could not be found."
            );

        }


        // ======================================
        // Prevent Duplicate Successful Payment
        // ======================================

        const existingPayment =
            await InitiativePaymentModel
                .getSuccessfulByMemberAndPurpose(
                    memberId,
                    purpose
                );

        if (existingPayment) {

            throw new Error(
                `You have already completed payment for ${purposeName}.`
            );

        }


        // ======================================
        // Generate Transaction Reference
        // ======================================

        let prefix = "GMCA-LGG";

        if (
            purpose ===
            this.PURPOSES.ONE_STAGE_DIFFERENT_TALENT
        ) {

            prefix = "GMCA-OST";

        }

        const txRef =
            `${prefix}-${uuidv4()}`;


        // ======================================
        // Create Pending Payment Record
        // ======================================

        await InitiativePaymentModel.create({

            member_id: memberId,

            transaction_reference:
                txRef,

            purpose,

            // IMPORTANT:
            // Amount is controlled by the server.
            amount:
                this.PAYMENT_AMOUNT,

            currency:
                this.CURRENCY,

            payment_status:
                "Pending"

        });


        // ======================================
        // Build Customer Name
        // ======================================

        const customerName = [

            member.first_name,

            member.middle_name,

            member.last_name

        ]

            .filter(Boolean)

            .join(" ");


        // ======================================
        // Initialize Flutterwave
        // ======================================

        const payment =
            await Flutterwave.initialize({

                tx_ref:
                    txRef,

                amount:
                    this.PAYMENT_AMOUNT,

                currency:
                    this.CURRENCY,

                redirect_url:
                    process.env.FLW_INITIATIVE_REDIRECT_URL,

                customer: {

                    name:
                        customerName ||
                        "GMCA Member",

                    email:
                        member.email ||
                        "anonymous@gmcafrica.org",

                    phonenumber:
                        member.phone ||
                        undefined

                },

                customizations: {

                    title:
                        "Gospel Music Community Africa",

                    description:
                        `Payment for ${purposeName}`,

                    logo:
                        process.env.GMCA_LOGO_URL

                }

            });


        // ======================================
        // Return Flutterwave Response
        // ======================================

        return payment;

    }


    /**
     * ==========================================
     * Verify Initiative Payment
     * ==========================================
     */
    static async verifyPayment(
        transactionId
    ) {

        if (!transactionId) {

            throw new Error(
                "Transaction ID is required."
            );

        }


        // ======================================
        // Verify Directly With Flutterwave
        // ======================================

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


        // ======================================
        // Find Our Transaction
        // ======================================

        const initiativePayment =
            await InitiativePaymentModel
                .getByReference(
                    payment.tx_ref
                );


        if (!initiativePayment) {

            throw new Error(
                "Initiative payment record not found."
            );

        }


        // ======================================
        // Prevent Duplicate Processing
        // ======================================

        const processed =
            await InitiativePaymentModel
                .isSuccessful(
                    payment.tx_ref
                );


        if (processed) {

            return initiativePayment;

        }


        // ======================================
        // Validate Payment
        // ======================================

        if (
            payment.status !==
            "successful"
        ) {

            return await InitiativePaymentModel
                .markFailed(
                    payment.tx_ref
                );

        }


        // ======================================
        // Verify Amount
        // ======================================

        if (
            Number(payment.amount) !==
            Number(initiativePayment.amount)
        ) {

            return await InitiativePaymentModel
                .markFailed(
                    payment.tx_ref
                );

        }


        // ======================================
        // Verify Currency
        // ======================================

        if (
            payment.currency !==
            initiativePayment.currency
        ) {

            return await InitiativePaymentModel
                .markFailed(
                    payment.tx_ref
                );

        }


        // ======================================
        // Mark Successful
        // ======================================

        return await InitiativePaymentModel
            .markSuccessful(

                payment.tx_ref,

                {

                    flutterwave_transaction_id:
                        payment.id,

                    payment_method:
                        payment.payment_type

                }

            );

    }


    /**
     * ==========================================
     * Process Flutterwave Webhook
     * ==========================================
     */
    static async processWebhook(
        payload
    ) {

        if (
            !payload ||
            !payload.data
        ) {

            return;

        }


        const payment =
            payload.data;


        // ======================================
        // Only Process Completed Charges
        // ======================================

        if (
            payload.event !==
                "charge.completed" ||

            payment.status !==
                "successful"
        ) {

            return;

        }


        // ======================================
        // Find Payment
        // ======================================

        const initiativePayment =
            await InitiativePaymentModel
                .getByReference(
                    payment.tx_ref
                );


        if (!initiativePayment) {

            return;

        }


        // ======================================
        // Prevent Duplicate Processing
        // ======================================

        const processed =
            await InitiativePaymentModel
                .isSuccessful(
                    payment.tx_ref
                );


        if (processed) {

            return initiativePayment;

        }


        // ======================================
        // Verify With Flutterwave
        // ======================================

        const verification =
            await Flutterwave.verify(
                payment.id
            );


        if (
            !verification ||
            !verification.data ||
            verification.data.status !==
                "successful"
        ) {

            return await InitiativePaymentModel
                .markFailed(
                    payment.tx_ref
                );

        }


        const verifiedPayment =
            verification.data;


        // ======================================
        // Verify Amount
        // ======================================

        if (
            Number(verifiedPayment.amount) !==
            Number(initiativePayment.amount)
        ) {

            return await InitiativePaymentModel
                .markFailed(
                    payment.tx_ref
                );

        }


        // ======================================
        // Verify Currency
        // ======================================

        if (
            verifiedPayment.currency !==
            initiativePayment.currency
        ) {

            return await InitiativePaymentModel
                .markFailed(
                    payment.tx_ref
                );

        }


        // ======================================
        // Mark Successful
        // ======================================

        return await InitiativePaymentModel
            .markSuccessful(

                payment.tx_ref,

                {

                    flutterwave_transaction_id:
                        verifiedPayment.id,

                    payment_method:
                        verifiedPayment.payment_type

                }

            );

    }

}


module.exports =
    InitiativePaymentService;