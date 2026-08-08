/**
 * ============================================================
 * GMCA Admin Portal
 * Utility Functions
 * ============================================================
 */

"use strict";

const Utils = {

    /**
     * Format Date
     */
    formatDate(date) {

        if (!date) {

            return "N/A";

        }

        return new Date(date).toLocaleDateString(
            undefined,
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    },

    /**
     * Escape HTML
     */
    escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    },

    /**
     * Show Alert
     */
    showAlert(message) {

        alert(message);

    },

    /**
     * Loading Overlay
     */
    showLoading() {

        const overlay = document.getElementById("loadingOverlay");

        if (overlay) {

            overlay.classList.remove("d-none");

        }

    },

    hideLoading() {

        const overlay = document.getElementById("loadingOverlay");

        if (overlay) {

            overlay.classList.add("d-none");

        }

    }

};

Object.freeze(Utils);

window.Utils = Utils;