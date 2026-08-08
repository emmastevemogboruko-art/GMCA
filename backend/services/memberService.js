const MemberModel = require("../models/memberModel");
const ApplicationModel = require("../models/applicationModel");

class MemberService {

    /**
     * ==========================================
     * Get All Members
     * ==========================================
     */
    static async getAllMembers() {

        return await MemberModel.getAll();

    }

    /**
     * ==========================================
     * Get Member By ID
     * ==========================================
     */
    static async getMemberById(id) {

        const member = await MemberModel.getById(id);

        if (!member) {
            throw new Error("Member not found.");
        }

        return member;

    }

    /**
     * ==========================================
     * Create Member From Approved Application
     * ==========================================
     */
    static async createMember(applicationId) {

        // Check application exists
        const application = await ApplicationModel.getById(applicationId);

        if (!application) {
            throw new Error("Application not found.");
        }

        // Only approved applications can become members
        if (application.application_status !== "Approved") {
            throw new Error("Only approved applications can become members.");
        }

        // Prevent duplicate members
        const existing = await MemberModel.findByApplication(applicationId);

        if (existing) {
            return existing;
        }

        // Get Active status
        const activeStatus = await MemberModel.getStatusByName("Active");

        if (!activeStatus) {
            throw new Error("Active member status not found.");
        }

        // Create member using the category selected by the applicant
        const member = await MemberModel.create({

            application_id: application.id,

            category_id: application.category_id,

            status_id: activeStatus.id,

            joined_date: new Date(),

            approved_by: null,

            approval_notes:
                "Automatically created when application was approved."

        });

        // Generate Membership Number
        const year = new Date().getFullYear();

        const membershipNumber =
            `GMCA-${year}-${String(member.id).padStart(6, "0")}`;

        // Save Membership Number
        const updatedMember =
            await MemberModel.updateMembershipNumber(
                member.id,
                membershipNumber
            );

        return updatedMember;

    }

}

module.exports = MemberService;