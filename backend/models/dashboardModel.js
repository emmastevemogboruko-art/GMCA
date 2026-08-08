const pool = require("../config/db");

class DashboardModel {

    /**
     * ==========================================
     * Get Dashboard Statistics
     * ==========================================
     */
    static async getStatistics() {

        const [
            totalApplications,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            totalMembers,
            activeMembers,
            inactiveMembers,
            totalMentors,
            totalMentees,
            activeAnnouncements
        ] = await Promise.all([

            pool.query(`
                SELECT COUNT(*) AS total
                FROM applications
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM applications
                WHERE application_status = 'Pending'
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM applications
                WHERE application_status = 'Approved'
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM applications
                WHERE application_status = 'Rejected'
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM members
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM members m
                JOIN member_statuses s
                    ON s.id = m.status_id
                WHERE s.name = 'Active'
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM members m
                JOIN member_statuses s
                    ON s.id = m.status_id
                WHERE s.name = 'Inactive'
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM members m
                JOIN member_categories c
                    ON c.id = m.category_id
                WHERE c.name = 'Mentor'
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM members m
                JOIN member_categories c
                    ON c.id = m.category_id
                WHERE c.name = 'Mentee'
            `),

            pool.query(`
                SELECT COUNT(*) AS total
                FROM announcements
                WHERE status = 'Published'
            `)

        ]);

        const recentApplications = await pool.query(`
            SELECT
                id,
                application_number,
                first_name,
                middle_name,
                last_name,
                country,
                application_status,
                submitted_at
            FROM applications
            ORDER BY submitted_at DESC
            LIMIT 5
        `);

        return {

            applications: {
                total: Number(totalApplications.rows[0].total),
                pending: Number(pendingApplications.rows[0].total),
                approved: Number(approvedApplications.rows[0].total),
                rejected: Number(rejectedApplications.rows[0].total)
            },

            members: {
                total: Number(totalMembers.rows[0].total),
                active: Number(activeMembers.rows[0].total),
                inactive: Number(inactiveMembers.rows[0].total)
            },

            mentorship: {
                mentors: Number(totalMentors.rows[0].total),
                mentees: Number(totalMentees.rows[0].total)
            },

            announcements: {
                active: Number(activeAnnouncements.rows[0].total)
            },

            recentApplications: recentApplications.rows

        };

    }

}

module.exports = DashboardModel;