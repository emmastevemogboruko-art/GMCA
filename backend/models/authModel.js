const pool = require("../config/db");

class AuthModel {

    /**
     * ==========================================
     * Find User by Username or Email
     * ==========================================
     */
    static async findByUsernameOrEmail(identifier) {

        const result = await pool.query(
            `
            SELECT
                id,
                member_id,
                username,
                email,
                password_hash,
                is_active,
                last_login
            FROM users
            WHERE username = $1
               OR email = $1
            LIMIT 1;
            `,
            [identifier]
        );

        return result.rows[0];
    }

    /**
     * ==========================================
     * Get User Roles
     * ==========================================
     */
    static async getUserRoles(userId) {

        const result = await pool.query(
            `
            SELECT
                r.id,
                r.name
            FROM user_roles ur
            INNER JOIN roles r
                ON ur.role_id = r.id
            WHERE ur.user_id = $1
              AND r.is_active = TRUE
            ORDER BY r.id;
            `,
            [userId]
        );

        return result.rows;
    }

    /**
     * ==========================================
     * Update Last Login
     * ==========================================
     */
    static async updateLastLogin(userId) {

        await pool.query(
            `
            UPDATE users
            SET
                last_login = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1;
            `,
            [userId]
        );

    }

    /**
     * ==========================================
     * Find User by ID
     * ==========================================
     */
    static async findById(userId) {

        const result = await pool.query(
            `
            SELECT
                id,
                member_id,
                username,
                email,
                is_active,
                last_login
            FROM users
            WHERE id = $1
            LIMIT 1;
            `,
            [userId]
        );

        return result.rows[0];
    }

}

module.exports = AuthModel;