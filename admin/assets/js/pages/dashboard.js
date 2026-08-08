/**
 * ============================================================
 * GMCA Admin Portal
 * Dashboard
 * File: admin/assets/js/pages/dashboard.js
 * ============================================================
 */

"use strict";

const Dashboard = {

    /**
     * ==========================================
     * Initialize Dashboard
     * ==========================================
     */
    async initialize() {

        Auth.requireAuth();

        this.setAdminName();

        this.setCurrentDate();

        await this.loadDashboard();

        this.bindEvents();

    },

    /**
     * ==========================================
     * Display Logged-in Administrator
     * ==========================================
     */
    setAdminName() {

        const admin = Auth.getUser();

        if (!admin) return;

        const adminName = document.getElementById("adminName");
        const welcomeAdmin = document.getElementById("welcomeAdmin");

        if (adminName) {

            adminName.textContent =
                admin.username || admin.email;

        }

        if (welcomeAdmin) {

            welcomeAdmin.textContent =
                admin.username || admin.email;

        }

    },

    /**
     * ==========================================
     * Current Date
     * ==========================================
     */
    setCurrentDate() {

        const currentDate =
            document.getElementById("currentDate");

        if (!currentDate) return;

        currentDate.textContent =
            new Date().toLocaleDateString(
                "en-US",
                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            );

    },

    /**
     * ==========================================
     * Load Dashboard Statistics
     * ==========================================
     */
    async loadDashboard() {

        try {

            Utils.showLoading();

            const response =
                await API.get("/dashboard");

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to load dashboard."
                );

            }

            const data = response.data;

            this.renderStatistics(data);

            this.renderRecentApplications(
                data.recentApplications
            );

        }

        catch (error) {

            console.error(error);

            alert(
                error.message ||
                "Unable to load dashboard."
            );

        }

        finally {

            Utils.hideLoading();

        }

    },

    /**
     * ==========================================
     * Statistics
     * ==========================================
     */
    renderStatistics(data) {

        this.setValue(
            "totalApplications",
            data.applications.total
        );

        this.setValue(
            "pendingApplications",
            data.applications.pending
        );

        this.setValue(
            "approvedApplications",
            data.applications.approved
        );

        this.setValue(
            "rejectedApplications",
            data.applications.rejected
        );

        this.setValue(
            "totalMembers",
            data.members.total
        );

        this.setValue(
            "activeMembers",
            data.members.active
        );

        this.setValue(
            "inactiveMembers",
            data.members.inactive
        );

        this.setValue(
            "totalMentors",
            data.mentorship.mentors
        );

        this.setValue(
            "totalMentees",
            data.mentorship.mentees
        );

        this.setValue(
            "activeAnnouncements",
            data.announcements.active
        );

    },

    /**
     * ==========================================
     * Recent Applications
     * ==========================================
     */
    renderRecentApplications(applications) {

        const tbody =
            document.getElementById(
                "recentApplications"
            );

        if (!tbody) return;

        if (!applications || applications.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
                        No recent applications found.
                    </td>
                </tr>
            `;

            return;

        }

        tbody.innerHTML =
            applications.map(app => `

                <tr>

                    <td>

                        ${app.application_number}

                    </td>

                    <td>

                        ${app.first_name}
                        ${app.middle_name || ""}
                        ${app.last_name}

                    </td>

                    <td>

                        ${app.country}

                    </td>

                    <td>

                        <span class="badge bg-primary">

                            ${app.application_status}

                        </span>

                    </td>

                    <td>

                        ${Utils.formatDate(
                            app.submitted_at
                        )}

                    </td>

                    <td>

                        <a
                            href="application.html?id=${app.id}"
                            class="btn btn-sm btn-outline-primary">

                            View

                        </a>

                    </td>

                </tr>

            `).join("");

    },

    /**
     * ==========================================
     * Helper
     * ==========================================
     */
    setValue(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent = value;

        }

    },

    /**
     * ==========================================
     * Events
     * ==========================================
     */
    bindEvents() {

        const logoutTop =
            document.getElementById(
                "logoutBtnTop"
            );

        if (logoutTop) {

            logoutTop.addEventListener(
                "click",
                () => Auth.logout()
            );

        }

    }

};

/**
 * ==========================================
 * Bootstrap
 * ==========================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Dashboard.initialize();

    }
);