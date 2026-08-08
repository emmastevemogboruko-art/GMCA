const EventModel = require("../models/eventModel");

class EventService {

    /**
     * ==========================================
     * Get All Events
     * ==========================================
     */
    static async getAll() {

        return await EventModel.getAll();

    }

    /**
     * ==========================================
     * Get Event By ID
     * ==========================================
     */
    static async getById(id) {

        const event = await EventModel.getById(id);

        if (!event) {
            throw new Error("Event not found.");
        }

        return event;

    }

    /**
     * ==========================================
     * Create Event
     * ==========================================
     */
    static async create(eventData) {

        // Basic validation
        if (!eventData.title) {
            throw new Error("Event title is required.");
        }

        if (!eventData.start_date) {
            throw new Error("Start date is required.");
        }

        if (!eventData.end_date) {
            throw new Error("End date is required.");
        }

        if (new Date(eventData.end_date) < new Date(eventData.start_date)) {
            throw new Error("End date cannot be earlier than the start date.");
        }

        return await EventModel.create(eventData);

    }

    /**
     * ==========================================
     * Update Event
     * ==========================================
     */
    static async update(id, eventData) {

        const existingEvent = await EventModel.getById(id);

        if (!existingEvent) {
            throw new Error("Event not found.");
        }

        if (
            eventData.start_date &&
            eventData.end_date &&
            new Date(eventData.end_date) < new Date(eventData.start_date)
        ) {
            throw new Error("End date cannot be earlier than the start date.");
        }

        return await EventModel.update(id, eventData);

    }

    /**
     * ==========================================
     * Delete Event
     * ==========================================
     */
    static async delete(id) {

        const existingEvent = await EventModel.getById(id);

        if (!existingEvent) {
            throw new Error("Event not found.");
        }

        return await EventModel.delete(id);

    }

}

module.exports = EventService;