const EventRegistrationModel = require("../models/eventRegistrationModel");

class EventRegistrationService {

    /**
     * ==========================================
     * Register Member for Event (Admin)
     * ==========================================
     */
    static async register(eventId, registrationData) {

        // ======================================
        // Check Event
        // ======================================

        const event =
            await EventRegistrationModel.getEvent(eventId);

        if (!event) {

            throw new Error(
                "Event not found."
            );

        }

        // ======================================
        // Event Status Validation
        // ======================================

        if (event.status !== "Published") {

            throw new Error(
                "Registration is not available for this event."
            );

        }

        const today = new Date();

        // ======================================
        // Registration Opening
        // ======================================

        if (event.registration_open) {

            const openDate =
                new Date(event.registration_open);

            if (today < openDate) {

                throw new Error(
                    "Registration has not opened yet."
                );

            }

        }

        // ======================================
        // Registration Closing
        // ======================================

        if (event.registration_close) {

            const closeDate =
                new Date(event.registration_close);

            closeDate.setHours(
                23,
                59,
                59,
                999
            );

            if (today > closeDate) {

                throw new Error(
                    "Registration for this event has closed."
                );

            }

        }

        // ======================================
        // Capacity Validation
        // ======================================

        if (

            event.max_participants &&

            Number(event.max_participants) > 0

        ) {

            const registrations =
                await EventRegistrationModel.countRegistrations(
                    eventId
                );

            if (

                registrations >=
                event.max_participants

            ) {

                throw new Error(
                    "This event has reached maximum capacity."
                );

            }

        }

        // ======================================
        // Check Member
        // ======================================

        const member =
            await EventRegistrationModel.memberExists(
                registrationData.member_id
            );

        if (!member) {

            throw new Error(
                "Member not found."
            );

        }

        // ======================================
        // Check Event Role
        // ======================================

        const role =
            await EventRegistrationModel.roleExists(
                registrationData.role_id
            );

        if (!role) {

            throw new Error(
                "Invalid or inactive event role."
            );

        }

        // ======================================
        // Prevent Duplicate Registration
        // ======================================

        const exists =
            await EventRegistrationModel.alreadyRegistered(

                eventId,

                registrationData.member_id

            );

        if (exists) {

            throw new Error(
                "Member is already registered for this event."
            );

        }

        // ======================================
        // Register Member
        // ======================================

        return await EventRegistrationModel.register({

            event_id: eventId,

            ...registrationData

        });

    }

    /**
     * ==========================================
     * Register Logged-in Member
     * ==========================================
     */
    static async registerMember(
        eventId,
        memberId
    ) {

        const participantRole =
            await EventRegistrationModel.getParticipantRole();

        if (!participantRole) {

            throw new Error(
                "Participant role is not configured."
            );

        }

        return await this.register(

            eventId,

            {

                member_id: memberId,

                role_id: participantRole.id,

                registration_status: "Registered",

                attendance_status: "Pending",

                assigned_by: null,

                remarks: null

            }

        );

    }

    /**
     * ==========================================
     * Get Event Members
     * ==========================================
     */
    static async getMembers(eventId) {

        const event =
            await EventRegistrationModel.eventExists(
                eventId
            );

        if (!event) {

            throw new Error(
                "Event not found."
            );

        }

        return await EventRegistrationModel.getEventMembers(
            eventId
        );

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

        const updated =
            await EventRegistrationModel.updateAttendance(

                eventId,

                memberId,

                attendanceStatus

            );

        if (!updated) {

            throw new Error(
                "Registration not found."
            );

        }

        return updated;

    }

    /**
     * ==========================================
     * Remove Registration
     * ==========================================
     */
    static async remove(
        eventId,
        memberId
    ) {

        const deleted =
            await EventRegistrationModel.remove(

                eventId,

                memberId

            );

        if (!deleted) {

            throw new Error(
                "Registration not found."
            );

        }

        return deleted;

    }

}

module.exports = EventRegistrationService;