/**
 * =============================================================================
 * GMCA Membership Management System
 * -----------------------------------------------------------------------------
 * File: change-password.js
 * =============================================================================
 *
 * Change Password Page
 *
 * Responsibilities
 * ----------------
 * • Load authenticated member
 * • Display current date
 * • Validate password fields
 * • Change password
 * • Show loading state
 * • Display success/error alerts
 *
 * =============================================================================
 */

"use strict";

const ChangePassword = (() => {

    /* ==========================================================================
       Private State
       ========================================================================== */

    let initialized = false;

    let member = null;

    let elements = {};

    /* ==========================================================================
       Initialize
       ========================================================================== */

    async function initialize() {

        if (initialized) {

            return;

        }

        initialized = true;

        cacheElements();

        bindEvents();

        updateCurrentDate();

        showLoading();

        try {

            await loadMember();

        }

        catch (error) {

            handleError(error);

        }

        finally {

            hideLoading();

        }

    }

    /* ==========================================================================
       Cache Elements
       ========================================================================== */

    function cacheElements() {

        elements = {

            form:
                document.getElementById("changePasswordForm"),

            currentPassword:
                document.getElementById("currentPassword"),

            newPassword:
                document.getElementById("newPassword"),

            confirmPassword:
                document.getElementById("confirmPassword"),

            submitButton:
                document.getElementById("changePasswordBtn"),

            loadingOverlay:
                document.getElementById("loadingOverlay"),

            headerMemberName:
                document.getElementById("headerMemberName"),

            currentDate:
                document.getElementById("currentDate"),

            logoutBtn:
                document.getElementById("logoutBtn"),

            headerLogoutBtn:
                document.getElementById("headerLogoutBtn"),

            alert:
                document.getElementById("passwordAlert"),

            strengthBar:
                document.getElementById("passwordStrengthBar"),

            strengthText:
                document.getElementById("passwordStrengthText")

        };

    }

    /* ==========================================================================
       Bind Events
       ========================================================================== */

    function bindEvents() {

        if (elements.form) {

            elements.form.addEventListener(

                "submit",

                handleSubmit

            );

        }

        if (elements.newPassword) {

            elements.newPassword.addEventListener(

                "input",

                updateStrengthMeter

            );

        }

        if (elements.confirmPassword) {

            elements.confirmPassword.addEventListener(

                "input",

                validatePasswords

            );

        }

        if (elements.logoutBtn) {

            elements.logoutBtn.addEventListener(

                "click",

                handleLogout

            );

        }

        if (elements.headerLogoutBtn) {

            elements.headerLogoutBtn.addEventListener(

                "click",

                handleLogout

            );

        }

    }

    /* ==========================================================================
       Load Member
       ========================================================================== */

    async function loadMember() {

        const response = await API.getProfile();

        member = response.data || response;

        if (!member) {

            return;

        }

        const fullName = [

            member.first_name,

            member.middle_name,

            member.last_name

        ]

        .filter(Boolean)

        .join(" ");

        if (

            typeof Layout !== "undefined"

        ) {

            Layout.updateUser({

                ...member,

                fullName,

                role: member.status || "Member"

            });

        }

        if (elements.headerMemberName) {

            elements.headerMemberName.textContent =

                fullName;

        }

    }

    /* ==========================================================================
       Submit Handler
       ========================================================================== */

    async function handleSubmit(event) {

        event.preventDefault();

        clearAlert();

        if (!validatePasswords()) {

            return;

        }

        setButtonLoading(true);

        try {

            await API.changePassword(

                elements.currentPassword.value,

                elements.newPassword.value,

                elements.confirmPassword.value

            );

            showAlert(

                "success",

                "Your password has been updated successfully."

            );

            elements.form.reset();

            updateStrengthMeter();

        }

        catch (error) {

            showAlert(

                "danger",

                error.message ||

                "Unable to update password."

            );

        }

        finally {

            setButtonLoading(false);

        }

    }

    /* ==========================================================================
       Password Validation
       ========================================================================== */

    function validatePasswords() {

        const currentPassword =

            elements.currentPassword.value.trim();

        const newPassword =

            elements.newPassword.value.trim();

        const confirmPassword =

            elements.confirmPassword.value.trim();

        if (

            !currentPassword ||

            !newPassword ||

            !confirmPassword

        ) {

            showAlert(

                "warning",

                "Please complete all password fields."

            );

            return false;

        }

        if (newPassword.length < 8) {

            showAlert(

                "warning",

                "New password must contain at least 8 characters."

            );

            return false;

        }

        if (newPassword !== confirmPassword) {

            showAlert(

                "danger",

                "New passwords do not match."

            );

            return false;

        }

        if (currentPassword === newPassword) {

            showAlert(

                "warning",

                "Your new password must be different from your current password."

            );

            return false;

        }

        return true;

    }

    /* ==========================================================================
       Password Strength
       ========================================================================== */

    function updateStrengthMeter() {

        if (

            !elements.strengthBar ||

            !elements.strengthText

        ) {

            return;

        }

        const password =

            elements.newPassword.value;

        let score = 0;

        if (password.length >= 8) score++;

        if (/[A-Z]/.test(password)) score++;

        if (/[a-z]/.test(password)) score++;

        if (/[0-9]/.test(password)) score++;

        if (/[^A-Za-z0-9]/.test(password)) score++;

        const percentage = score * 20;

        elements.strengthBar.style.width =

            percentage + "%";

        elements.strengthBar.className =

            "progress-bar";

        switch (score) {

            case 0:

            case 1:

                elements.strengthBar.classList.add(

                    "bg-danger"

                );

                elements.strengthText.textContent =

                    "Very Weak";

                break;

            case 2:

                elements.strengthBar.classList.add(

                    "bg-warning"

                );

                elements.strengthText.textContent =

                    "Weak";

                break;

            case 3:

                elements.strengthBar.classList.add(

                    "bg-info"

                );

                elements.strengthText.textContent =

                    "Fair";

                break;

            case 4:

                elements.strengthBar.classList.add(

                    "bg-primary"

                );

                elements.strengthText.textContent =

                    "Good";

                break;

            case 5:

                elements.strengthBar.classList.add(

                    "bg-success"

                );

                elements.strengthText.textContent =

                    "Strong";

                break;

        }

    }

    /* ==========================================================================
       Alerts
       ========================================================================== */

    function showAlert(type, message) {

        if (!elements.alert) {

            alert(message);

            return;

        }

        elements.alert.className =

            `alert alert-${type}`;

        elements.alert.textContent =

            message;

        elements.alert.classList.remove(

            "d-none"

        );

    }

    function clearAlert() {

        if (!elements.alert) {

            return;

        }

        elements.alert.className =

            "alert d-none";

        elements.alert.textContent =

            "";

    }

    /* ==========================================================================
       Button State
       ========================================================================== */

    function setButtonLoading(loading) {

        if (!elements.submitButton) {

            return;

        }

        elements.submitButton.disabled =

            loading;

        elements.submitButton.innerHTML =

            loading

                ? `<span class="spinner-border spinner-border-sm me-2"></span>Updating...`

                : `<i class="bi bi-shield-check me-2"></i>Update Password`;

    }

    /* ==========================================================================
       Loading Overlay
       ========================================================================== */

    function showLoading() {

        if (!elements.loadingOverlay) {

            return;

        }

        elements.loadingOverlay.classList.remove(

            "d-none"

        );

    }

    function hideLoading() {

        if (!elements.loadingOverlay) {

            return;

        }

        elements.loadingOverlay.classList.add(

            "d-none"

        );

    }

    /* ==========================================================================
       Logout
       ========================================================================== */

    async function handleLogout(event) {

        event.preventDefault();

        try {

            if (

                typeof Auth !== "undefined" &&

                typeof Auth.logout === "function"

            ) {

                Auth.logout();

                return;

            }

            Storage.clearApplicationData();

            window.location.href = "login.html";

        }

        catch (error) {

            console.error(error);

            Storage.clearApplicationData();

            window.location.href = "login.html";

        }

    }

    /* ==========================================================================
       Helpers
       ========================================================================== */

    function updateCurrentDate() {

        if (!elements.currentDate) {

            return;

        }

        elements.currentDate.textContent =

            new Date().toLocaleDateString(

                undefined,

                {

                    weekday: "long",

                    year: "numeric",

                    month: "long",

                    day: "numeric"

                }

            );

    }

    /* ==========================================================================
       Error Handling
       ========================================================================== */

    function handleError(error) {

        console.error(

            "Change Password:",

            error

        );

        showAlert(

            "danger",

            error.message ||

            "Unable to load the page."

        );

    }

    /* ==========================================================================
       Public API
       ========================================================================== */

    return {

        initialize

    };

})();

Object.freeze(ChangePassword);

window.ChangePassword = ChangePassword;

/* ==========================================================================
   Bootstrap
   ========================================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            await Auth.initialize();

            // await Layout.initialize({
            //     pageTitle: "Change Password",
            //     activePage: "change-password"
            // });

            await ChangePassword.initialize();

        }

        catch (error) {

            console.error(
                "Change Password Bootstrap:",
                error
            );

        }

    }
);