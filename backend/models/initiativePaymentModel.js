const pool = require("../config/db");

class InitiativePaymentModel {

    /**
     * ==========================================
     * Create Initiative Payment
     * ==========================================
     */
    static async create(data) {

        const result = await pool.query(
            `
            INSERT INTO initiative_payments (

                member_id,
                transaction_reference,
                purpose,
                amount,
                currency,
                payment_status

            )
            VALUES (

                $1,
                $2,
                $3,
                $4,
                $5,
                $6

            )
            RETURNING *;
            `,
            [
                data.member_id,
                data.transaction_reference,
                data.purpose,
                data.amount,
                data.currency,
                data.payment_status
            ]
        );

        return result.rows[0];

    }


    /**
     * ==========================================
     * Find Payment By Reference
     * ==========================================
     */
    static async getByReference(reference) {

        const result = await pool.query(
            `
            SELECT *
            FROM initiative_payments
            WHERE transaction_reference = $1
            LIMIT 1;
            `,
            [reference]
        );

        return result.rows[0];

    }


    /**
     * ==========================================
     * Find Payment By Flutterwave ID
     * ==========================================
     */
    static async getByFlutterwaveId(
        transactionId
    ) {

        const result = await pool.query(
            `
            SELECT *
            FROM initiative_payments
            WHERE flutterwave_transaction_id = $1
            LIMIT 1;
            `,
            [transactionId]
        );

        return result.rows[0];

    }


    /**
     * ==========================================
     * Check Successful Payment
     * ==========================================
     */
    static async isSuccessful(reference) {

        const result = await pool.query(
            `
            SELECT payment_status
            FROM initiative_payments
            WHERE transaction_reference = $1
            LIMIT 1;
            `,
            [reference]
        );

        if (!result.rows.length) {

            return false;

        }

        return (
            result.rows[0].payment_status ===
            "Successful"
        );

    }


    /**
     * ==========================================
     * Mark Payment Successful
     * ==========================================
     */
    static async markSuccessful(
        reference,
        paymentData
    ) {

        const result = await pool.query(
            `
            UPDATE initiative_payments
            SET

                flutterwave_transaction_id = $1,
                payment_method = $2,
                payment_status = 'Successful',
                updated_at = CURRENT_TIMESTAMP

            WHERE transaction_reference = $3

            RETURNING *;
            `,
            [
                paymentData.flutterwave_transaction_id,
                paymentData.payment_method,
                reference
            ]
        );

        return result.rows[0];

    }


    /**
     * ==========================================
     * Mark Payment Failed
     * ==========================================
     */
    static async markFailed(reference) {

        const result = await pool.query(
            `
            UPDATE initiative_payments
            SET

                payment_status = 'Failed',
                updated_at = CURRENT_TIMESTAMP

            WHERE transaction_reference = $1

            RETURNING *;
            `,
            [reference]
        );

        return result.rows[0];

    }


    /**
     * ==========================================
     * Get Member Payment
     *
     * Used to determine whether a member has
     * already successfully paid for an initiative.
     * ==========================================
     */
    static async getSuccessfulByMemberAndPurpose(
        memberId,
        purpose
    ) {

        const result = await pool.query(
            `
            SELECT *
            FROM initiative_payments
            WHERE member_id = $1
              AND purpose = $2
              AND payment_status = 'Successful'
            ORDER BY created_at DESC
            LIMIT 1;
            `,
            [
                memberId,
                purpose
            ]
        );

        return result.rows[0];

    }


    /**
     * ==========================================
     * Get Member Payment History
     * ==========================================
     */
    static async getByMember(memberId) {

        const result = await pool.query(
            `
            SELECT
                id,
                member_id,
                transaction_reference,
                purpose,
                amount,
                currency,
                payment_method,
                payment_status,
                flutterwave_transaction_id,
                created_at,
                updated_at
            FROM initiative_payments
            WHERE member_id = $1
            ORDER BY created_at DESC;
            `,
            [memberId]
        );

        return result.rows;

    }

    /**
     * ==========================================
     * Get Member Customer Information
     *
     * Used for Flutterwave customer details.
     * ==========================================
     */
    static async getMemberCustomer(memberId) {

        const result = await pool.query(
            `
            SELECT
                m.id AS member_id,
                a.first_name,
                a.middle_name,
                a.last_name,
                a.email,
                a.phone
            FROM members m

            INNER JOIN applications a
                ON m.application_id = a.id

            WHERE m.id = $1

            LIMIT 1;
            `,
            [memberId]
        );

        return result.rows[0];

    }

}


module.exports = InitiativePaymentModel;