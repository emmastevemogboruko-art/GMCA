/**
 * ============================================================
 * GMCA Membership Management System
 * Member Portal Authentication
 * File: frontend/member/js/auth.js
 * ============================================================
 */

const Auth = {

    /**
     * ==========================================
     * Login Member
     * ==========================================
     */
    async login(identifier, password) {

        const response = await API.login(identifier, password);

        if (!response.success) {
            throw new Error(response.message);
        }

        // Save JWT Token
        localStorage.setItem(
            CONFIG.STORAGE.TOKEN,
            response.data.token
        );

        // Save Logged-in User
        localStorage.setItem(
            CONFIG.STORAGE.MEMBER,
            JSON.stringify(response.data.user)
        );

        return response.data.user;
    },

    /**
     * ==========================================
     * Logout Member
     * ==========================================
     */
    logout() {

        this.clearSession();

        window.location.href = "login.html";
    },

    /**
     * ==========================================
     * Check Login Status
     * ==========================================
     */
    isLoggedIn() {

        return !!localStorage.getItem(
            CONFIG.STORAGE.TOKEN
        );
    },

    /**
     * ==========================================
     * Protect Private Pages
     * ==========================================
     */
    requireAuth() {

        if (!this.isLoggedIn()) {

            window.location.href = "login.html";

            return false;
        }

        return true;
    },

    /**
     * ==========================================
     * Get JWT Token
     * ==========================================
     */
    getToken() {

        return localStorage.getItem(
            CONFIG.STORAGE.TOKEN
        );
    },

    /**
     * ==========================================
     * Get Logged-in Member
     * ==========================================
     */
    getCurrentMember() {

        const member = localStorage.getItem(
            CONFIG.STORAGE.MEMBER
        );

        return member ? JSON.parse(member) : null;
    },

    /**
     * ==========================================
     * Save Logged-in Member
     * ==========================================
     */
    saveCurrentMember(member) {

        localStorage.setItem(
            CONFIG.STORAGE.MEMBER,
            JSON.stringify(member)
        );
    },

    /**
     * ==========================================
     * Clear Session
     * ==========================================
     */
    clearSession() {

        localStorage.removeItem(
            CONFIG.STORAGE.TOKEN
        );

        localStorage.removeItem(
            CONFIG.STORAGE.MEMBER
        );
    }

};

// Prevent accidental modification
Object.freeze(Auth);