/**
 * ==========================================================
 * GMCA Public Website Navigation
 * ==========================================================
 *
 * Makes the public website navigation member-aware.
 *
 * Guest:
 *     Join the Community → Member Login
 *
 * Authenticated Member:
 *     Join the Community → Member Portal
 *     + Logout
 *
 * This does NOT redesign the navigation.
 * It only changes the authentication-related controls.
 * ==========================================================
 */

"use strict";


/**
 * ==========================================================
 * Initialize Navigation
 * ==========================================================
 */

document.addEventListener(

    "DOMContentLoaded",

    async () => {

        /*
         * Wait for SiteAuth to determine whether
         * a valid member session exists.
         */

        await SiteAuth.initialize();

        updateNavigation();

    }

);


/**
 * ==========================================================
 * Update Navigation
 * ==========================================================
 */

function updateNavigation() {

    /*
     * Find the main navigation.
     */

    const navbar =
        document.querySelector(
            "#mainMenu .navbar-nav"
        );


    if (!navbar) {

        return;

    }


    /*
     * Find the existing Join the Community
     * button.
     *
     * We deliberately use the existing button
     * instead of creating a new design.
     */

    const communityButton =
        Array.from(
            navbar.querySelectorAll(
                "a.btn"
            )
        ).find(

            link =>

                link.textContent
                    .trim()
                    .includes(
                        "Join the Community"
                    )

        );


    if (!communityButton) {

        return;

    }


    /*
     * Get the parent navigation item.
     */

    const communityItem =
        communityButton.closest(
            ".nav-item"
        );


    if (!communityItem) {

        return;

    }


    /*
     * Prevent duplicate logout buttons
     * if the script somehow runs more than once.
     */

    const existingLogout =
        navbar.querySelector(
            "[data-gmca-logout]"
        );


    if (existingLogout) {

        existingLogout.remove();

    }


    /* ========================================================
       GUEST
    ======================================================== */

    if (!SiteAuth.isAuthenticated) {

        communityButton.href =
            "frontend/member/login.html";

        communityButton.textContent =
            "Member Login";

        return;

    }


    /* ========================================================
       AUTHENTICATED MEMBER
    ======================================================== */

    communityButton.href =
        "frontend/member/dashboard.html";

    communityButton.textContent =
        "Member Portal";


    /*
     * Create Logout button using the
     * existing Bootstrap styling.
     */

    const logoutItem =
        document.createElement(
            "li"
        );


    logoutItem.className =
        "nav-item ms-lg-2";


    logoutItem.setAttribute(
        "data-gmca-logout",
        "true"
    );


    const logoutButton =
        document.createElement(
            "button"
        );


    logoutButton.type =
        "button";


    logoutButton.className =
        "btn btn-outline-warning rounded-pill px-4";


    logoutButton.textContent =
        "Logout";


    logoutButton.addEventListener(

        "click",

        () => {

            SiteAuth.logout();

        }

    );


    logoutItem.appendChild(
        logoutButton
    );


    navbar.appendChild(
        logoutItem
    );

}