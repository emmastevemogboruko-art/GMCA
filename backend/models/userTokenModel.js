const pool = require("../config/db");

class UserTokenModel {

    /**
     * ==========================================
     * Create Token
     * ==========================================
     */
    static async create({
        user_id,
        token,
        token_type,
        expires_at
    }) {

        const result = await pool.query(
            `
            INSERT INTO user_tokens (
                user_id,
                token,
                token_type,
                expires_at
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *;
            `,
            [
                user_id,
                token,
                token_type,
                expires_at
            ]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Find Valid Token
     * ==========================================
     */
    static async findValidToken(token) {

        const result = await pool.query(
            `
            SELECT *
            FROM user_tokens
            WHERE token = $1
              AND used_at IS NULL
              AND expires_at > CURRENT_TIMESTAMP
            LIMIT 1;
            `,
            [token]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Mark Token As Used
     * ==========================================
     */
    static async markAsUsed(token) {

        const result = await pool.query(
            `
            UPDATE user_tokens
            SET
                used_at = CURRENT_TIMESTAMP
            WHERE token = $1
            RETURNING *;
            `,
            [token]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Get Active Tokens By User
     * ==========================================
     */
    static async getActiveTokens(userId, tokenType) {

        const result = await pool.query(
            `
            SELECT *
            FROM user_tokens
            WHERE user_id = $1
              AND token_type = $2
              AND used_at IS NULL
              AND expires_at > CURRENT_TIMESTAMP
            ORDER BY created_at DESC;
            `,
            [
                userId,
                tokenType
            ]
        );

        return result.rows;

    }

    /**
     * ==========================================
     * Expire Previous Tokens
     * ==========================================
     */
    static async expireUserTokens(userId, tokenType) {

        await pool.query(
            `
            UPDATE user_tokens
            SET
                used_at = CURRENT_TIMESTAMP
            WHERE user_id = $1
              AND token_type = $2
              AND used_at IS NULL;
            `,
            [
                userId,
                tokenType
            ]
        );

    }

    /**
     * ==========================================
     * Delete Expired Tokens
     * ==========================================
     */
    static async deleteExpiredTokens() {

        const result = await pool.query(
            `
            DELETE FROM user_tokens
            WHERE expires_at < CURRENT_TIMESTAMP
            RETURNING id;
            `
        );

        return result.rowCount;

    }

}

module.exports = UserTokenModel;