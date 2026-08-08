const EventModel = require("../models/eventModel");

class PublicEventService {

    /**
     * ==========================================
     * Get Upcoming Events
     * ==========================================
     */
    static async getUpcomingEvents() {

        return await EventModel.getUpcoming();

    }

    /**
     * ==========================================
     * Get Featured Events
     * ==========================================
     */
    static async getFeaturedEvents() {

        return await EventModel.getFeatured();

    }

    /**
     * ==========================================
     * Get Published Event By ID
     * ==========================================
     */
    static async getEventById(id) {

        const event =
            await EventModel.getPublishedById(id);

        if (!event) {

            throw new Error(
                "Event not found."
            );

        }

        return event;

    }

}

module.exports = PublicEventService;