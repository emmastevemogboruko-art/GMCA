const EventRegistrationService = require("../services/eventRegistrationService");

class EventRegistrationController {

    /**
     * ==========================================
     * Register Member for Event
     * ==========================================
     */
    static async register(req, res) {

        try {

            const registration =
                await EventRegistrationService.register(
                    req.params.eventId,
                    req.body
                );

            return res.status(201).json({
                success: true,
                message: "Member registered successfully.",
                data: registration
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
     * Get Event Members
     * ==========================================
     */
    static async getMembers(req, res) {

        try {

            const members =
                await EventRegistrationService.getMembers(
                    req.params.eventId
                );

            return res.status(200).json({
                success: true,
                data: members
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
     * Update Attendance
     * ==========================================
     */
    static async updateAttendance(req, res) {

        try {

            const registration =
                await EventRegistrationService.updateAttendance(
                    req.params.eventId,
                    req.params.memberId,
                    req.body.attendance_status
                );

            return res.status(200).json({
                success: true,
                message: "Attendance updated successfully.",
                data: registration
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
     * Remove Registration
     * ==========================================
     */
    static async remove(req, res) {

        try {

            await EventRegistrationService.remove(
                req.params.eventId,
                req.params.memberId
            );

            return res.status(200).json({
                success: true,
                message: "Member removed from event successfully."
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

}

module.exports = EventRegistrationController;