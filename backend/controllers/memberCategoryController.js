const MemberCategoryService = require("../services/memberCategoryService");

class MemberCategoryController {

    /**
     * ==========================================
     * Get All Categories
     * ==========================================
     */
    static async getAll(req, res) {

        try {

            const categories =
                await MemberCategoryService.getAll();

            return res.status(200).json({

                success: true,

                data: categories

            });

        }

        catch (error) {

            return res.status(500).json({

                success: false,

                message: error.message

            });

        }

    }

}

module.exports = MemberCategoryController;