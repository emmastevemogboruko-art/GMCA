const MemberPortalModel = require("../models/memberPortalModel");
const PublicEventService = require("./publicEventService");
const EventRegistrationModel = require("../models/eventRegistrationModel");

class MemberPortalService {

    /**
     * ==========================================
     * Get Logged-in Member Profile
     * ==========================================
     */
    static async getProfile(memberId) {

        if (!memberId) {

            throw new Error(
                "Member account not found."
            );

        }

        const profile =
            await MemberPortalModel.getProfile(
                memberId
            );

        if (!profile) {

            throw new Error(
                "Member profile not found."
            );

        }

        return profile;

    }

    /**
     * ==========================================
     * Get Available Events
     * ==========================================
     */
    static async getEvents() {

        return await PublicEventService.getUpcomingEvents();

    }

    /**
     * ==========================================
     * Get Event By ID
     * ==========================================
     */
    static async getEvents(memberId) {

        const events =
            await PublicEventService.getUpcomingEvents();

        const registrations =
            await EventRegistrationModel.getMemberRegistrations(
                memberId
            );

        const registeredEvents = new Set(
            registrations.map(r => r.event_id)
        );

        return events.map(event => ({

            ...event,

            registered:
                registeredEvents.has(event.id)

        }));

    }
}

module.exports = MemberPortalService;