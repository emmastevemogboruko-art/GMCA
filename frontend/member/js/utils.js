/**
 * ============================================================
 * GMCA Membership Management System
 * Member Portal Utility Functions
 * File: frontend/member/js/utils.js
 * ============================================================
 */

const Utils = {

    /**
     * ==========================================
     * Set Text Content
     * ==========================================
     */
    setText(elementId, value) {

        const element = document.getElementById(elementId);

        if (element) {
            element.textContent = value ?? "";
        }

    },

    /**
     * ==========================================
     * Set HTML Content
     * ==========================================
     */
    setHTML(elementId, html) {

        const element = document.getElementById(elementId);

        if (element) {
            element.innerHTML = html;
        }

    },

    /**
     * ==========================================
     * Format Date
     * Example:
     * 2025-07-15 -> Jul 15, 2025
     * ==========================================
     */
    formatDate(date) {

        if (!date) return "";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });

    },

    /**
     * ==========================================
     * Format Date & Time
     * ==========================================
     */
    formatDateTime(date) {

        if (!date) return "";

        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

    },

    /**
     * ==========================================
     * Show Bootstrap Alert
     * ==========================================
     */
    showAlert(message, type = "success") {

        const container = document.getElementById("alertContainer");

        if (!container) {
            alert(message);
            return;
        }

        container.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert">
                </button>
            </div>
        `;

    },

    /**
     * ==========================================
     * Success Message
     * ==========================================
     */
    showSuccess(message) {

        this.showAlert(message, "success");

    },

    /**
     * ==========================================
     * Error Message
     * ==========================================
     */
    showError(message) {

        this.showAlert(message, "danger");

    },

    /**
     * ==========================================
     * Warning Message
     * ==========================================
     */
    showWarning(message) {

        this.showAlert(message, "warning");

    },

    /**
     * ==========================================
     * Information Message
     * ==========================================
     */
    showInfo(message) {

        this.showAlert(message, "info");

    },

    /**
     * ==========================================
     * Show Loading Spinner
     * ==========================================
     */
    showLoading() {

        const loader = document.getElementById("loader");

        if (loader) {
            loader.classList.remove("d-none");
        }

    },

    /**
     * ==========================================
     * Hide Loading Spinner
     * ==========================================
     */
    hideLoading() {

        const loader = document.getElementById("loader");

        if (loader) {
            loader.classList.add("d-none");
        }

    },

    /**
     * ==========================================
     * Go Back
     * ==========================================
     */
    goBack() {

        window.history.back();

    },

    /**
     * ==========================================
     * Check Empty Value
     * ==========================================
     */
    isEmpty(value) {

        return (
            value === null ||
            value === undefined ||
            value === ""
        );

    }

};

// Prevent modification
Object.freeze(Utils);