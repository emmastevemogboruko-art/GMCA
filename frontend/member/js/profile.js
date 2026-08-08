/**
 * ============================================================
 * GMCA Membership Management System
 * Member Profile Page
 * File: frontend/member/js/profile.js
 * ============================================================
 */

(() => {

    "use strict";

    /**
     * ==========================================
     * Cached DOM Elements
     * ==========================================
     */

    const elements = {

        loadingOverlay: document.getElementById("loadingOverlay"),

        heroMemberName: document.getElementById("heroMemberName"),

        headerMemberName: document.getElementById("headerMemberName"),

        currentDate: document.getElementById("currentDate"),

        membershipNumber: document.getElementById("membershipNumber"),

        membershipNumberInfo: document.getElementById("membershipNumberInfo"),

        status: document.getElementById("status"),

        membershipStatus: document.getElementById("membershipStatus"),

        joinedDate: document.getElementById("joinedDate"),

        joinedDateInfo: document.getElementById("joinedDateInfo"),

        firstName: document.getElementById("firstName"),

        middleName: document.getElementById("middleName"),

        lastName: document.getElementById("lastName"),

        email: document.getElementById("email"),

        phone: document.getElementById("phone"),

        category: document.getElementById("category"),

        churchName: document.getElementById("churchName"),

        ministryName: document.getElementById("ministryName"),

        denomination: document.getElementById("denomination"),

        occupation: document.getElementById("occupation"),

        country: document.getElementById("country"),

        stateProvince: document.getElementById("stateProvince"),

        city: document.getElementById("city"),

        logoutBtn: document.getElementById("logoutBtn"),

        headerLogoutBtn: document.getElementById("headerLogoutBtn")

    };

    /**
     * ==========================================
     * Initialize Page
     * ==========================================
     */

    async function initialize() {

        try {

            if (typeof Auth !== "undefined") {

                if (!Auth.requireAuth()) {
                    return;

                }

            }

            updateCurrentDate();

            showLoading(true);

            await loadProfile();

            bindEvents();

        } catch (error) {

            console.error(error);

            alert(error.message || "Unable to load your profile.");

        } finally {

            showLoading(false);

        }

    }

    /**
     * ==========================================
     * Load Member Profile
     * ==========================================
     */

    async function loadProfile() {

        const response = await API.getProfile();

        const member = response.data;

        /* Update the shared application header */

        if (typeof Layout !== "undefined") {

            Layout.updateUser({

                ...member,

                fullName: [

                    member.first_name,

                    member.middle_name,

                    member.last_name

                ].filter(Boolean).join(" "),

                role: member.status || "Member"

            });

        }

        renderProfile(member);

    }

    /**
     * ==========================================
     * Render Profile
     * ==========================================
     */

    function renderProfile(member) {

        const fullName = [

            member.first_name,

            member.middle_name,

            member.last_name

        ]

        .filter(Boolean)

        .join(" ");

        elements.heroMemberName.textContent =

            fullName || "Member";

        elements.headerMemberName.textContent =

            fullName || "Member";

        elements.firstName.textContent =

            value(member.first_name);

        elements.middleName.textContent =

            value(member.middle_name);

        elements.lastName.textContent =

            value(member.last_name);

        elements.email.textContent =

            value(member.email);

        elements.phone.textContent =

            value(member.phone);

        elements.membershipNumber.textContent =

            value(member.membership_number);

        elements.membershipNumberInfo.textContent =

            value(member.membership_number);

        elements.category.textContent =

            value(member.category);

        elements.status.textContent =

            value(member.status);

        elements.membershipStatus.textContent =

            value(member.status);
            
        elements.joinedDate.textContent =
            formatDate(member.joined_date);

        elements.joinedDateInfo.textContent =
            formatDate(member.joined_date);

        elements.churchName.textContent =
            value(member.church_name);

        elements.ministryName.textContent =
            value(member.ministry_name);

        elements.denomination.textContent =
            value(member.denomination);

        elements.occupation.textContent =
            value(member.occupation);

        elements.country.textContent =
            value(member.country);

        elements.stateProvince.textContent =
            value(member.state_province);

        elements.city.textContent =
            value(member.city);

    }

    /**
     * ==========================================
     * Bind Events
     * ==========================================
     */

    function bindEvents() {

        if (elements.logoutBtn) {

            elements.logoutBtn.addEventListener(

                "click",

                handleLogout

            );

        }

        if (elements.headerLogoutBtn) {

            elements.headerLogoutBtn.addEventListener(

                "click",

                handleLogout

            );

        }

    }

    /**
     * ==========================================
     * Logout
     * ==========================================
     */

    async function handleLogout(event) {

        event.preventDefault();

        try {

            if (
                typeof Auth !== "undefined" &&
                typeof Auth.logout === "function"
            ) {

                Auth.logout();

                return;

            }

            Storage.clearApplicationData();

            window.location.href = "login.html";

        } catch (error) {

            console.error(error);

            Storage.clearApplicationData();

            window.location.href = "login.html";

        }

    }

    /**
     * ==========================================
     * Helpers
     * ==========================================
     */

    function value(data) {

        if (
            data === null ||
            data === undefined ||
            data === ""
        ) {

            return "N/A";

        }

        return data;

    }

    function formatDate(date) {

        if (!date) {

            return "N/A";

        }

        try {

            return new Date(date).toLocaleDateString(

                undefined,

                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }

            );

        } catch {

            return date;

        }

    }

    function updateCurrentDate() {

        if (!elements.currentDate) {

            return;

        }

        elements.currentDate.textContent =

            new Date().toLocaleDateString(

                undefined,

                {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }

            );

    }

    function showLoading(show) {

        if (!elements.loadingOverlay) {

            return;

        }

        elements.loadingOverlay.classList.toggle(

            "d-none",

            !show

        );

    }

    /**
     * ==========================================
     * Start Page
     * ==========================================
     */

    document.addEventListener(

        "DOMContentLoaded",

        initialize

    );

})();