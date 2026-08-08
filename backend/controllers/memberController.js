const MemberService = require("../services/memberService");

class MemberController {

    /**
     * ==========================================
     * Get All Members
     * ==========================================
     */
    static async getAll(req, res) {
        try {
            const members = await MemberService.getAllMembers();

            return res.status(200).json({
                success: true,
                data: members
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
     * Get Member By ID
     * ==========================================
     */
    static async getById(req, res) {
        try {

            const member =
                await MemberService.getMemberById(req.params.id);

            return res.status(200).json({
                success: true,
                data: member
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
     * Create Member From Approved Application
     * ==========================================
     */
    static async create(req, res) {
        try {

            const member =
                await MemberService.createMember(
                    req.params.applicationId,
                    req.body
                );

            return res.status(201).json({
                success: true,
                message: "Member created successfully.",
                data: member
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
     * Get Logged-in Member Profile
     * ==========================================
     */
    static async getProfile(req, res) {
        try {

            if (!req.user || !req.user.member_id) {
                return res.status(403).json({
                    success: false,
                    message: "No member profile is associated with this account."
                });
            }

            const member = await MemberService.getMemberById(req.user.member_id);

            return res.status(200).json({
                success: true,
                data: member
            });

        } catch (error) {

            return res.status(404).json({
                success: false,
                message: error.message
            });

        }
    }

}

module.exports = MemberController;