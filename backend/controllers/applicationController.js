const ApplicationService = require("../services/applicationService");

class ApplicationController {

    /**
     * ==========================================
     * Submit Application
     * ==========================================
     */
    static async submitApplication(req, res) {

        try {

            const application =
                await ApplicationService.createApplication(req.body);

            return res.status(201).json({
                success: true,
                message: "Application submitted successfully.",
                data: application
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
     * Get All Applications
     * ==========================================
     */
    static async getApplications(req, res) {

        try {

            const applications =
                await ApplicationService.getApplications();

            return res.status(200).json({
                success: true,
                data: applications
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
     * Get Application By ID
     * ==========================================
     */
    static async getApplicationById(req, res) {

        try {

            const application =
                await ApplicationService.getApplicationById(
                    req.params.id
                );

            return res.status(200).json({
                success: true,
                data: application
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
     * Update Application Status
     * ==========================================
     */
    static async updateApplicationStatus(req, res) {

        try {

            const result =
                await ApplicationService.updateApplicationStatus(
                    req.params.id,
                    req.body.status
                );

            return res.status(200).json({
                success: true,
                message: "Application status updated successfully.",
                data: result
            });

        } catch (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

    }

}

module.exports = ApplicationController;