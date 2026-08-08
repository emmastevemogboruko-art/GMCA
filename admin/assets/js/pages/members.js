/**
 * ============================================================
 * GMCA Admin Portal
 * Members
 * File: admin/assets/js/pages/members.js
 * ============================================================
 */

"use strict";

const Members = {

    members: [],
    filteredMembers: [],

    /**
     * ==========================================
     * Initialize
     * ==========================================
     */
    async initialize() {

        Auth.requireAuth();

        this.setAdminName();

        this.bindEvents();

        await this.loadMembers();

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
     * Load Members
     * ==========================================
     */
    async loadMembers() {

        try {

            Utils.showLoading();

            const response =
                await API.get("/members");

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to load members."
                );

            }

            this.members = response.data;

            this.filteredMembers =
                [...this.members];

            this.renderMembers();

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
     * Render Members Table
     * ==========================================
     */
    renderMembers() {

        const tbody =
            document.getElementById(
                "membersTableBody"
            );

        const count =
            document.getElementById(
                "memberCount"
            );

        const empty =
            document.getElementById(
                "emptyState"
            );

        if (!tbody) return;

        count.textContent =
            `${this.filteredMembers.length} Members`;

        if (this.filteredMembers.length === 0) {

            tbody.innerHTML = "";

            empty.classList.remove("d-none");

            return;

        }

        empty.classList.add("d-none");

        tbody.innerHTML =
            this.filteredMembers.map(member => `

<tr>

<td>

${member.membership_number}

</td>

<td>

<strong>

${member.first_name}
${member.middle_name || ""}
${member.last_name}

</strong>

</td>

<td>

${member.email}

</td>

<td>

<span class="badge bg-primary">

${member.category}

</span>

</td>

<td>

<span class="badge bg-success">

${member.status}

</span>

</td>

<td>

${member.country}

</td>

<td class="text-center">

<a
href="member.html?id=${member.id}"
class="btn btn-sm btn-outline-primary">

View

</a>

</td>

</tr>

`).join("");

    },

    /**
     * ==========================================
     * Search
     * ==========================================
     */
    search(value) {

        value = value.toLowerCase();

        this.filteredMembers =
            this.members.filter(member => {

                return (

                    member.membership_number
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    `${member.first_name}
                    ${member.middle_name || ""}
                    ${member.last_name}`
                        .toLowerCase()
                        .includes(value)

                    ||

                    member.email
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    member.country
                        ?.toLowerCase()
                        .includes(value)

                );

            });

        this.renderMembers();

    },

    /**
     * ==========================================
     * Events
     * ==========================================
     */
    bindEvents() {

        const search =
            document.getElementById(
                "searchInput"
            );

        const refresh =
            document.getElementById(
                "refreshBtn"
            );

        if (search) {

            search.addEventListener(
                "input",
                e => {

                    this.search(
                        e.target.value
                    );

                }
            );

        }

        if (refresh) {

            refresh.addEventListener(
                "click",
                () => this.loadMembers()
            );

        }

        const logout =
            document.getElementById(
                "logoutBtnTop"
            );

        if (logout) {

            logout.addEventListener(
                "click",
                () => Auth.logout()
            );

        }

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => {

        Members.initialize();

    }
);