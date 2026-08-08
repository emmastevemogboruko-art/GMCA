/**
 * ============================================================
 * GMCA Admin Portal
 * Member Profile
 * File: admin/assets/js/pages/member.js
 * ============================================================
 */

"use strict";

const Member = {

    memberId: null,

    /**
     * ==========================================
     * Initialize
     * ==========================================
     */
    async initialize() {

        Auth.requireAuth();

        this.setAdminName();

        this.memberId = this.getMemberId();

        if (!this.memberId) {

            alert("Invalid member.");

            window.location.href = "members.html";

            return;

        }

        await this.loadMember();

        this.bindEvents();

    },

    /**
     * ==========================================
     * Get Member ID
     * ==========================================
     */
    getMemberId() {

        const params =
            new URLSearchParams(window.location.search);

        return params.get("id");

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
     * Load Member
     * ==========================================
     */
    async loadMember() {

        try {

            Utils.showLoading();

            const response =
                await API.get(
                    `/members/${this.memberId}`
                );

            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to load member."
                );

            }

            this.render(response.data);

        }

        catch (error) {

            console.error(error);

            alert(error.message);

            window.location.href = "members.html";

        }

        finally {

            Utils.hideLoading();

        }

    },

    /**
     * ==========================================
     * Render
     * ==========================================
     */
    render(member) {

        const fullName =
            `${member.first_name}
             ${member.middle_name || ""}
             ${member.last_name}`
            .replace(/\s+/g, " ")
            .trim();

        this.set("memberName", fullName);
        this.set("fullName", fullName);

        this.set(
            "membershipNumber",
            member.membership_number
        );

        this.set(
            "memberCategory",
            member.category
        );

        this.set(
            "memberStatus",
            member.status
        );

        this.set(
            "category",
            member.category
        );

        this.set(
            "status",
            member.status
        );

        this.set(
            "email",
            member.email
        );

        this.set(
            "phone",
            member.phone
        );

        this.set(
            "occupation",
            member.occupation
        );

        this.set(
            "country",
            member.country
        );

        this.set(
            "stateProvince",
            member.state_province
        );

        this.set(
            "city",
            member.city
        );

        this.set(
            "churchName",
            member.church_name
        );

        this.set(
            "ministryName",
            member.ministry_name
        );

        this.set(
            "denomination",
            member.denomination
        );

        this.set(
            "joinedDate",
            Utils.formatDate(
                member.joined_date
            )
        );

        this.set(
            "approvedDate",
            Utils.formatDate(
                member.approved_at
            )
        );

        this.set(
            "approvalNotes",
            member.approval_notes ||
            "No approval notes available."
        );

    },

    /**
     * ==========================================
     * Helper
     * ==========================================
     */
    set(id, value) {

        const element =
            document.getElementById(id);

        if (!element) return;

        element.textContent =
            value || "-";

    },

    /**
     * ==========================================
     * Events
     * ==========================================
     */
    bindEvents() {

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

        Member.initialize();

    }
);