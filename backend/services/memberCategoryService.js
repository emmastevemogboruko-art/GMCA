const MemberCategoryModel = require("../models/memberCategoryModel");

class MemberCategoryService {

    /**
     * ==========================================
     * Get All Categories
     * ==========================================
     */
    static async getAll() {

        return await MemberCategoryModel.getAll();

    }

}

module.exports = MemberCategoryService;