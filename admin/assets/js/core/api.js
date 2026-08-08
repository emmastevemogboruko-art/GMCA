/**
 * ============================================================
 * GMCA Admin Portal
 * API Service
 * File: admin/assets/js/core/api.js
 * ============================================================
 */

"use strict";

const API = {

    /**
     * ==========================================
     * Generic Request
     * ==========================================
     */
    async request(
        endpoint,
        method = "GET",
        body = null,
        requiresAuth = true
    ) {

        const headers = {
            "Content-Type": "application/json"
        };

        if (requiresAuth) {

            const token =
                Storage.get("admin_token");

            if (token) {

                headers.Authorization =
                    `Bearer ${token}`;

            }

        }

        const options = {

            method,

            headers

        };

        if (body) {

            options.body =
                JSON.stringify(body);

        }

        const response =
            await fetch(

                CONFIG.API_BASE_URL + endpoint,

                options

            );

        const result =
            await response
                .json()
                .catch(() => ({}));

        if (response.status === 401) {

            Storage.remove("admin_token");

            window.location.href =
                "login.html";

            return;

        }

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Request failed."

            );

        }

        return result;

    },

    /**
     * ==========================================
     * GET
     * ==========================================
     */
    get(endpoint) {

        return this.request(

            endpoint

        );

    },

    /**
     * ==========================================
     * POST
     * ==========================================
     */
    post(endpoint, body) {

        return this.request(

            endpoint,

            "POST",

            body

        );

    },

    /**
     * ==========================================
     * PUT
     * ==========================================
     */
    put(endpoint, body) {

        return this.request(

            endpoint,

            "PUT",

            body

        );

    },

    /**
     * ==========================================
     * PATCH
     * ==========================================
     */
    patch(endpoint, body) {

        return this.request(

            endpoint,

            "PATCH",

            body

        );

    },

    /**
     * ==========================================
     * DELETE
     * ==========================================
     */
    delete(endpoint) {

        return this.request(

            endpoint,

            "DELETE"

        );

    }

};

Object.freeze(API);

window.API = API;