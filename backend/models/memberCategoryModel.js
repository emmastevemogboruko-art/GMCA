const pool = require("../config/db");

class MemberCategoryModel {

    /**
     * ==========================================
     * Get All Categories
     * ==========================================
     */
    static async getAll() {

        const result = await pool.query(`

            SELECT

                id,

                name

            FROM member_categories

            ORDER BY name;

        `);

        return result.rows;

    }

}

module.exports = MemberCategoryModel;