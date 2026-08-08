/**
 * ============================================================
 * GMCA Admin Portal
 * Applications
 * File: admin/assets/js/pages/applications.js
 * ============================================================
 */

"use strict";

const Applications = {

    applications: [],
    filteredApplications: [],

    /**
     * ==========================================
     * Initialize
     * ==========================================
     */
    async initialize() {

        Auth.requireAuth();

        this.setAdminName();

        this.bindEvents();

        await this.loadApplications();

    },

    /**
     * ==========================================
     * Display Logged-in Administrator
     * ==========================================
     */
    setAdminName() {

        const admin = Auth.getUser();

        if (!admin) return;

        const adminName =
            document.getElementById("adminName");

        if (adminName) {

            adminName.textContent =
                admin.username || admin.email;

        }

    },

    /**
     * ==========================================
     * Load Applications
     * ==========================================
     */
    async loadApplications() {

        try {

            Utils.showLoading();

            const response =
                await API.get("/applications");

            this.applications =
                response.data || [];

            this.filteredApplications =
                [...this.applications];

            this.renderApplications();

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

        finally {

            Utils.hideLoading();

        }

    },

    /**
     * ==========================================
     * Render Applications
     * ==========================================
     */
    renderApplications() {

        const tbody =
            document.getElementById(
                "applicationsTableBody"
            );

        const count =
            document.getElementById(
                "applicationCount"
            );

        const empty =
            document.getElementById(
                "emptyState"
            );

        if (!tbody) return;

        count.textContent =
            `${this.filteredApplications.length} Applications`;

        if (!this.filteredApplications.length) {

            tbody.innerHTML = "";

            empty.classList.remove("d-none");

            return;

        }

        empty.classList.add("d-none");

        tbody.innerHTML =
            this.filteredApplications.map(app => `

<tr>

<td>${app.application_number}</td>

<td>

<strong>

${app.first_name}
${app.middle_name || ""}
${app.last_name}

</strong>

</td>

<td>${app.country || "-"}</td>

<td>${app.ministry_name || "-"}</td>

<td>${Utils.formatDate(app.submitted_at)}</td>

<td>

${this.getStatusBadge(app.application_status)}

</td>

<td class="text-center">

<a
href="application.html?id=${app.id}"
class="btn btn-sm btn-outline-primary">

View

</a>

${app.application_status === "Pending" ? `

<button
class="btn btn-sm btn-success ms-1 approve-btn"
data-id="${app.id}">

Approve

</button>

<button
class="btn btn-sm btn-danger ms-1 reject-btn"
data-id="${app.id}">

Reject

</button>

` : ""}

</td>

</tr>

`).join("");

    },

    /**
     * ==========================================
     * Status Badge
     * ==========================================
     */
    getStatusBadge(status) {

        switch (status) {

            case "Approved":

                return `<span class="badge bg-success">Approved</span>`;

            case "Rejected":

                return `<span class="badge bg-danger">Rejected</span>`;

            default:

                return `<span class="badge bg-warning text-dark">Pending</span>`;

        }

    },

    /**
     * ==========================================
     * Approve Application
     * ==========================================
     */
    async approveApplication(id) {

        if (!confirm("Approve this application?")) {
            return;
        }

        try {

            Utils.showLoading();

            const response = await API.patch(
                `/applications/${id}/status`,
                {
                    status: "Approved"
                }
            );

            alert(
                response.message ||
                "Application approved successfully."
            );

            await this.loadApplications();

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

        finally {

            Utils.hideLoading();

        }

    },

    /**
     * ==========================================
     * Reject Application
     * ==========================================
     */
    async rejectApplication(id) {

        if (!confirm("Reject this application?")) {
            return;
        }

        try {

            Utils.showLoading();

            const response = await API.patch(
                `/applications/${id}/status`,
                {
                    status: "Rejected"
                }
            );

            alert(
                response.message ||
                "Application rejected."
            );

            await this.loadApplications();

        }

        catch (error) {

            console.error(error);

            alert(error.message);

        }

        finally {

            Utils.hideLoading();

        }

    },

    /**
     * ==========================================
     * Search
     * ==========================================
     */
    search(value) {

        value = value.toLowerCase();

        this.filteredApplications =
            this.applications.filter(app => {

                return (

                    app.application_number
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    `${app.first_name}
                    ${app.middle_name || ""}
                    ${app.last_name}`
                        .toLowerCase()
                        .includes(value)

                    ||

                    app.email
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    app.country
                        ?.toLowerCase()
                        .includes(value)

                );

            });

        this.renderApplications();

    },

    /**
     * ==========================================
     * Events
     * ==========================================
     */
    bindEvents() {

        const search =
            document.getElementById("searchInput");

        if (search) {

            search.addEventListener(
                "input",
                (e) => {

                    this.search(
                        e.target.value
                    );

                }
            );

        }

        const refresh =
            document.getElementById("refreshBtn");

        if (refresh) {

            refresh.addEventListener(
                "click",
                () => this.loadApplications()
            );

        }

        const logout =
            document.getElementById("logoutBtnTop");

        if (logout) {

            logout.addEventListener(
                "click",
                () => Auth.logout()
            );

        }

        document.addEventListener(
            "click",
            (e) => {

                const approveBtn =
                    e.target.closest(".approve-btn");

                if (approveBtn) {

                    this.approveApplication(
                        approveBtn.dataset.id
                    );

                    return;

                }

                const rejectBtn =
                    e.target.closest(".reject-btn");

                if (rejectBtn) {

                    this.rejectApplication(
                        rejectBtn.dataset.id
                    );

                }

            }
        );

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Applications.initialize();

    }
);