/**
 * ============================================================
 * GMCA Membership Management System
 * Member Portal API Service
 * File: frontend/member/js/core/api.js
 * ============================================================
 */

"use strict";

const API = {

    /**
     * ==========================================
     * Generic Request Handler
     * ==========================================
     */
    async request(endpoint, method = "GET", body = null, requiresAuth = true) {

        const headers = {
            ...CONFIG.HEADERS
        };

        // Attach JWT Token
        if (requiresAuth) {

            const token = Storage.get(
                CONFIG.STORAGE.TOKEN
            );

            if (token) {

                headers.Authorization = `Bearer ${token}`;

            }

        }

        const options = {

            method,

            headers

        };

        if (body) {

            options.body = JSON.stringify(body);

        }

        try {

            const response = await fetch(

                CONFIG.API_BASE_URL + endpoint,

                options

            );

            const result = await response.json().catch(() => ({}));

            // Unauthorized
            if (response.status === 401) {

                Auth.logout();

                return;

            }

            if (!response.ok) {

                throw new Error(

                    result.message ||

                    result.error ||

                    "An unexpected error occurred."

                );

            }

            return result;

        } catch (error) {

            console.error("API Error:", error);

            throw error;

        }

    },

    /**
     * ==========================================
     * Authentication
     * ==========================================
     */

    async login(identifier, password) {

        return await this.request(

            CONFIG.ENDPOINTS.LOGIN,

            CONFIG.METHODS.POST,

            {
                identifier,
                password
            },

            false

        );

    },

    async getCurrentUser() {

        return await this.request(

            CONFIG.ENDPOINTS.ME

        );

    },

    async changePassword(

        currentPassword,

        newPassword,

        confirmPassword

    ) {

        return await this.request(

            CONFIG.ENDPOINTS.CHANGE_PASSWORD,

            CONFIG.METHODS.PATCH,

            {

                currentPassword,

                newPassword,

                confirmPassword

            }

        );

    },

    /**
     * ==========================================
     * Member Profile
     * ==========================================
     */

    async getProfile() {

        return await this.request(

            CONFIG.ENDPOINTS.PROFILE

        );

    },

    /**
     * ==========================================
     * Events
     * ==========================================
     */

    async getEvents() {

        return await this.request(

            CONFIG.ENDPOINTS.EVENTS

        );

    },

    async getEvent(eventId) {

        return await this.request(

            `${CONFIG.ENDPOINTS.EVENTS}/${eventId}`

        );

    },

    async registerForEvent(eventId) {

        return await this.request(

            `${CONFIG.ENDPOINTS.EVENTS}/${eventId}/register`,

            CONFIG.METHODS.POST

        );

    }

};

// Prevent modification
Object.freeze(API);

window.API = API;