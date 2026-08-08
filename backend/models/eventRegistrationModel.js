const pool = require("../config/db");

class EventRegistrationModel {

    /**
     * ==========================================
     * Check Event Exists
     * ==========================================
     */
    static async eventExists(eventId) {

        const result = await pool.query(
            `
            SELECT id
            FROM events
            WHERE id = $1
            `,
            [eventId]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Get Event Details
     * ==========================================
     */
    static async getEvent(eventId) {

        const result = await pool.query(
            `
            SELECT
                id,
                title,
                status,
                registration_open,
                registration_close,
                max_participants
            FROM events
            WHERE id = $1
            LIMIT 1;
            `,
            [eventId]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Count Registered Members
     * ==========================================
     */
    static async countRegistrations(eventId) {

        const result = await pool.query(
            `
            SELECT COUNT(*)::INTEGER AS total
            FROM event_members
            WHERE event_id = $1
              AND registration_status = 'Registered';
            `,
            [eventId]
        );

        return result.rows[0].total;

    }

    /**
     * ==========================================
     * Check Member Exists
     * ==========================================
     */
    static async memberExists(memberId) {

        const result = await pool.query(
            `
            SELECT id
            FROM members
            WHERE id = $1
            `,
            [memberId]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Check Event Role Exists
     * ==========================================
     */
    static async roleExists(roleId) {

        const result = await pool.query(
            `
            SELECT id
            FROM event_roles
            WHERE id = $1
              AND is_active = TRUE
            `,
            [roleId]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Get Participant Role
     * ==========================================
     */
    static async getParticipantRole() {

        const result = await pool.query(
            `
            SELECT id
            FROM event_roles
            WHERE name = 'Participant'
              AND is_active = TRUE
            LIMIT 1;
            `
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Check Duplicate Registration
     * ==========================================
     */
    static async alreadyRegistered(eventId, memberId) {

        const result = await pool.query(
            `
            SELECT id
            FROM event_members
            WHERE event_id = $1
              AND member_id = $2;
            `,
            [
                eventId,
                memberId
            ]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Register Member
     * ==========================================
     */
    static async register(data) {

        const result = await pool.query(
            `
            INSERT INTO event_members (
                event_id,
                member_id,
                role_id,
                registration_status,
                attendance_status,
                assigned_by,
                assigned_at,
                remarks
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                NOW(),
                $7
            )
            RETURNING *;
            `,
            [
                data.event_id,
                data.member_id,
                data.role_id,
                data.registration_status,
                data.attendance_status,
                data.assigned_by,
                data.remarks
            ]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Get Event Members
     * ==========================================
     */
    static async getEventMembers(eventId) {

        const result = await pool.query(
            `
            SELECT
                em.id,
                em.event_id,
                em.member_id,

                m.membership_number,

                a.first_name,
                a.middle_name,
                a.last_name,
                a.email,
                a.phone,
                a.country,
                a.ministry_name,

                er.name AS role,

                em.registration_status,
                em.attendance_status,
                em.assigned_by,
                em.assigned_at,
                em.remarks,
                em.created_at,
                em.updated_at

            FROM event_members em

            INNER JOIN members m
                ON em.member_id = m.id

            INNER JOIN applications a
                ON m.application_id = a.id

            INNER JOIN event_roles er
                ON em.role_id = er.id

            WHERE em.event_id = $1

            ORDER BY
                a.first_name,
                a.last_name;
            `,
            [eventId]
        );

        return result.rows;

    }

    /**
     * ==========================================
     * Update Attendance
     * ==========================================
     */
    static async updateAttendance(
        eventId,
        memberId,
        attendanceStatus
    ) {

        const result = await pool.query(
            `
            UPDATE event_members
            SET
                attendance_status = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE event_id = $2
              AND member_id = $3
            RETURNING *;
            `,
            [
                attendanceStatus,
                eventId,
                memberId
            ]
        );

        return result.rows[0];

    }

    /**
     * ==========================================
     * Remove Registration
     * ==========================================
     */
    static async remove(eventId, memberId) {

        const result = await pool.query(
            `
            DELETE FROM event_members
            WHERE event_id = $1
              AND member_id = $2
            RETURNING *;
            `,
            [
                eventId,
                memberId
            ]
        );

        return result.rows[0];

    }



    /**
     * ==========================================
     * Get Member Event Registrations
     * ==========================================
     */
    static async getMemberRegistrations(memberId) {

        const result = await pool.query(
        `
            SELECT event_id
            FROM event_members
            WHERE member_id = $1
                AND registration_status = 'Registered';
            `,
            [memberId]
        );

    return result.rows;

    }
}
module.exports = EventRegistrationModel;