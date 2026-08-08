const ApplicationModel = require("../models/applicationModel");
const MemberService = require("./memberService");
const UserService = require("./userService");
const EmailService = require("./emailService");

class ApplicationService {

    /**
     * ==========================================
     * Create Application
     * ==========================================
     */
    static async createApplication(data) {

        // Required fields
        if (!data.first_name) {
            throw new Error("First name is required.");
        }

        if (!data.last_name) {
            throw new Error("Last name is required.");
        }

        if (!data.email) {
            throw new Error("Email is required.");
        }

        if (!data.phone) {
            throw new Error("Phone number is required.");
        }

        if (!data.country) {
            throw new Error("Country is required.");
        }

        if (!data.category_id) {
            throw new Error("Membership category is required.");
        }

        // Generate Application Number
        const year = new Date().getFullYear();

        const random =
            Date.now()
                .toString()
                .slice(-6);

        data.application_number =
            `APP-${year}-${random}`;

        // Save Application
        const application =
            await ApplicationModel.create(data);

        /*
        |--------------------------------------------------------------------------
        | Send Confirmation Email
        |--------------------------------------------------------------------------
        */

        try {

            await EmailService.sendApplicationReceivedEmail(
                application
            );

        }

        catch (error) {

            console.error(
                "Application confirmation email failed."
            );

            console.error(
                error.message
            );

        }

        return application;

    }

    /**
     * ==========================================
     * Get All Applications
     * ==========================================
     */
    static async getApplications() {

        return await ApplicationModel.getAll();

    }

    /**
     * ==========================================
     * Get Application By ID
     * ==========================================
     */
    static async getApplicationById(id) {

        const application =
            await ApplicationModel.getById(id);

        if (!application) {

            throw new Error(
                "Application not found."
            );

        }

        return application;

    }

    /**
     * ==========================================
     * Update Application Status
     * ==========================================
     */
    static async updateApplicationStatus(id, status) {

        const allowedStatuses = [
            "Pending",
            "Approved",
            "Rejected"
        ];

        if (!allowedStatuses.includes(status)) {

            throw new Error(
                "Invalid application status."
            );

        }

        const application =
            await ApplicationModel.getById(id);

        if (!application) {

            throw new Error(
                "Application not found."
            );

        }

        // Update Application Status
        const updatedApplication =
            await ApplicationModel.updateStatus(
                id,
                status
            );

        let member = null;

        let account = null;

        /*
        |--------------------------------------------------------------------------
        | Automatically Create Member & User Account
        |--------------------------------------------------------------------------
        */

        if (status === "Approved") {

            // Create Member
            member =
                await MemberService.createMember(
                    id
                );

            // Create User Account
            account =
                await UserService.createMemberAccount(
                    member,
                    application
                );

            /*
            |--------------------------------------------------------------------------
            | Send Welcome Email
            |--------------------------------------------------------------------------
            */

            try {

                await EmailService.sendMemberApprovalEmail(
                    application,
                    account
                );

            }

            catch (error) {

                console.error(
                    "Failed to send member approval email."
                );

                console.error(
                    error.message
                );

            }

        }

        return {

            application: updatedApplication,

            member,

            account

        };

    }

}

module.exports = ApplicationService;