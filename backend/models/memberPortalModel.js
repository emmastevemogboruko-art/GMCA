const pool = require("../config/db");

class MemberPortalModel {

    /**
     * ==========================================
     * Get Logged-in Member Profile
     * ==========================================
     */
    static async getProfile(memberId) {

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

            WHERE m.id = $1
            LIMIT 1;
        `, [memberId]);

        return result.rows[0];

    }

}

module.exports = MemberPortalModel;