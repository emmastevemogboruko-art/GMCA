const pool = require("../config/db");

class EventModel {

    /**
     * ==========================================
     * Event Statistics SQL
     * ==========================================
     */
    static statisticsSelect() {

        return `

            COUNT(em.id)::INTEGER AS registered_count,

            COUNT(
                CASE
                    WHEN em.attendance_status = 'Checked In'
                    THEN 1
                END
            )::INTEGER AS checked_in_count,

            CASE

                WHEN e.max_participants IS NULL
                    OR e.max_participants = 0

                THEN NULL

                ELSE

                    GREATEST(
                        e.max_participants - COUNT(em.id),
                        0
                    )::INTEGER

            END AS remaining_capacity

        `;

    }

    /**
     * ==========================================
     * Build Registration Status
     * ==========================================
     */
    static buildRegistrationStatus(event) {

        if (!event) {

            return null;

        }

        const today = new Date();

        const registrationOpened =

            !event.registration_open ||

            new Date(event.registration_open) <= today;

        const registrationClosed =

            event.registration_close &&

            new Date(event.registration_close) < today;

        const isFull =

            event.max_participants &&

            Number(event.max_participants) > 0 &&

            Number(event.remaining_capacity) <= 0;

        let canRegister = true;

        let registrationMessage =
            "Registration Open";

        if (event.status !== "Published") {

            canRegister = false;

            registrationMessage =
                "Registration Unavailable";

        }

        else if (!registrationOpened) {

            canRegister = false;

            registrationMessage =
                "Registration Opens Soon";

        }

        else if (registrationClosed) {

            canRegister = false;

            registrationMessage =
                "Registration Closed";

        }

        else if (isFull) {

            canRegister = false;

            registrationMessage =
                "Event Full";

        }

        return {

            ...event,

            registration_opened:
                registrationOpened,

            registration_closed:
                registrationClosed,

            is_full:
                isFull,

            can_register:
                canRegister,

            registration_message:
                registrationMessage

        };

    }

    /**
     * ==========================================
     * Get All Events
     * ==========================================
     */
    static async getAll() {

        const result = await pool.query(`

            SELECT

                e.*,

                ${this.statisticsSelect()}

            FROM events e

            LEFT JOIN event_members em
                ON e.id = em.event_id

            GROUP BY
                e.id

            ORDER BY
                e.start_date DESC,
                e.start_time DESC;

        `);

        return result.rows.map(

            event =>

                this.buildRegistrationStatus(
                    event
                )

        );

    }

    /**
     * ==========================================
     * Get Event By ID
     * ==========================================
     */
    static async getById(id) {

        const result = await pool.query(`

            SELECT

                e.*,

                ${this.statisticsSelect()}

            FROM events e

            LEFT JOIN event_members em
                ON e.id = em.event_id

            WHERE e.id = $1

            GROUP BY
                e.id

            LIMIT 1;

        `, [id]);

        return this.buildRegistrationStatus(

            result.rows[0]

        );

    }

    /**
     * ==========================================
     * Get Upcoming Events (Public)
     * ==========================================
     */
    static async getUpcoming() {

        const result = await pool.query(`

            SELECT

                e.*,

                ${this.statisticsSelect()}

            FROM events e

            LEFT JOIN event_members em
                ON e.id = em.event_id

            WHERE
                e.status = 'Published'
                AND e.start_date >= CURRENT_DATE

            GROUP BY
                e.id

            ORDER BY
                e.start_date ASC,
                e.start_time ASC;

        `);

        return result.rows.map(

            event =>

                this.buildRegistrationStatus(
                    event
                )

        );

    }

    /**
     * ==========================================
     * Get Featured Events (Public)
     * ==========================================
     */
    static async getFeatured(limit = 3) {

        const result = await pool.query(`

            SELECT

                e.*,

                ${this.statisticsSelect()}

            FROM events e

            LEFT JOIN event_members em
                ON e.id = em.event_id

            WHERE
                e.status = 'Published'
                AND e.is_featured = TRUE

            GROUP BY
                e.id

            ORDER BY
                e.start_date ASC,
                e.start_time ASC

            LIMIT $1;

        `, [limit]);

        return result.rows.map(

            event =>

                this.buildRegistrationStatus(
                    event
                )

        );

    }

    /**
     * ==========================================
     * Get Published Event By ID (Public)
     * ==========================================
     */
    static async getPublishedById(id) {

        const result = await pool.query(`

            SELECT

                e.*,

                ${this.statisticsSelect()}

            FROM events e

            LEFT JOIN event_members em
                ON e.id = em.event_id

            WHERE
                e.id = $1
                AND e.status = 'Published'

            GROUP BY
                e.id

            LIMIT 1;

        `, [id]);

        return this.buildRegistrationStatus(

            result.rows[0]

        );

    }

    /**
     * ==========================================
     * Create Event
     * ==========================================
     */
    static async create(event) {

        const result = await pool.query(`

            INSERT INTO events (

                title,
                description,
                event_type,
                venue,
                location,
                start_date,
                end_date,
                start_time,
                end_time,
                registration_open,
                registration_close,
                max_participants,
                registration_fee,
                currency,
                payment_required,
                payment_gateway,
                payment_link,
                external_registration_link,
                status,
                is_featured,
                created_by

            )

            VALUES (

                $1,$2,$3,$4,$5,
                $6,$7,$8,$9,
                $10,$11,$12,
                $13,$14,$15,
                $16,$17,$18,
                $19,$20,$21

            )

            RETURNING *;

        `, [

            event.title,
            event.description,
            event.event_type,
            event.venue,
            event.location,
            event.start_date,
            event.end_date,
            event.start_time,
            event.end_time,
            event.registration_open,
            event.registration_close,
            event.max_participants,
            event.registration_fee,
            event.currency,
            event.payment_required,
            event.payment_gateway,
            event.payment_link,
            event.external_registration_link,
            event.status,
            event.is_featured || false,
            event.created_by

        ]);

        return result.rows[0];

    }

    /**
     * ==========================================
     * Update Event
     * ==========================================
     */
    static async update(id, event) {

        const result = await pool.query(`

            UPDATE events

            SET

                title = $1,
                description = $2,
                event_type = $3,
                venue = $4,
                location = $5,
                start_date = $6,
                end_date = $7,
                start_time = $8,
                end_time = $9,
                registration_open = $10,
                registration_close = $11,
                max_participants = $12,
                registration_fee = $13,
                currency = $14,
                payment_required = $15,
                payment_gateway = $16,
                payment_link = $17,
                external_registration_link = $18,
                status = $19,
                is_featured = $20,
                updated_at = CURRENT_TIMESTAMP

            WHERE id = $21

            RETURNING *;

        `, [

            event.title,
            event.description,
            event.event_type,
            event.venue,
            event.location,
            event.start_date,
            event.end_date,
            event.start_time,
            event.end_time,
            event.registration_open,
            event.registration_close,
            event.max_participants,
            event.registration_fee,
            event.currency,
            event.payment_required,
            event.payment_gateway,
            event.payment_link,
            event.external_registration_link,
            event.status,
            event.is_featured || false,
            id

        ]);

        return result.rows[0];

    }

    /**
     * ==========================================
     * Delete Event
     * ==========================================
     */
    static async delete(id) {

        const result = await pool.query(`

            DELETE
            FROM events

            WHERE id = $1

            RETURNING *;

        `, [id]);

        return result.rows[0];

    }

}

module.exports = EventModel;