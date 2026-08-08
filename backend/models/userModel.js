const pool = require("../config/db");

class UserModel {

    /**
     * ==========================================
     * Create User
     * ==========================================
     */
    static async createUser({
        member_id,
        username,
        email,
        password_hash
    }) {

        const result = await pool.query(
            `
            INSERT INTO users (
                member_id,
                username,
                email,
                password_hash
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [
                member_id || null,
                username,
                email,
                password_hash
            ]
        );

        return result.rows[0];
    }

    /**
     * ==========================================
     * Assign Role
     * ==========================================
     */
    static async assignRole(userId, roleId, assignedBy = null) {

        const result = await pool.query(
            `
            INSERT INTO user_roles (
                user_id,
                role_id,
                assigned_by
            )
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, role_id)
            DO NOTHING
            RETURNING *;
            `,
            [
                userId,
                roleId,
                assignedBy
            ]
        );

        return result.rows[0];
    }

    /**
     * ==========================================
     * Get All Users
     * ==========================================
     */
    static async getAllUsers() {

        const result = await pool.query(
            `
            SELECT
                u.id,
                u.member_id,
                u.username,
                u.email,
                u.is_active,
                u.last_login,
                u.created_at,
                STRING_AGG(r.name, ', ') AS roles
            FROM users u
            LEFT JOIN user_roles ur
                ON u.id = ur.user_id
            LEFT JOIN roles r
                ON ur.role_id = r.id
            GROUP BY
                u.id,
                u.member_id,
                u.username,
                u.email,
                u.is_active,
                u.last_login,
                u.created_at
            ORDER BY u.id;
            `
        );

        return result.rows;
    }

    /**
     * ==========================================
     * Get User By ID
     * ==========================================
     */
    static async getUserById(id) {

        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE id = $1
            LIMIT 1;
            `,
            [id]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Get User Password Hash
     * ==========================================
     */
    static async getPasswordHash(userId) {

        const result = await pool.query(
            `
            SELECT
                id,
                password_hash
            FROM users
            WHERE id = $1
            LIMIT 1;
            `,
            [userId]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Get User By Username
     * ==========================================
     */
    static async getUserByUsername(username) {

        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE username = $1
            LIMIT 1;
            `,
            [username]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Get User By Email
     * ==========================================
     */
    static async getUserByEmail(email) {

        const result = await pool.query(
            `
            SELECT *
            FROM users
            WHERE email = $1
            LIMIT 1;
            `,
            [email]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Update Password
     * ==========================================
     */
    static async updatePassword(userId, passwordHash) {

        await pool.query(
            `
            UPDATE users
            SET
                password_hash = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2;
            `,
            [
                passwordHash,
                userId
            ]
        );

    }

    /**
     * ==========================================
     * Activate / Deactivate User
     * ==========================================
     */
    static async updateStatus(userId, isActive) {

        await pool.query(
            `
            UPDATE users
            SET
                is_active = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $2;
            `,
            [
                isActive,
                userId
            ]
        );

    }

    /**
     * ==========================================
     * Count Users
     * ==========================================
     */
    static async countUsers() {

        const result = await pool.query(`
            SELECT COUNT(*)::INTEGER AS total
            FROM users;
        `);

        return result.rows[0].total;

    }

}

module.exports = UserModel;