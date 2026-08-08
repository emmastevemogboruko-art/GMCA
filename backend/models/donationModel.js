const pool = require("../config/db");

class DonationModel {

    /**
     * ==========================================
     * Create Donation
     * ==========================================
     */
    static async create(data) {

        const result = await pool.query(
            `
            INSERT INTO donations (

                transaction_reference,
                amount,
                currency,
                payment_status,
                donor_name,
                donor_email

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
                data.transaction_reference,
                data.amount,
                data.currency,
                data.payment_status,
                data.donor_name,
                data.donor_email
            ]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Find By Reference
     * ==========================================
     */
    static async getByReference(reference) {

        const result = await pool.query(
            `
            SELECT *
            FROM donations
            WHERE transaction_reference = $1
            LIMIT 1;
            `,
            [reference]
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
            FROM donations
            WHERE transaction_reference = $1
            LIMIT 1;
            `,
            [reference]
        );

        if (!result.rows.length) {
            return false;
        }

        return result.rows[0].payment_status === "Successful";

    }

    /**
     * ==========================================
     * Update Successful Payment
     * ==========================================
     */
    static async markSuccessful(reference, paymentData) {

        const result = await pool.query(
            `
            UPDATE donations
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
     * Update Failed Payment
     * ==========================================
     */
    static async markFailed(reference) {

        const result = await pool.query(
            `
            UPDATE donations
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

}

module.exports = DonationModel;