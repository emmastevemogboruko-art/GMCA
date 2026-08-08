const MemberPortalService = require("../services/memberPortalService");
const EventRegistrationService = require("../services/eventRegistrationService");

class MemberPortalController {

    /**
     * ==========================================
     * Get Logged-in Member Profile
     * ==========================================
     */
    static async getProfile(req, res) {

        try {

            const profile = await MemberPortalService.getProfile(
                req.user.member_id
            );

            return res.status(200).json({
                success: true,
                data: profile
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
     * Get Available Events
     * ==========================================
     */
    static async getEvents(req, res) {

        try {

            const events =
                await MemberPortalService.getEvents(
                    req.user.member_id
                );

            return res.status(200).json({
                success: true,
                data: events
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    /**
     * ==========================================
     * Get Event Details
     * ==========================================
     */
    static async getEventById(req, res) {

        try {

            const event =
                await MemberPortalService.getEventById(
                    req.params.id
                );

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
     * Register Logged-in Member
     * ==========================================
     */
    static async registerForEvent(req, res) {

        try {

            const registration =
                await EventRegistrationService.registerMember(
                    req.params.eventId,
                    req.user.member_id
                );

            return res.status(201).json({
                success: true,
                message: "Successfully registered for the event.",
                data: registration
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

}

module.exports = MemberPortalController;