const pool = require("../config/db");

class ApplicationModel {

    /**
     * ==========================================
     * Create Application
     * ==========================================
     */
    static async create(application) {

        const result = await pool.query(`
            INSERT INTO applications (
                application_number,
                category_id,
                first_name,
                middle_name,
                last_name,
                gender,
                date_of_birth,
                email,
                phone,
                country,
                state_province,
                city,
                postal_address,
                church_name,
                ministry_name,
                denomination,
                occupation,
                testimony,
                reason_for_joining,
                profile_photo_url
            )
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                $11,$12,$13,$14,$15,$16,$17,$18,
                $19,$20
            )
            RETURNING *;
        `, [
            application.application_number,
            application.category_id,
            application.first_name,
            application.middle_name,
            application.last_name,
            application.gender,
            application.date_of_birth,
            application.email,
            application.phone,
            application.country,
            application.state_province,
            application.city,
            application.postal_address,
            application.church_name,
            application.ministry_name,
            application.denomination,
            application.occupation,
            application.testimony,
            application.reason_for_joining,
            application.profile_photo_url
        ]);

        return result.rows[0];
    }

    /**
     * ==========================================
     * Get All Applications
     * ==========================================
     */
    static async getAll() {

        const result = await pool.query(`
            SELECT *
            FROM applications
            ORDER BY submitted_at DESC;
        `);

        return result.rows;
    }

    /**
     * ==========================================
     * Get Application By ID
     * ==========================================
     */
    static async getById(id) {

        const result = await pool.query(`
            SELECT *
            FROM applications
            WHERE id = $1
            LIMIT 1;
        `, [id]);

        return result.rows[0] || null;
    }

    /**
     * ==========================================
     * Update Application Status
     * ==========================================
     */
    static async updateStatus(id, status) {

        const result = await pool.query(`
            UPDATE applications
            SET
                application_status = $1,
                reviewed_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `, [status, id]);

        return result.rows[0] || null;
    }

}

module.exports = ApplicationModel;