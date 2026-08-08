const EventService = require("../services/eventService");

class EventController {

    /**
     * ==========================================
     * Get All Events
     * ==========================================
     */
    static async getAll(req, res) {

        try {

            const events = await EventService.getAll();

            return res.status(200).json({
                success: true,
                data: events
            });

        } catch (error) {

            console.error("Get Events Error:", error);

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
    static async getById(req, res) {

        try {

            const event = await EventService.getById(req.params.id);

            return res.status(200).json({
                success: true,
                data: event
            });

        } catch (error) {

            return res.status(404).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * ==========================================
     * Create Event
     * ==========================================
     */
    static async create(req, res) {

        try {

            const event = await EventService.create(req.body);

            return res.status(201).json({
                success: true,
                message: "Event created successfully.",
                data: event
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * ==========================================
     * Update Event
     * ==========================================
     */
    static async update(req, res) {

        try {

            const event = await EventService.update(
                req.params.id,
                req.body
            );

            return res.status(200).json({
                success: true,
                message: "Event updated successfully.",
                data: event
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * ==========================================
     * Delete Event
     * ==========================================
     */
    static async delete(req, res) {

        try {

            await EventService.delete(req.params.id);

            return res.status(200).json({
                success: true,
                message: "Event deleted successfully."
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

}

module.exports = EventController;