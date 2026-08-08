/**
 * ==========================================================
 * GMCA Membership Portal
 * File: validation.js
 * Purpose: Form validation utilities
 * ==========================================================
 */

window.GMCA = window.GMCA || {};

GMCA.validation = (() => {

    /**
     * Regular Expressions
     */
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phonePattern =
        /^\+?[0-9\s\-()]{7,20}$/;

    /**
     * Validate Email
     */
    function isEmail(email) {
        return emailPattern.test(email.trim());
    }

    /**
     * Validate Phone
     */
    function isPhone(phone) {
        return phonePattern.test(phone.trim());
    }

    /**
     * Show Validation Error
     */
    function showError(field, message) {

        field.classList.remove("is-valid");
        field.classList.add("is-invalid");

        let feedback = field.parentElement.querySelector(".invalid-feedback");

        if (!feedback) {

            feedback = document.createElement("div");
            feedback.className = "invalid-feedback";

            field.parentElement.appendChild(feedback);

        }

        feedback.textContent = message;

    }

    /**
     * Clear Validation Error
     */
    function clearError(field) {

        field.classList.remove("is-invalid");
        field.classList.add("is-valid");

        const feedback = field.parentElement.querySelector(".invalid-feedback");

        if (feedback) {
            feedback.textContent = "";
        }

    }

    /**
     * Validate Single Field
     */
    function validateField(field) {

        const value = field.value.trim();

        // Required
        if (field.hasAttribute("required") && value === "") {

            showError(field, "This field is required.");
            return false;

        }

        // Email
        if (field.type === "email" && value !== "") {

            if (!isEmail(value)) {

                showError(field, "Please enter a valid email address.");
                return false;

            }

        }

        // Phone
        if (field.dataset.type === "phone" && value !== "") {

            if (!isPhone(value)) {

                showError(field, "Please enter a valid phone number.");
                return false;

            }

        }

        clearError(field);

        return true;

    }

    /**
     * Validate Entire Form
     */
    function validateForm(form) {

        let valid = true;

        const fields = form.querySelectorAll("input, select, textarea");

        fields.forEach(field => {

            if (!validateField(field)) {
                valid = false;
            }

        });

        return valid;

    }

    /**
     * Enable Live Validation
     */
    function bind(form) {

        const fields = form.querySelectorAll("input, select, textarea");

        fields.forEach(field => {

            field.addEventListener("input", () => {
                validateField(field);
            });

            field.addEventListener("change", () => {
                validateField(field);
            });

        });

    }

    /**
     * Public API
     */
    return {

        isEmail,
        isPhone,

        showError,
        clearError,

        validateField,
        validateForm,

        bind

    };

})();