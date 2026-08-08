const DashboardModel = require("../models/dashboardModel");

class DashboardService {

    /**
     * ==========================================
     * Get Dashboard Statistics
     * ==========================================
     */
    static async getDashboardStatistics() {

        return await DashboardModel.getStatistics();

    }

}

module.exports = DashboardService;