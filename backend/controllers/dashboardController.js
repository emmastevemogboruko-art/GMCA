const DashboardService = require("../services/dashboardService");

class DashboardController {

    /**
     * ==========================================
     * Get Dashboard Statistics
     * ==========================================
     */
    static async getDashboard(req, res) {

        try {

            const stats = await DashboardService.getDashboardStatistics();

            return res.status(200).json({
                success: true,
                data: stats
            });

        } catch (error) {

            console.error("Dashboard Error:", error);

            return res.status(500).json({
                success: false,
                message: "Failed to load dashboard statistics.",
                error: error.message
            });

        }

    }

}

module.exports = DashboardController;