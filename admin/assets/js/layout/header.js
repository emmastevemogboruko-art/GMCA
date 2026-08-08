/**
 * ============================================================
 * GMCA Admin Portal
 * Header
 * File: assets/js/layout/header.js
 * ============================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    Auth.requireAuth();

    const admin = Auth.getUser();

    if (!admin) {
        return;
    }

    const username = document.getElementById("adminName");

    if (username) {

        username.textContent =
            admin.username || admin.email || "Administrator";

    }

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", () => {

            Auth.logout();

        });

    }

});