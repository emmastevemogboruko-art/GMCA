/**
 * =============================================================================
 * GMCA Membership Management System
 * -----------------------------------------------------------------------------
 * File: login.js
 * =============================================================================
 */

"use strict";

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {

    const form = document.getElementById("loginForm");

    if (!form) {
        return;
    }

    // Footer year
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Toggle password
    const toggleButton = document.getElementById("togglePassword");

    if (toggleButton) {

        toggleButton.addEventListener("click", () => {

            const password = document.getElementById("password");

            const icon = toggleButton.querySelector("i");

            if (password.type === "password") {

                password.type = "text";

                icon.className = "bi bi-eye-slash";

            } else {

                password.type = "password";

                icon.className = "bi bi-eye";

            }

        });

    }

    form.addEventListener("submit", login);

}

async function login(event) {

    event.preventDefault();

    const loginButton = document.getElementById("loginButton");

    const spinner = document.getElementById("loginSpinner");

    const buttonText = document.getElementById("loginButtonText");

    loginButton.disabled = true;

    spinner.classList.remove("d-none");

    buttonText.textContent = "Signing In...";

    try {

        const identifier = document
            .getElementById("identifier")
            .value
            .trim();

        const password = document
            .getElementById("password")
            .value;

        const response = await API.login(
            identifier,
            password
        );

        if (!response.success) {

            throw new Error(
                response.message || "Login failed."
            );

        }

        Storage.set(
            CONFIG.STORAGE.TOKEN,
            response.data.token
        );

        Storage.setObject(
            CONFIG.STORAGE.MEMBER,
            response.data.user
        );

        window.location.href = "dashboard.html";

    }

    catch (error) {

        alert(
            error.message || "Unable to login."
        );

    }

    finally {

        loginButton.disabled = false;

        spinner.classList.add("d-none");

        buttonText.textContent = "Sign In";

    }

}