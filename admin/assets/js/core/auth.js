/**
 * ============================================================
 * GMCA Admin Portal
 * Authentication Service
 * ============================================================
 */

"use strict";

const Auth = {

    /**
     * Save login session
     */
    login(token, admin) {

        Storage.set("admin_token", token);
        Storage.set("admin_user", admin);

    },

    /**
     * Logout
     */
    logout() {

        Storage.remove("admin_token");
        Storage.remove("admin_user");

        window.location.href = "login.html";

    },

    /**
     * Check login
     */
    isAuthenticated() {

        return !!Storage.get("admin_token");

    },

    /**
     * Get current admin
     */
    getUser() {

        return Storage.get("admin_user");

    },

    /**
     * Protect admin pages
     */
    requireAuth() {

        if (!this.isAuthenticated()) {

            window.location.href = "login.html";

        }

    }

};

Object.freeze(Auth);

window.Auth = Auth;