const PublicEventService = require("../services/publicEventService");

class PublicEventController {

    /**
     * ==========================================
     * Get Upcoming Events
     * ==========================================
     */
    static async getUpcomingEvents(req, res) {

        try {

            const events =
                await PublicEventService.getUpcomingEvents();

            return res.status(200).json({

                success: true,

                data: events

            });

        }

        catch (error) {

            console.error(
                "Get Upcoming Events Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    /**
     * ==========================================
     * Get Featured Events
     * ==========================================
     */
    static async getFeaturedEvents(req, res) {

        try {

            const events =
                await PublicEventService.getFeaturedEvents();

            return res.status(200).json({

                success: true,

                data: events

            });

        }

        catch (error) {

            console.error(
                "Get Featured Events Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

    /**
     * ==========================================
     * Get Event By ID
     * ==========================================
     */
    static async getEventById(req, res) {

        try {

            const event =
                await PublicEventService.getEventById(
                    req.params.id
                );

            return res.status(200).json({

                success: true,

                data: event

            });

        }

        catch (error) {

            const status =

                error.message === "Event not found."

                    ? 404

                    : 500;

            return res.status(status).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = PublicEventController;