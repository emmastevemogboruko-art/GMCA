const pool = require("../config/db");

class MemberModel {

    /**
     * ==========================================
     * Get All Members
     * ==========================================
     */
    static async getAll() {

        const result = await pool.query(`
            SELECT
                m.id,
                m.membership_number,
                m.joined_date,
                m.approved_at,

                mc.name AS category,
                ms.name AS status,

                a.first_name,
                a.middle_name,
                a.last_name,
                a.email,
                a.phone,
                a.country,
                a.ministry_name

            FROM members m

            INNER JOIN applications a
                ON m.application_id = a.id

            INNER JOIN member_categories mc
                ON m.category_id = mc.id

            INNER JOIN member_statuses ms
                ON m.status_id = ms.id

            ORDER BY m.created_at DESC;
        `);

        return result.rows;
    }

    /**
     * ==========================================
     * Get Member By ID
     * ==========================================
     */
    static async getById(id) {

        const result = await pool.query(`
            SELECT
                m.*,
                mc.name AS category,
                ms.name AS status,

                a.first_name,
                a.middle_name,
                a.last_name,
                a.email,
                a.phone,
                a.country,
                a.state_province,
                a.city,
                a.church_name,
                a.ministry_name,
                a.denomination,
                a.occupation

            FROM members m

            INNER JOIN applications a
                ON m.application_id = a.id

            INNER JOIN member_categories mc
                ON m.category_id = mc.id

            INNER JOIN member_statuses ms
                ON m.status_id = ms.id

            WHERE m.id = $1;
        `, [id]);

        return result.rows[0] || null;
    }

    /**
     * ==========================================
     * Find Member By Application
     * ==========================================
     */
    static async findByApplication(applicationId) {

        const result = await pool.query(
            `SELECT * FROM members WHERE application_id = $1`,
            [applicationId]
        );

        return result.rows[0] || null;
    }

    /**
     * ==========================================
     * Get Member Status By Name
     * ==========================================
     */
    static async getStatusByName(name) {

        const result = await pool.query(`
            SELECT
                id,
                name
            FROM member_statuses
            WHERE name = $1
            LIMIT 1;
        `, [name]);

        return result.rows[0] || null;
    }

    /**
     * ==========================================
     * Create Member
     * ==========================================
     */
    static async create(memberData) {

        const result = await pool.query(`
            INSERT INTO members
            (
                application_id,
                category_id,
                status_id,
                joined_date,
                approved_by,
                approval_notes
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [
            memberData.application_id,
            memberData.category_id,
            memberData.status_id,
            memberData.joined_date,
            memberData.approved_by,
            memberData.approval_notes
        ]);

        return result.rows[0];
    }

    /**
     * ==========================================
     * Update Membership Number
     * ==========================================
     */
    static async updateMembershipNumber(id, membershipNumber) {

        const result = await pool.query(`
            UPDATE members
            SET
                membership_number = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *;
        `, [membershipNumber, id]);

        return result.rows[0];
    }

}

module.exports = MemberModel;