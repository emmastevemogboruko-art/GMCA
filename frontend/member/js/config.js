/**
 * ============================================================
 * GMCA Membership Management System
 * Member Portal Configuration
 * File: frontend/member/js/config.js
 * ============================================================
 */

const CONFIG = {
    // Application Information
    APP_NAME: "GMCA Member Portal",
    APP_VERSION: "1.0.0",

    // Backend API Configuration
    API_BASE_URL: "http://localhost:5000/api",

    // Local Storage Keys
    STORAGE: {
        TOKEN: "gmca_member_token",
        MEMBER: "gmca_member"
    },

    // API Endpoints
    ENDPOINTS: {
        // Authentication
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        ME: "/auth/me",
        CHANGE_PASSWORD: "/auth/change-password",

        // Member Portal
        PROFILE: "/member/profile",
        EVENTS: "/member/events"
    },

    // HTTP Methods
    METHODS: {
        GET: "GET",
        POST: "POST",
        PUT: "PUT",
        PATCH: "PATCH",
        DELETE: "DELETE"
    },

    // Default Headers
    HEADERS: {
        "Content-Type": "application/json"
    }
};

// Prevent accidental modification
Object.freeze(CONFIG);
Object.freeze(CONFIG.STORAGE);
Object.freeze(CONFIG.ENDPOINTS);
Object.freeze(CONFIG.METHODS);
Object.freeze(CONFIG.HEADERS);