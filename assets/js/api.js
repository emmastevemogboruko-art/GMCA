/**
 * ==========================================================
 * GMCA Membership Portal
 * Database API (Express + PostgreSQL)
 * File: api.js
 * ==========================================================
 */

window.GMCA = window.GMCA || {};

GMCA.api = (() => {

    const API_URL = "http://localhost:5000/api";

    /**
     * ------------------------------------------------------
     * Save Membership Application
     * ------------------------------------------------------
     */
    async function saveApplication(application) {

        const payload = {

            category_id: Number(application.category_id),

            first_name: application.first_name || null,
            middle_name: application.middle_name || null,
            last_name: application.last_name || null,

            gender: application.gender || null,
            date_of_birth: application.date_of_birth || null,

            email: application.email || null,
            phone: application.phone || null,

            country: application.country || null,
            state_province: application.state_province || null,
            city: application.city || null,
            postal_address: application.postal_address || null,

            church_name: application.church_name || null,
            ministry_name: application.ministry_name || null,
            denomination: application.denomination || null,
            occupation: application.occupation || null,

            testimony: application.testimony || null,
            reason_for_joining: application.reason_for_joining || null

        };

        console.group("GMCA Application");

        console.log(payload);

        const response = await fetch(

            `${API_URL}/applications`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(payload)

            }

        );

        const result = await response.json();

        console.groupEnd();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Application submission failed."

            );

        }

        return result.data;

    }

    /**
     * ------------------------------------------------------
     * Get Application
     * ------------------------------------------------------
     */

    async function getApplication(id) {

        const response = await fetch(

            `${API_URL}/applications/${id}`

        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Unable to fetch application."

            );

        }

        return result.data;

    }

    /**
     * ------------------------------------------------------
     * Update Status
     * ------------------------------------------------------
     */

    async function updateApplicationStatus(id, status) {

        const response = await fetch(

            `${API_URL}/applications/${id}/status`,

            {

                method: "PATCH",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    status

                })

            }

        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Unable to update application."

            );

        }

        return result.data;

    }

    /**
     * ------------------------------------------------------
     * Get All Applications
     * ------------------------------------------------------
     */

    async function getApplications() {

        const response = await fetch(

            `${API_URL}/applications`

        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Unable to load applications."

            );

        }

        return result.data;

    }

    /**
     * ------------------------------------------------------
     * Get Membership Categories
     * ------------------------------------------------------
     */

    async function getCategories() {

        const response = await fetch(

            `${API_URL}/member-categories`

        );

        const result = await response.json();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Unable to load membership categories."

            );

        }

        return result.data;

    }

    return {

        saveApplication,

        getApplication,

        updateApplicationStatus,

        getApplications,

        getCategories

    };

})();